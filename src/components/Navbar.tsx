import { useState } from "react";
import { Menu, X, ChevronDown, User, ShoppingCart } from "lucide-react";

const navLinks = [
  {
    label: "Frameless Cabinetry",
    href: "#",
    dropdown: ["Base Cabinets", "Wall Cabinets", "Tall Cabinets", "Corner Units"],
  },
  {
    label: "Framed Cabinetry",
    href: "#",
    dropdown: ["Traditional Framed"],
  },
  {
    label: "Our Work",
    href: "#",
    dropdown: [],
  },
  { label: "About Us", href: "#", dropdown: [] },
  { label: "Contact Us", href: "#", dropdown: [] },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[70px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <div className="relative w-9 h-9">
              {/*
              <div className="absolute inset-0 bg-[#1a1a2e] rounded-md flex items-center justify-center">
                <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                  <rect x="3" y="3" width="12" height="12" rx="2" fill="white" />
                  <rect x="17" y="3" width="16" height="8" rx="2" fill="#4ade80" />
                  <rect x="3" y="17" width="16" height="16" rx="2" fill="white" opacity="0.6" />
                  <rect x="21" y="13" width="12" height="20" rx="2" fill="white" opacity="0.4" />
                </svg>
              </div>
              */}
            </div>
            <span className="text-[#1a1a2e] tracking-tight" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Elite Kitchen <span className="text-[#22c55e]">Design</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] transition-colors duration-200 whitespace-nowrap"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                {link.label}
                {link.dropdown.length > 0 && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                  />
                )}
              </a>
              {link.dropdown.length > 0 && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-white shadow-xl border border-gray-100 rounded-b-lg overflow-hidden z-50">
                  {link.dropdown.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2.5 text-[#444] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors duration-150"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] transition-colors duration-200" style={{ fontSize: "0.875rem" }}>
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[#1a1a2e] hover:text-[#22c55e] transition-colors duration-200 relative" style={{ fontSize: "0.875rem" }}>
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22c55e] text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.625rem", fontWeight: 700 }}>
              0
            </span>
          </button>
          <a
            href="#"
            className="px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md transition-colors duration-200 whitespace-nowrap"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Online Ordering
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-[#1a1a2e]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <a
                  href={link.href}
                  className="block px-3 py-2.5 text-[#1a1a2e] hover:text-[#22c55e] hover:bg-[#f0fdf4] rounded-md transition-colors"
                  style={{ fontSize: "0.9375rem", fontWeight: 500 }}
                >
                  {link.label}
                </a>
                {link.dropdown.length > 0 && (
                  <div className="ml-4 flex flex-col gap-0.5 mt-0.5">
                    {link.dropdown.map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block px-3 py-2 text-[#666] hover:text-[#22c55e] hover:bg-[#f0fdf4] rounded-md transition-colors"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-[#1a1a2e]" style={{ fontSize: "0.9375rem" }}>
                <User className="w-4 h-4" /> Sign In
              </button>
              <a
                href="#"
                className="px-5 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md text-center transition-colors"
                style={{ fontWeight: 600 }}
              >
                Online Ordering
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
