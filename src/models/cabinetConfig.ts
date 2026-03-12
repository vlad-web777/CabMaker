import type { CabinetCategory } from "../types/cabinet";

export const cabinetConfig: CabinetCategory[] = [
  // ===========================
  // Base Cabinets (with items)
  // ===========================
  {
    type: "frameless",
    menu: "Base",
    cabinets: [
      {
        id: "base-cabinet-1-drawer",
        name: "Base Cabinet 1 Drawer",
        image: "/cabinets/base-1-drawer.png",
        options: [
          { label: "Width", type: "input", placeholder: "Enter width (inches)" },
          { label: "Height", type: "input", placeholder: "Enter height" },
          { label: "Finish", type: "select", values: ["White", "Gray", "Oak"] },
        ],
      },
      {
        id: "base-3-drawer",
        name: "Base 3 Drawer",
        image: "/cabinets/base-3-drawer.png",
        options: [
          { label: "Width", type: "input", placeholder: "Enter width (inches)" },
          { label: "Height", type: "input", placeholder: "Enter height" },
          { label: "Finish", type: "select", values: ["White", "Gray", "Oak"] },
        ],
      },
    ],
  },
  {
    type: "framed",
    menu: "Base",
    cabinets: [
      {
        id: "framed-base-1-drawer",
        name: "Framed Base 1 Drawer",
        image: "/cabinets/framed-base-1-drawer.png",
        options: [
          { label: "Width", type: "input", placeholder: "Enter width (inches)" },
          { label: "Height", type: "input", placeholder: "Enter height" },
          { label: "Finish", type: "select", values: ["White", "Cherry", "Maple"] },
          { label: "Door Style", type: "select", values: ["Shaker", "Raised Panel", "Flat Panel"] },
        ],
      },
      {
        id: "framed-base-3-drawer",
        name: "Framed Base 3 Drawer",
        image: "/cabinets/framed-base-3-drawer.png",
        options: [
          { label: "Width", type: "input", placeholder: "Enter width (inches)" },
          { label: "Height", type: "input", placeholder: "Enter height" },
          { label: "Finish", type: "select", values: ["White", "Cherry", "Maple"] },
          { label: "Door Style", type: "select", values: ["Shaker", "Raised Panel", "Flat Panel"] },
        ],
      },
    ],
  },

  // ===========================
  // Upper and Tall Cabinets (empty)
  // ===========================
  { type: "frameless", menu: "Upper", cabinets: [] },
  { type: "frameless", menu: "Tall", cabinets: [] },
  { type: "framed", menu: "Upper", cabinets: [] },
  { type: "framed", menu: "Tall", cabinets: [] },
];