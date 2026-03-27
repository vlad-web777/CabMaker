import type { CabinetCategory } from "../types/cabinet"

export const cabinetConfig: CabinetCategory[] = [

  /* =========================
      FRAMELESS CABINETS
  ==========================*/

  {
    type: "frameless",
    menu: "Base",
    cabinets: [
      {
        id: "base-1-drawer-cabinet",
        name: "Base 1 Drawer Cabinet",
        image: "/cabinets/base-1-drawer.png",
        directory: "FRAMLESS",
        fileName: "201.cab",
        options: [
          {
            label: "Width",
            type: "number",
            required: true,
            xmlTag: "Width",
            visible: true
          },
          {
            label: "Height",
            type: "number",
            required: true,
            xmlTag: "Height",
            visible: true
          },
          {
            label: "Depth",
            type: "number",
            required: true,
            xmlTag: "Depth",
            visible: true
          },
          {
            label: "Material",
            type: "select",
            values: ["Ply UV Maple", "White Mel"],
            required: true,
            xmlTag: "PLTCabinetMaterial",
            visible: true
          },
          {
            label: "Drawer Front",
            type: "select",
            values: ["Slab", "FLAT"],
            xmlTag: "PLTDrawerFront",
            visible: false
          },
          {
            label: "Top Door",
            type: "select",
            values: ["Slab", "FLAT"],
            xmlTag: "PLTTopDoor",
            visible: false
          },
          {
            label: "Base Door",
            type: "select",
            values: ["Slab", "FLAT"],
            xmlTag: "PLTBaseDoor",
            visible: false
          },
          {
            label: "Left Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "LFinish",
            visible: false
          },
          {
            label: "Right Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "RFinish",
            visible: false
          },
          {
            label: "Rollouts",
            type: "number",
            xmlTag: "PLTNumberOfRollouts",
            visible: true
          }
        ]
      },

      {
        id: "base-2-drawer",
        name: "Base 2 Drawer Cabinet",
        image: "/cabinets/base-2-drawer.png",
        directory: "FRAMLESS",
        fileName: "211.cab",
        options: [
          {
            label: "Width",
            type: "number",
            required: true,
            xmlTag: "Width",
            visible: true
          },
          {
            label: "Height",
            type: "number",
            required: true,
            xmlTag: "Height",
            visible: true
          },
          {
            label: "Depth",
            type: "number",
            required: true,
            xmlTag: "Depth",
            visible: true
          },
          {
            label: "Material",
            type: "select",
            values: ["Ply UV Maple", "White Mel"],
            xmlTag: "PLTCabinetMaterial",
            visible: true
          },
          {
            label: "Drawer Front",
            type: "select",
            values: ["Slab", "FLAT"],
            xmlTag: "PLTDrawerFront",
            visible: false
          },
          {
            label: "Left Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "LFinish",
            visible: false
          },
          {
            label: "Right Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "RFinish",
            visible: false
          }
        ]
      }
    ]
  },

  {
    type: "frameless",
    menu: "Upper",
    cabinets: [
      {
        id: "base-3-drawer-cabinet",
        name: "Upper 3 Drawer Cabinet",
        image: "/cabinets/upper-3-drawer.png",
        directory: "FRAMLESS",
        fileName: "451.cab",
        options: [
          {
            label: "Width",
            type: "number",
            required: true,
            xmlTag: "Width",
            visible: true
          },
          {
            label: "Height",
            type: "number",
            required: true,
            xmlTag: "Height",
            visible: true
          },
          {
            label: "Depth",
            type: "number",
            required: true,
            xmlTag: "Depth",
            visible: true
          },
          {
            label: "Hinge",
            type: "select",
            values: ["1", "2", "3"],
            xmlTag: "Hinge",
            visible: false
          },
          {
            label: "Material",
            type: "select",
            values: ["Ply UV Maple", "White Mel"],
            xmlTag: "PLTCabinetMaterial",
            visible: true
          },
          {
            label: "Top Door",
            type: "select",
            values: ["Slab", "FLAT"],
            xmlTag: "PLTTopDoor",
            visible: false
          },
          {
            label: "Left Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "LFinish",
            visible: false
          },
          {
            label: "Right Finish",
            type: "select",
            values: ["1", "2"],
            xmlTag: "RFinish",
            visible: false
          }
        ]
      }
    ]
  },

  /* =========================
        FRAMED CABINETS
  ==========================*/

  {
    type: "framed",
    menu: "Base",
    cabinets: [
      {
        id: "framed-base-1-drawer",
        name: "Framed Base 1 Drawer Cabinet",
        image: "/cabinets/framed-base-1-drawer.png",
        directory: "FRAMED",
        fileName: "201.cab",
        options: [
          {
            label: "Width",
            type: "number",
            required: true,
            xmlTag: "Width",
            visible: true
          },
          {
            label: "Height",
            type: "number",
            required: true,
            xmlTag: "Height",
            visible: true
          },
          {
            label: "Depth",
            type: "number",
            required: true,
            xmlTag: "Depth",
            visible: true
          },
          {
            label: "Material",
            type: "select",
            values: ["Maple", "Oak"],
            xmlTag: "PLTCabinetMaterial",
            visible: true
          }
        ]
      }
    ]
  },

  /* =========================
        EMPTY MENUS
  ==========================*/

  { type: "frameless", menu: "Tall", cabinets: [] },
  { type: "framed", menu: "Upper", cabinets: [] },
  { type: "framed", menu: "Tall", cabinets: [] }

]