import { ArrowRight, ChevronDown } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1560185127-1902ccdc5094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGtpdGNoZW4lMjBjYWJpbmV0cyUyMGludGVyaW9yfGVufDF8fHx8MTc3MjU3OTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[620px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful custom kitchen cabinets"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center pt-[70px]">
        <div className="max-w-[600px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-[2px] bg-[#22c55e]" />
            <span className="text-[#22c55e] tracking-widest uppercase" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
              Premium Custom Cabinetry
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-white mb-6" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 700, lineHeight: 1.15 }}>
            Cabinets Crafted <br />
            <span className="text-[#22c55e]">For Your Vision</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/80 mb-10 max-w-[480px]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", lineHeight: 1.7 }}>
            From base cabinets to full kitchen designs — we build quality cabinetry tailored to your space, style, and budget. Submit a request and get a personalized quote.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 px-7 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md transition-all duration-200 group shadow-lg shadow-green-900/30"
              style={{ fontWeight: 600, fontSize: "0.9375rem" }}
            >
              Start Your Order
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-md transition-all duration-200 backdrop-blur-sm"
              style={{ fontWeight: 500, fontSize: "0.9375rem" }}
            >
              View Gallery
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14">
            {[
              { value: "500+", label: "Projects Completed" },
              { value: "15+", label: "Years of Experience" },
              { value: "100%", label: "Custom Built" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-white" style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div className="text-white/60 mt-1" style={{ fontSize: "0.8125rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-white/50" style={{ fontSize: "0.75rem", letterSpacing: "0.1em" }}>SCROLL</span>
        <ChevronDown className="w-5 h-5 text-white/50" />
      </div>
    </section>
  );
}
