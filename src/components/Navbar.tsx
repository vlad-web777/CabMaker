import { useState } from "react";
import { Menu, X, ChevronDown, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "react-oidc-context"
import ScrollToTop from "./ScrollToTop";

const CompanyName = "Elite Kitchen Design"

const navLinks = [
  {
    label: "Cabinetry",
    href:"/Cabinetry",
    dropdown:[]
  },
  // {
  //   label: "Frameless Cabinetry",
  //   href: "/builder?type=frameless",
  //   dropdown: [
  //     { label: "Base Cabinets", href: "/builder?type=frameless&menu=Base" },
  //     { label: "Wall Cabinets", href: "/builder?type=frameless&menu=Upper" },
  //     { label: "Tall Cabinets", href: "/builder?type=frameless&menu=Tall" },
  //     { label: "Corner Units", href: "/builder?type=frameless&menu=Base Corner" },
  //   ],
  // },
  // {
  //   label: "Framed Cabinetry",
  //   href: "/builder?type=framed",
  //   dropdown: [
  //     { label: "Base Cabinets", href: "/builder?type=framed&menu=Base" },
  //     { label: "Wall Cabinets", href: "/builder?type=framed&menu=Upper" },
  //     { label: "Tall Cabinets", href: "/builder?type=framed&menu=Tall" },
  //     { label: "Corner Units", href: "/builder?type=framed&menu=Base Corner" },
  //   ],
  // },
  { label: "Our Work", href: "/work", dropdown: [] },
  { label: "About Us", href: "/about", dropdown: [] },
  { label: "Contact Us", href: "/contact", dropdown: [] },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const auth = useAuth()
  
  const callApi = async () => {
    const helloAPI = import.meta.env.VITE_HELLO_API
    const res = await fetch(helloAPI)
    const data = await res.json()
    alert(data)
  }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[70px]">

        {/* Logo */}
        <Link onClick={() => ScrollToTop()} to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[#1a1a2e] tracking-tight text-[1.5rem] font-bold">
            <span className="text-[#22c55e]">{CompanyName}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to={link.href}
                className="flex items-center gap-1 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] transition text-sm font-medium"
              >
                {link.label}
                {link.dropdown.length > 0 && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${openDropdown === link.label ? "rotate-180" : ""
                      }`}
                  />
                )}
              </Link>

              {/* {link.dropdown.length > 0 && openDropdown === link.label && (
                <div className="absolute top-full left-0 w-52 bg-white shadow-xl border border-gray-100 rounded-b-lg overflow-hidden z-50">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block px-4 py-2.5 text-[#444] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )} */}
            </div>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-3">
          {auth.isAuthenticated ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e]"
            >
              <User className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => auth.signinRedirect()}
              className="flex items-center gap-1.5 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] cursor-pointer"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}

          <Link
            to="/cart"
            className="flex items-center gap-1.5 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] relative text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/shop-standards"
            className="px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md transition text-sm font-semibold"
          >
            Online Ordering
          </Link>
          <button onClick={callApi}>Test API</button>
        </div>

        {/* Mobile Right Side (Icons + Burger) */}
        <div className="lg:hidden flex items-center gap-3 ml-auto">
          <button className="flex items-center gap-1.5 text-[#1a1a2e]">
            <User className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative flex items-center gap-1.5 text-[#1a1a2e]">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="p-2 text-[#1a1a2e]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-screen overflow-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.href}
                  className="block px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e]"
                >
                  {link.label}
                </Link>
{/* 
                {link.dropdown.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-[#22c55e]"
                  >
                    {item.label}
                  </Link>
                ))} */}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}