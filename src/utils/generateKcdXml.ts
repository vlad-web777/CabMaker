import type { CartItem } from "../types/cart"
import { cabinetConfig } from "../models/cabinetConfig"

export function generateKcdXml(cart: CartItem[]) {

  const findCabinet = (id: string) => {
    for (const category of cabinetConfig) {
      const cab = category.cabinets.find(c => c.id === id)
      if (cab) return cab
    }
    return null
  }

  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`
  xml += `<Root verify="ValidKCDXml">\n`

  cart.forEach(item => {

    const cabinet = findCabinet(item.id)
    if (!cabinet) return

    xml += `  <Unit>\n`

    xml += `    <Directory>${cabinet.directory}</Directory>\n`
    xml += `    <FileName>${cabinet.fileName}</FileName>\n`
    xml += `    <Quantity>${item.quantity}</Quantity>\n`

    cabinet.options?.forEach(opt => {

      const value = item.options?.[opt.label]

      if (!value) return
      if (!opt.xmlTag) return

      xml += `    <${opt.xmlTag}>${value}</${opt.xmlTag}>\n`

    })

    xml += `  </Unit>\n`

  })

  xml += `</Root>`

  return xml
}