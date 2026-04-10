import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Cabinet, CabinetOption } from "../types/cabinet";
import { useCart } from "../context/CartContext";

type CabinetType = "frameless" | "framed";

type MenuConfig = {
  type: CabinetType;
  menu: string;
};
// Shop standards types
type ShopStandards = {
  measurementUnit: string;
  presetName: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  doorType: string;
  sidesMaterial: string;
  baseCabinetHeight: number;
  baseCabinetDepth: number;
  topCabinetHeight: number;
  topCabinetDepth: number;
  tallCabinetHeight: number;
  tallCabinetDepth: number;
  kickHeight: number;
  kickDepth: number;
  constructionMethod: string;
  shelfEdgeband: string;
  topDrawerHeight: number;
  drawerStyle: string;
};

const cabinetMenus: MenuConfig[] = [
  { type: "frameless", menu: "Base" },
  { type: "frameless", menu: "Upper" },
  { type: "frameless", menu: "Tall" },
  { type: "frameless", menu: "Base Corner" },

  { type: "framed", menu: "Base" },
  { type: "framed", menu: "Upper" },
  { type: "framed", menu: "Tall" },
  { type: "framed", menu: "Base Corner" },
];



/**
 * Cabinet Builder
 *
 * Backend-driven version:
 * - cabinet data comes from API
 * - menu list stays local
 * - fetches when page opens / type changes
 * - search across all cabinets for selected type
 * - modal with required field validation
 */
