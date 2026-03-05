import { ClipboardList, MessageSquare, Package, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Configure Your Cabinet",
    description:
      "Use our online cabinet builder to select your style, dimensions, finish, and add-on options. No account needed to explore.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Submit for Review",
    description:
      "Add your selections to cart and submit your order request. Our team will review your configuration and reach out with a detailed quote.",
  },
  {
    icon: Package,
    step: "03",
    title: "We Build & Ship",
    description:
      "Once you approve the quote, we get to work. Your cabinets are hand-built and carefully packed for safe delivery to your door.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Install & Enjoy",
    description:
      "Receive your cabinets and install them yourself or with our recommended installers. We're here for any support you need.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#6ab04c] text-sm font-semibold tracking-widest uppercase mb-3">
            The Process
          </span>
          <h2 className="text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting your custom cabinets is simpler than you think. Here's our
            streamlined process from first click to final install.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#6ab04c]/30 to-transparent" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                {/* Step number & Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#6ab04c]/10 border-2 border-[#6ab04c]/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#6ab04c]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#6ab04c] flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6ab04c] hover:bg-[#5a9a3e] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-green-900/20"
          >
            Start Building Now
          </a>
          <p className="text-gray-400 text-sm mt-3">No payment required to submit a request</p>
        </div>
      </div>
    </section>
  );
}
