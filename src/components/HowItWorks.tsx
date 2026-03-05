const steps = [
  {
    number: "01",
    title: "Browse & Configure",
    description:
      "Explore our cabinet catalog. Choose your style, dimensions, finish, and add-ons like Gola handles or soft-close hinges.",
  },
  {
    number: "02",
    title: "Submit Your Request",
    description:
      "Add items to your cart and submit your order for review. No payment required upfront — we'll prepare your personalized quote.",
  },
  {
    number: "03",
    title: "Receive Your Quote",
    description:
      "Our team will review your order and reach out with a detailed quote, timeline, and any clarifying questions.",
  },
  {
    number: "04",
    title: "We Build & Deliver",
    description:
      "Once approved, your cabinets are hand-crafted to spec and delivered right to your door or jobsite.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#0f172a]" id="how-it-works">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[560px] mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-[2px] bg-[#22c55e]" />
            <span className="text-[#22c55e] uppercase tracking-widest" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
              The Process
            </span>
            <div className="w-6 h-[2px] bg-[#22c55e]" />
          </div>
          <h2 className="text-white" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
            How It Works
          </h2>
          <p className="text-white/60 mt-4" style={{ lineHeight: 1.7 }}>
            From browsing to delivery, we've made the process simple and transparent every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-[2px] bg-white/10 z-0" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative z-10 flex flex-col items-center text-center">
              {/* Number bubble */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0"
                style={{
                  background: i === 0 ? "#22c55e" : "rgba(255,255,255,0.07)",
                  border: i !== 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                }}
              >
                <span
                  className={i === 0 ? "text-white" : "text-white/50"}
                  style={{ fontSize: "1.25rem", fontWeight: 700 }}
                >
                  {step.number}
                </span>
              </div>
              <h3 className="text-white mb-3" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                {step.title}
              </h3>
              <p className="text-white/50" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-md transition-colors duration-200 shadow-lg shadow-green-900/20"
            style={{ fontWeight: 600, fontSize: "0.9375rem" }}
          >
            Start Your Order Today
          </a>
        </div>
      </div>
    </section>
  );
}
