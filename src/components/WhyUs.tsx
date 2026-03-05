import { Award, Wrench, Truck, HeadphonesIcon, Ruler, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Ruler className="w-6 h-6" />,
    title: "Custom Sizing",
    description: "Every cabinet is built to your exact dimensions. No compromises — we fit your space perfectly.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Expert Craftsmanship",
    description: "Our craftsmen bring decades of woodworking experience to every project, ensuring superior quality.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Premium Materials",
    description: "We use only the finest hardwoods, plywood, and hardware — built to last generations.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Guarantee",
    description: "Every order comes with our quality guarantee. If something isn't right, we make it right.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Reliable Delivery",
    description: "We coordinate delivery and installation on your schedule, from local projects to nationwide shipping.",
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: "Dedicated Support",
    description: "Your dedicated project manager is with you from first consultation to final installation.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 bg-[#f8fafc]" id="why-us">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-[2px] bg-[#22c55e]" />
            <span className="text-[#22c55e] uppercase tracking-widest" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
              Why CabinetCraft
            </span>
            <div className="w-6 h-[2px] bg-[#22c55e]" />
          </div>
          <h2 className="text-[#0f172a]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
            The CabinetCraft Difference
          </h2>
          <p className="text-[#64748b] mt-4" style={{ lineHeight: 1.7 }}>
            We're not just selling cabinets — we're building lasting relationships with every homeowner, contractor, and designer we work with.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-[#f0fdf4] rounded-xl flex items-center justify-center text-[#22c55e] mb-5 group-hover:bg-[#22c55e] group-hover:text-white transition-colors duration-300">
                {feat.icon}
              </div>
              <h3 className="text-[#0f172a] mb-2" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                {feat.title}
              </h3>
              <p className="text-[#64748b]" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
