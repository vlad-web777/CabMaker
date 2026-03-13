import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cabinetConfig } from "../models/cabinetConfig";
import type { Cabinet, CabinetCategory, CabinetOption } from "../types/cabinet";
import { useCart } from "../context/CartContext";

/**
 * Cabinet Builder
 *
 * Features:
 * - Cabinet type switcher
 * - Sidebar category menu
 * - Searchable cabinet grid
 * - Cabinet modal
 * - Required field validation
 * - Scrollable modal
 * - Hidden/system options support
 */
const CabinetBuilder: React.FC = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  /**
   * Cabinet system type (frameless / framed)
   */
  const [cabinetType, setCabinetType] = useState<string>(
    searchParams.get("type") || "frameless"
  );

  /**
   * Filter all config categories to selected type
   */
  const filteredConfig: CabinetCategory[] = cabinetConfig.filter(
    (item) => item.type === cabinetType
  );

  /**
   * Active sidebar menu
   */
  const [activeMenu, setActiveMenu] = useState<string>(
    filteredConfig[0]?.menu || ""
  );

  /**
   * Cabinet currently open in modal
   */
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);

  /**
   * Entered / selected option values for current cabinet
   */
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );

  /**
   * Tracks fields user interacted with
   */
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Cabinet search
   */
  const [search, setSearch] = useState<string>("");

  /**
   * Reset sidebar menu when cabinet type changes
   */
  useEffect(() => {
    setActiveMenu(filteredConfig[0]?.menu || "");
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
   * Find active category by menu
   */
  const category = filteredConfig.find((item) => item.menu === activeMenu);

  /**
   * Initialize cabinet options when modal opens
   *
   * Rules:
   * - select => first value, unless defaultValue exists
   * - input/number => defaultValue or ""
   * - hidden options are still initialized
   */
  useEffect(() => {
    if (!selectedCabinet) return;

    const defaults: Record<string, string> = {};

    selectedCabinet.options?.forEach((opt) => {
      if (opt.defaultValue !== undefined) {
        defaults[opt.label] = opt.defaultValue;
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

  /**
   * Treat blank / whitespace as empty
   */
  const isFieldEmpty = (value: string | undefined) => {
    return !value || value.trim() === "";
  };

  /**
   * Only options visible to customer should be rendered
   * hidden options are still stored internally
   */
  const visibleOptions: CabinetOption[] = useMemo(() => {
    if (!selectedCabinet?.options) return [];

    return selectedCabinet.options.filter((opt) => opt.visible !== false);
  }, [selectedCabinet]);

  /**
   * Validate only required fields that the customer can actually see/fill
   */
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

  /**
   * Update one option value
   */
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

  /**
   * Close modal and reset state
   */
  const closeModal = () => {
    setSelectedCabinet(null);
    setSelectedOptions({});
    setTouchedFields({});
  };

  /**
   * Add cabinet to cart only if visible required fields are complete
   */
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
          {filteredConfig.map((item) => (
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

          {/* Cabinet Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "20px",
            }}
          >
            {category?.cabinets
              .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((cabinet) => (
                <div
                  key={cabinet.id}
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
                    {cabinet.name}
                  </div>
                </div>
              ))}
          </div>
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
            {/* Close */}
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