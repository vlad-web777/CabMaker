import { href, Route, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { cabinetConfig } from "../models/cabinetConfig"
import { generateKcdXml } from "../utils/generateKcdXml"

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateOptions
  } = useCart()

  const findCabinet = (id: string) => {
    for (const category of cabinetConfig) {
      //     const cab = category.cabinets.find(c => c.id === id)
      const cab = category.cabinets.find(c => String(c.id) === String(id))
      if (cab) return cab
    }
    return null
  }

  const handleSubmitQuote = () => {
    const xml = generateKcdXml(cart)
    console.log(xml)

    const blob = new Blob([xml], { type: "application/xml" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.href = url
    link.download = "kcd-job.xml"
    link.click()

    URL.revokeObjectURL(url)
  }

  const navigate = useNavigate();
  return (

    <div className="max-w-5xl mx-auto mt-24 px-6">
      <button className="mb-4 px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md transition text-sm font-semibold" onClick={() => navigate("/builder")}>
        Back to Selection
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        Your Cabinets
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-xl text-gray-500">
            Cart is Empty
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => {
              //const cabinet = findCabinet(item.id)
              const cabinet = findCabinet(item.id)

              if (!cabinet) return null

              return (
                <div
                  key={item.cartItemId}
                  className="border rounded-lg p-6 flex gap-6"
                >
                  <img
                    src={item.image}
                    className="w-24 h-24 object-contain"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-3">
                      {item.name}
                    </h2>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {cabinet.options?.map((opt) => {
                        const value = item.options?.[opt.label] ?? ""

                        return (
                          <div key={opt.label}>
                            <label className="text-sm text-gray-600">
                              {opt.label}
                              {opt.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>

                            {opt.type === "select" && (
                              <select
                                className="w-full border rounded px-2 py-1 mt-1"
                                value={value || opt.values?.[0] || ""}
                                onChange={(e) =>
                                  updateOptions(item.cartItemId, {
                                    ...(item.options || {}),
                                    [opt.label]: e.target.value
                                  })
                                }
                              >
                                {opt.values?.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            )}

                            {opt.type === "input" && (
                              <input
                                type="text"
                                className="w-full border rounded px-2 py-1 mt-1"
                                value={value}
                                onChange={(e) =>
                                  updateOptions(item.cartItemId, {
                                    ...(item.options || {}),
                                    [opt.label]: e.target.value
                                  })
                                }
                              />
                            )}

                            {opt.type === "number" && (
                              <input
                                type="number"
                                className="w-full border rounded px-2 py-1 mt-1"
                                value={value}
                                onChange={(e) =>
                                  updateOptions(item.cartItemId, {
                                    ...(item.options || {}),
                                    [opt.label]: e.target.value
                                  })
                                }
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 border rounded"
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          -
                        </button>

                        <span className="w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          className="px-2 py-1 border rounded"
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={handleSubmitQuote}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-semibold"
            >
              Generate XML
            </button>
          </div>
        </>
      )}
    </div>
  )
}