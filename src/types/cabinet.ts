export type CabinetOption = {
  label: string
  type: "select" | "input" | "number"
  values?: string[]
  placeholder?: string

  /**
   * Whether this field must be filled before adding to cart
   */
  required?: boolean

  /**
   * XML tag used when building the KCD XML
   */
  xmlTag?: string

  /**
   * Controls whether customer can see this option
   * true or undefined = visible
   * false = hidden
   */
  visible?: boolean

  /**
   * Optional default value for hidden/internal fields
   * or visible fields if you want a preset
   */
  defaultValue?: string
}

export type Cabinet = {
  id: string
  name: string
  image: string
  fileName: string
  directory: string
  options?: CabinetOption[]
  menu?: string
}

export type CabinetCategory = {
  type: "framed" | "frameless"
  menu: string
  cabinets: Cabinet[]
}