import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import makramsLogo from "../assets/makrams.png";

const footerLinks = {
  Products: ["Base Cabinets", "Wall Cabinets", "Tall Cabinets", "Corner Units"],
  Company: ["About Us", "Our Process", "Become a Dealer", "Careers"],
  Support: ["Contact Us", "Request a Quote", "Order Tracking", "FAQs", "Warranty Policy"],
  // Resources: ["Installation Guides", "Cabinet Care Tips", "Design Inspiration", "Blog", "Product Catalog"],
};
export function Footer() {
  return (
    <footer className="bg-[#0a0f1e] text-white">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-[#22c55e] rounded-md flex items-center justify-center">
                <img src={makramsLogo} alt="Makrams Logo" className="w-4 h-4" />
              </div>
              <span style={{ fontSize: "1.375rem", fontWeight: 700 }}>
                <span className="text-[#22c55e]">Makrams</span>
              </span>
            </div>
            <p className="text-white/50 mb-6" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
              Premium custom cabinetry built to order. Serving homeowners, contractors, and designers with quality craftsmanship since 2008.
            </p>
            {/* Contact */}
            <div className="flex flex-col gap-3 mb-6">
              <a href="tel:+15551234567" className="flex items-center gap-2 text-white/60 hover:text-[#22c55e] transition-colors" style={{ fontSize: "0.875rem" }}>
                <Phone className="w-4 h-4 shrink-0" />
                (239) 784-0494
              </a>
              <a href="mailto:hello@cabinetcraft.com" className="flex items-center gap-2 text-white/60 hover:text-[#22c55e] transition-colors" style={{ fontSize: "0.875rem" }}>
                <Mail className="w-4 h-4 shrink-0" />
                deniselite77@yahoo.com
              </a>
              <div className="flex items-start gap-2 text-white/60" style={{ fontSize: "0.875rem" }}>
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                *<br />Nashville, Tn
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
                { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
                { icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#22c55e] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white mb-4" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/50 hover:text-[#22c55e] transition-colors duration-150"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40" style={{ fontSize: "0.8125rem" }}>
            © 2026 Elite Kitchen Design. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/40 hover:text-white/70 transition-colors"
                style={{ fontSize: "0.8125rem" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
