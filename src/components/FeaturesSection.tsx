import { Ruler, Palette, Truck, HeadphonesIcon, Shield, Wrench } from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Precision Craftsmanship",
    description:
      "Every cabinet is built to exact measurements. We use premium materials and state-of-the-art CNC machinery for a perfect fit every time.",
  },
  {
    icon: Palette,
    title: "Endless Customization",
    description:
      "Choose from dozens of door styles, finishes, hardware options, and add-ons. Configure your dream cabinet from our online builder.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Most orders ship within 2–3 weeks. We deliver directly to your job site or home, carefully packed to arrive in perfect condition.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description:
      "All our cabinets come with a lifetime structural warranty and a 5-year finish warranty. We stand behind every piece we build.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Our design consultants are available to help you plan your layout, choose options, and answer any questions before and after your order.",
  },
  {
    icon: Wrench,
    title: "Professional Installation",
    description:
      "We partner with certified installers in your area or can guide your own contractor through the process with detailed instructions.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#6ab04c] text-sm font-semibold tracking-widest uppercase mb-3">
            Why Choose Us
          </span>
          <h2 className="text-gray-900 mb-4">
            Cabinet Building Done Right
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From concept to installation, we make the process easy, transparent,
            and built around your vision — at prices that won't surprise you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6ab04c]/10 flex items-center justify-center mb-5 group-hover:bg-[#6ab04c]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#6ab04c]" />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
