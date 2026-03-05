import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer Walsh",
    role: "Homeowner – New Kitchen Remodel",
    avatar: "JW",
    rating: 5,
    text: "Absolutely blown away by the quality. We redesigned our entire kitchen and the cabinets look stunning. The team was helpful throughout the whole process and the quote was fast and fair.",
  },
  {
    name: "Mike Davenport",
    role: "General Contractor",
    avatar: "MD",
    rating: 5,
    text: "I've worked with CabinetCraft on over a dozen projects. Their custom sizing options and build quality are unmatched. The online ordering system makes it easy to submit orders for my clients.",
  },
  {
    name: "Sarah & Tom Nguyen",
    role: "Homeowners – Bathroom Remodel",
    avatar: "SN",
    rating: 5,
    text: "Our bathroom vanity turned out better than we imagined. The Gola handle upgrade was worth every penny. Delivery was on time and they handled everything professionally.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#f8fafc]" id="testimonials">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-[2px] bg-[#22c55e]" />
            <span className="text-[#22c55e] uppercase tracking-widest" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
              Testimonials
            </span>
            <div className="w-6 h-[2px] bg-[#22c55e]" />
          </div>
          <h2 className="text-[#0f172a]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
            What Our Customers Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#374151] flex-1" style={{ fontSize: "0.9375rem", lineHeight: 1.75, fontStyle: "italic" }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#22c55e] text-white flex items-center justify-center shrink-0" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[#0f172a]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                    {t.name}
                  </div>
                  <div className="text-[#94a3b8]" style={{ fontSize: "0.8125rem" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
