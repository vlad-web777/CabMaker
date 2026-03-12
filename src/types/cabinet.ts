export type CabinetOption = {
  label: string
  type: "select" | "input" | "number"
  values?: string[]
  placeholder?: string
}

export type Cabinet = {
  id: string
  name: string
  image: string
  options?: CabinetOption[]
}

export type CabinetCategory = {
  type: "framed" | "frameless"   // NEW: cabinet system type
  menu: string                   // Base / Upper / Tall / etc
  cabinets: Cabinet[]
}