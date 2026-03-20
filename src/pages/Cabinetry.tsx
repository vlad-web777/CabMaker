import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cabinet, CabinetOption } from "../types/cabinet";

type CabinetType = "frameless" | "framed";

type MenuConfig = {
  type: CabinetType;
  menu: string;
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

export default function Cabinetry() {
  const navigate = useNavigate();

  const [cabinetType, setCabinetType] = useState<CabinetType>("frameless");
  const [activeMenu, setActiveMenu] = useState<string>("Base");

  const [allCabinets, setAllCabinets] = useState<Cabinet[]>([]);
  const [loadingCabinets, setLoadingCabinets] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string>("");

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [search, setSearch] = useState<string>("");

  const menusForType = useMemo(
    () => cabinetMenus.filter((item) => item.type === cabinetType),
    [cabinetType]
  );

  useEffect(() => {
    const menuStillValid = menusForType.some((item) => item.menu === activeMenu);

    if (!menuStillValid) {
      setActiveMenu(menusForType[0]?.menu || "");
    }
  }, [cabinetType, activeMenu, menusForType]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCabinets() {
      try {
        setLoadingCabinets(true);
        setLoadingError("");

        const API_BASE = import.meta.env.VITE_API_BASE;

        if (!API_BASE) {
          throw new Error("VITE_API_BASE is missing.");
        }

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

  const visibleOptions: CabinetOption[] = useMemo(() => {
    if (!selectedCabinet?.options) return [];
    return selectedCabinet.options.filter((opt) => opt.visible !== false);
  }, [selectedCabinet]);

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

  const closeModal = () => {
    setSelectedCabinet(null);
  };

  return (
    <>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "10px",
              color: "#1f2937",
            }}
          >
            Cabinetry
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#4b5563",
              lineHeight: 1.6,
              maxWidth: "900px",
              marginBottom: "20px",
            }}
          >
            Browse our available cabinet styles and configurations here. This page
            is for viewing cabinets only. To begin an order, please use{" "}
            <strong>Online Ordering</strong> from the navigation so we can collect
            your job details first.
          </p>

          <div
            style={{
              background: "#f6fbf7",
              border: "1px solid #d9eadb",
              borderRadius: "10px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                Ready to place an order?
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.5,
                }}
              >
                Start through Online Ordering so we can collect your project and
                job information before building your order.
              </div>
            </div>

            <button
              onClick={() => navigate("/shop-standards")}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Start Online Ordering
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setCabinetType("frameless")}
            style={{
              background: cabinetType === "frameless" ? "#2e7d32" : "#fff",
              color: cabinetType === "frameless" ? "#fff" : "#1f2937",
              border: "1px solid #cfcfcf",
              borderRadius: "6px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Frameless Cabinetry
          </button>

          <button
            onClick={() => setCabinetType("framed")}
            style={{
              background: cabinetType === "framed" ? "#2e7d32" : "#fff",
              color: cabinetType === "framed" ? "#fff" : "#1f2937",
              border: "1px solid #cfcfcf",
              borderRadius: "6px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Framed Cabinetry
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "20px",
          }}
        >
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
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {item.menu}
              </button>
            ))}
          </div>

          <div>
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
                  boxSizing: "border-box",
                }}
              />
            </div>

            {loadingCabinets && (
              <div style={{ padding: "12px 0", color: "#555" }}>
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

            {!loadingCabinets && !loadingError && displayedCabinets.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
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
                      background: "#fff",
                    }}
                  >
                    <img
                      src={cabinet.image}
                      alt={cabinet.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        background: "#fafafa",
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
      </div>

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

            <div>
              <h2 style={{ marginBottom: "20px" }}>{selectedCabinet.name}</h2>

              <p
                style={{
                  color: "#4b5563",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                This cabinet can be ordered through our <strong>Online Ordering</strong>{" "}
                flow after you complete the project questions.
              </p>

              {visibleOptions.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      marginBottom: "12px",
                      color: "#1f2937",
                    }}
                  >
                    Available Options
                  </h3>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {visibleOptions.map((option) => (
                      <div
                        key={option.label}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {option.label}
                          {option.required && (
                            <span style={{ color: "#d32f2f", marginLeft: "4px" }}>
                              *
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: 1.5,
                          }}
                        >
                          {option.type === "select" && option.values?.length
                            ? option.values.join(", ")
                            : option.placeholder || option.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: "10px",
                  padding: "14px",
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                To add this cabinet to a project, please begin through{" "}
                <strong>Online Ordering</strong> from the navigation menu.
              </div>

              <button
                onClick={() => navigate("/shop-standards")}
                style={{
                  marginTop: "16px",
                  background: "#2e7d32",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Start Online Ordering
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}