export type CartItem = {
  cartItemId: string
  id: string
  name: string
  image: string
  quantity: number
  options?: Record<string, string>
}