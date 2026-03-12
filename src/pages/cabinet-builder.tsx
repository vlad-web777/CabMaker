import React, { useState, useEffect } from "react";
import { cabinetConfig } from "../models/cabinetConfig";
import type { Cabinet, CabinetCategory } from "../types/cabinet";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";

const CabinetBuilder: React.FC = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  // ---------------------- Cabinet Type ----------------------
  const [cabinetType, setCabinetType] = useState<string>(
    searchParams.get("type") || "frameless"
  );

  // Filter config by cabinet type
  const filteredConfig: CabinetCategory[] = cabinetConfig.filter(
    (item) => item.type === cabinetType
  );

  // ---------------------- Sidebar Menu ----------------------
  const [activeMenu, setActiveMenu] = useState<string>(
    filteredConfig[0]?.menu || ""
  );

  useEffect(() => {
    // Update menu when type changes
    setActiveMenu(filteredConfig[0]?.menu || "");
  }, [cabinetType]);

  const category = filteredConfig.find((item) => item.menu === activeMenu);

  // ---------------------- Cabinet Selection ----------------------
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );

  const [search, setSearch] = useState<string>("");

  // Set default options when cabinet changes
  useEffect(() => {
    if (!selectedCabinet) return;

    const defaults: Record<string, string> = {};
    selectedCabinet.options?.forEach((opt) => {
      if (opt.type === "select" && opt.values) {
        defaults[opt.label] = opt.values[0];
      } else {
        defaults[opt.label] = "";
      }
    });
    setSelectedOptions(defaults);
  }, [selectedCabinet]);

  // ---------------------- Render ----------------------
  return (
    <>
      {/* Cabinet Type Switcher */}
      <div style={{ padding: "20px 30px", fontSize: "24px", fontWeight: "bold" }}>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "20px",
          padding: "0 30px",
        }}
      >
        {/* ---------------- Sidebar ---------------- */}
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

        {/* ---------------- Right Side ---------------- */}
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
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
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

      {/* ---------------- Modal Overlay ---------------- */}
      {selectedCabinet && (
        <div
          onClick={() => setSelectedCabinet(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "75%",
              maxWidth: "1100px",
              background: "white",
              borderRadius: "8px",
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedCabinet(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* Image */}
            <div>
              <img
                src={selectedCabinet.image}
                alt={selectedCabinet.name}
                style={{ width: "100%" }}
              />
            </div>

            {/* Options */}
            <div>
              <h2>{selectedCabinet.name}</h2>
              {selectedCabinet.options?.map((option) => (
                <div key={option.label} style={{ marginBottom: "15px" }}>
                  <label>{option.label}</label>
                  {option.type === "select" && (
                    <select
                      style={{ width: "100%", padding: "8px" }}
                      value={selectedOptions[option.label] || ""}
                      onChange={(e) =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.label]: e.target.value,
                        })
                      }
                    >
                      {option.values?.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}
                  {option.type === "input" && (
                    <input
                      type="text"
                      placeholder={option.placeholder}
                      style={{ width: "100%", padding: "8px" }}
                      value={selectedOptions[option.label] || ""}
                      onChange={(e) =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.label]: e.target.value,
                        })
                      }
                    />
                  )}
                  {option.type === "number" && (
                    <input
                      type="number"
                      placeholder={option.placeholder}
                      style={{ width: "100%", padding: "8px" }}
                      value={selectedOptions[option.label] || ""}
                      onChange={(e) =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.label]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}

              <button
                onClick={() =>
                  addToCart({
                    id: selectedCabinet.id,
                    name: selectedCabinet.name,
                    image: selectedCabinet.image,
                    quantity: 1,
                    options: selectedOptions,
                  })
                }
                style={{
                  marginTop: "10px",
                  background: "#2e7d32",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
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