const CabinetBuilder: React.FC = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialType =
    searchParams.get("type") === "framed" ? "framed" : "frameless";

  const [cabinetType, setCabinetType] = useState<CabinetType>(initialType);

  const menusForType = useMemo(
    () => cabinetMenus.filter((item) => item.type === cabinetType),
    [cabinetType]
  );

  const initialMenuFromUrl = searchParams.get("menu") || "";
  const safeInitialMenu =
    menusForType.find((m) => m.menu === initialMenuFromUrl)?.menu ||
    menusForType[0]?.menu ||
    "";

  const [activeMenu, setActiveMenu] = useState<string>(safeInitialMenu);

  const [allCabinets, setAllCabinets] = useState<Cabinet[]>([]);
  const [loadingCabinets, setLoadingCabinets] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string>("");

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [search, setSearch] = useState<string>("");
  
  // Vlad 3-3-2026: Load tje presets from localStorate
  const [shopStandards, setShopStandards] = useState<ShopStandards | null>(null);
  useEffect(() => {
  const saved = localStorage.getItem("shopStandards");
  if (saved) {
    try {
      setShopStandards(JSON.parse(saved));
    } catch {
      setShopStandards(null);
    }
  }
}, []);

  /**
   * Keep active menu valid when type changes
   */
  useEffect(() => {
    const availableMenus = cabinetMenus.filter((item) => item.type === cabinetType);
    const urlMenu = searchParams.get("menu") || "";

    const validMenu =
      availableMenus.find((item) => item.menu === urlMenu)?.menu ||
      availableMenus[0]?.menu ||
      "";

    setActiveMenu(validMenu);
  }, [cabinetType, searchParams]);

  /**
   * Keep URL in sync
   */
  useEffect(() => {
    if (!cabinetType || !activeMenu) return;

    setSearchParams(
      {
        type: cabinetType,
        menu: activeMenu,
      },
      { replace: true }
    );
  }, [cabinetType, activeMenu, setSearchParams]);

  /**
   * Fetch cabinets when page opens / type changes
   *
   * Example backend endpoint:
   * GET /api/cabinets?type=frameless
   *
   * Expected response:
   * Cabinet[]
   */
  useEffect(() => {
    let isMounted = true;

    async function fetchCabinets() {
      try {
        setLoadingCabinets(true);
        setLoadingError("");

        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:5371/APIError}";

        const response = await fetch(
          `${API_BASE}/fetchCabinetList?type=${encodeURIComponent(cabinetType)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load cabinets (${response.status})`);
        }

        const data: Cabinet[] = await response.json();

        if (!isMounted) return;

        setAllCabinets(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!isMounted) return;

        setAllCabinets([]);
        setLoadingError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading cabinets."
        );
      } finally {
        if (isMounted) {
          setLoadingCabinets(false);
        }
      }
    }

    fetchCabinets();

    return () => {
      isMounted = false;
    };
  }, [cabinetType]);

  /**
   * Lock background scroll while modal is open
   */
  useEffect(() => {
    if (selectedCabinet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCabinet]);

  /**
   * Initialize option defaults when modal opens
   */
  useEffect(() => {
    if (!selectedCabinet) return;

    const defaults: Record<string, string> = {};

    selectedCabinet.options?.forEach((opt) => {
      if (opt.defaultValue !== undefined) {
        defaults[opt.label] = String(opt.defaultValue);
        return;
      }

      if (opt.type === "select" && opt.values?.length) {
        defaults[opt.label] = opt.values[0];
      } else {
        defaults[opt.label] = "";
      }
    });

    setSelectedOptions(defaults);
    setTouchedFields({});
  }, [selectedCabinet]);

  const isFieldEmpty = (value: string | undefined) => {
    return !value || value.trim() === "";
  };

  const visibleOptions: CabinetOption[] = useMemo(() => {
    if (!selectedCabinet?.options) return [];
    return selectedCabinet.options.filter((opt) => opt.visible !== false);
  }, [selectedCabinet]);

  const missingRequiredFields = useMemo(() => {
    if (!selectedCabinet) return [];

    return (
      selectedCabinet.options?.filter((opt) => {
        if (opt.visible === false) return false;
        if (!opt.required) return false;

        const value = selectedOptions[opt.label];
        return isFieldEmpty(value);
      }) || []
    );
  }, [selectedCabinet, selectedOptions]);

  const isCabinetValid = missingRequiredFields.length === 0;

  const handleOptionChange = (label: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [label]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [label]: true,
    }));
  };

  const closeModal = () => {
    setSelectedCabinet(null);
    setSelectedOptions({});
    setTouchedFields({});
  };

  const handleAddCabinet = () => {
    if (!selectedCabinet) return;

    const requiredVisibleFields =
      selectedCabinet.options?.filter(
        (opt) => opt.visible !== false && opt.required
      ) || [];

    const nextTouched: Record<string, boolean> = {};
    requiredVisibleFields.forEach((field) => {
      nextTouched[field.label] = true;
    });

    setTouchedFields((prev) => ({
      ...prev,
      ...nextTouched,
    }));

    if (!isCabinetValid) return;

    addToCart({
      id: selectedCabinet.id,
      name: selectedCabinet.name,
      image: selectedCabinet.image,
      quantity: 1,
      options: selectedOptions,
    });

    closeModal();
  };

  /**
   * Search behavior:
   * - no search => show only active menu
   * - with search => search across all cabinets for selected type
   *
   * Assumes each cabinet returned by API has a `menu` property.
   */
  const displayedCabinets = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return allCabinets
        .filter((cabinet) => cabinet.menu === activeMenu)
        .map((cabinet) => ({
          cabinet,
          menu: cabinet.menu,
        }));
    }

    return allCabinets
      .filter((cabinet) => cabinet.name.toLowerCase().includes(term))
      .map((cabinet) => ({
        cabinet,
        menu: cabinet.menu,
      }));
  }, [allCabinets, activeMenu, search]);

  return (
    <>
      {/* =========================
          CABINET TYPE SWITCHER
      ========================== */}
      <div
        style={{
          padding: "20px 30px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <button
          onClick={() => setCabinetType("frameless")}
          style={{
            marginRight: "10px",
            background: cabinetType === "frameless" ? "#2e7d32" : "#ccc",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Frameless
        </button>

        <button
          onClick={() => setCabinetType("framed")}
          style={{
            background: cabinetType === "framed" ? "#2e7d32" : "#ccc",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Framed
        </button>
      </div>

      {/* =========================
          PAGE LAYOUT
      ========================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "20px",
          padding: "0 30px",
        }}
      >
        {/* Sidebar */}
        <div>
          {menusForType.map((item) => (
            <button
              key={item.menu}
              onClick={() => setActiveMenu(item.menu)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "6px",
                background: activeMenu === item.menu ? "#e6f4ea" : "#fff",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {item.menu}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div>
          {/* Search */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search cabinets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Loading / Error */}
          {loadingCabinets && (
            <div
              style={{
                padding: "12px 0",
                color: "#555",
              }}
            >
              Loading cabinets...
            </div>
          )}

          {!loadingCabinets && loadingError && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                background: "#fdecea",
                color: "#b71c1c",
                border: "1px solid #f5c6cb",
                borderRadius: "6px",
              }}
            >
              {loadingError}
            </div>
          )}

          {/* Empty state */}
          {!loadingCabinets && !loadingError && displayedCabinets.length === 0 && (
            <div
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                color: "#666",
              }}
            >
              No cabinets found.
            </div>
          )}

          {/* Cabinet Grid */}
          {!loadingCabinets && !loadingError && displayedCabinets.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "20px",
              }}
            >
              {displayedCabinets.map(({ cabinet, menu }) => (
                <div
                  key={`${menu}-${cabinet.id}`}
                  onClick={() => setSelectedCabinet(cabinet)}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={cabinet.image}
                    alt={cabinet.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    style={{
                      background: "#555",
                      color: "white",
                      padding: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <div>{cabinet.name}</div>

                    {search.trim() && (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "12px",
                          opacity: 0.85,
                        }}
                      >
                        {menu}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          CABINET MODAL
      ========================== */}
      {selectedCabinet && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "40px 20px",
            zIndex: 1000,
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1100px",
              background: "white",
              borderRadius: "8px",
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              position: "relative",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
              aria-label="Close cabinet modal"
            >
              ✕
            </button>

            {/* Left Side */}
            <div>
              <img
                src={selectedCabinet.image}
                alt={selectedCabinet.name}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Right Side */}
            <div>
              <h2 style={{ marginBottom: "20px" }}>{selectedCabinet.name}</h2>

              {visibleOptions.map((option) => {
                const value = selectedOptions[option.label] || "";
                const showError =
                  option.required &&
                  touchedFields[option.label] &&
                  isFieldEmpty(value);

                return (
                  <div key={option.label} style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: 500,
                      }}
                    >
                      {option.label}
                      {option.required && (
                        <span style={{ color: "#d32f2f", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </label>

                    {option.type === "select" && (
                      <select
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: showError ? "1px solid #d32f2f" : "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                        value={value}
                        onChange={(e) =>
                          handleOptionChange(option.label, e.target.value)
                        }
                        onBlur={() =>
                          setTouchedFields((prev) => ({
                            ...prev,
                            [option.label]: true,
                          }))
                        }
                      >
                        {option.values?.map((optionValue) => (
                          <option key={optionValue} value={optionValue}>
                            {optionValue}
                          </option>
                        ))}
                      </select>
                    )}

                    {option.type === "input" && (
                      <input
                        type="text"
                        placeholder={option.placeholder}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: showError ? "1px solid #d32f2f" : "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                        value={value}
                        onChange={(e) =>
                          handleOptionChange(option.label, e.target.value)
                        }
                        onBlur={() =>
                          setTouchedFields((prev) => ({
                            ...prev,
                            [option.label]: true,
                          }))
                        }
                      />
                    )}

                    {option.type === "number" && (
                      <input
                        type="number"
                        min={0}
                        placeholder={option.placeholder}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: showError ? "1px solid #d32f2f" : "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                        value={value}
                        onChange={(e) =>
                          handleOptionChange(option.label, e.target.value)
                        }
                        onBlur={() =>
                          setTouchedFields((prev) => ({
                            ...prev,
                            [option.label]: true,
                          }))
                        }
                      />
                    )}

                    {showError && (
                      <div
                        style={{
                          color: "#d32f2f",
                          fontSize: "13px",
                          marginTop: "6px",
                        }}
                      >
                        {option.label} is required.
                      </div>
                    )}
                  </div>
                );
              })}

              {!isCabinetValid && (
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    color: "#d32f2f",
                    fontSize: "14px",
                  }}
                >
                  Please fill out all required fields before adding this cabinet.
                </div>
              )}

              <button
                onClick={handleAddCabinet}
                disabled={!isCabinetValid}
                style={{
                  marginTop: "10px",
                  background: isCabinetValid ? "#2e7d32" : "#9e9e9e",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isCabinetValid ? "pointer" : "not-allowed",
                  opacity: isCabinetValid ? 1 : 0.85,
                }}
              >
                Add Cabinet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CabinetBuilder;