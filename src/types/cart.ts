export type CartItem = {
  id: string
  name: string
  image: string
  quantity: number
  options?: Record<string, string>
}