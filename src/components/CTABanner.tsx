import { ArrowRight, Phone } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 bg-[#22c55e]" id="contact">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-white" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 700, lineHeight: 1.2 }}>
              Ready to Start Your Project?
            </h2>
            <p className="text-white/80 mt-3 max-w-[500px]" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Submit your cabinet request today and we'll reach out with a custom quote. No commitment required — just great cabinets.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="#"
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#16a34a] hover:bg-gray-50 rounded-md transition-colors duration-200 shadow-lg group"
              style={{ fontWeight: 700, fontSize: "0.9375rem" }}
            >
              Get a Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:+15551234567"
              className="flex items-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-md transition-colors duration-200"
              style={{ fontWeight: 600, fontSize: "0.9375rem" }}
            >
              <Phone className="w-4 h-4" />
              (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
