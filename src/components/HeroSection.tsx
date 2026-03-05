import { ArrowRight, Star } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1560185127-1902ccdc5094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGtpdGNoZW4lMjBjYWJpbmV0cyUyMGludGVyaW9yfGVufDF8fHx8MTc3MjU3OTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Beautiful custom kitchen cabinets"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-xs font-medium">Trusted by 2,000+ homeowners</span>
            </div>

            {/* Headline */}
            <h1 className="text-white mb-5 leading-[1.1]">
              <span className="block text-5xl lg:text-6xl font-black">Custom Cabinets</span>
              <span className="block text-5xl lg:text-6xl font-black text-[#8dc63f]">Built for You</span>
            </h1>

            {/* Subheadline */}
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              From kitchen cabinetry to bathroom vanities — we design, build, and
              deliver premium custom cabinets tailored to your space and budget.
              Request a quote today, no payment required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#order"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#6ab04c] hover:bg-[#5a9a3e] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-green-900/30"
              >
                Build Your Cabinet
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg font-semibold transition-colors"
              >
                View Our Work
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "5,000+", label: "Cabinets Installed" },
                { value: "100%", label: "Custom Made" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/50 animate-pulse" />
      </div>
    </section>
  );
}
