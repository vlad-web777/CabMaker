import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Denver, CO",
    avatar: "SM",
    rating: 5,
    project: "Full Kitchen Remodel",
    text: "CraftLine completely transformed our kitchen. The cabinets are absolutely stunning — the quality far exceeds anything I found at big box stores. The online ordering process was smooth and our rep was incredibly helpful with layout suggestions.",
  },
  {
    name: "James T.",
    location: "Austin, TX",
    avatar: "JT",
    rating: 5,
    project: "Master Bath Vanity",
    text: "I was nervous ordering cabinets online but the whole experience was fantastic. The configuration tool made it easy to customize, and when they arrived they fit perfectly. The Gola hardware option was worth every penny.",
  },
  {
    name: "Linda & Bob R.",
    location: "Portland, OR",
    avatar: "LR",
    rating: 5,
    project: "Kitchen + Laundry Room",
    text: "We ordered two separate projects and both came out perfect. The team was responsive to every question we had. Delivery was on time and the boxes were so well packed there wasn't a scratch on anything.",
  },
  {
    name: "Marcus D.",
    location: "Chicago, IL",
    avatar: "MD",
    rating: 5,
    project: "Contractor — Multi-Unit",
    text: "As a contractor, I've worked with a lot of cabinet suppliers. CraftLine's quality-to-price ratio is unbeatable, and the account system makes it easy to track orders across multiple job sites. Highly recommend.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-900" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#8dc63f] text-sm font-semibold tracking-widest uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Don't just take our word for it — hear from the homeowners and contractors
            who trust CraftLine for every project.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#6ab04c] mb-4 opacity-60" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 leading-relaxed mb-6 italic">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#6ab04c]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#8dc63f] text-sm font-bold">{t.avatar}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.location} · {t.project}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-14 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-10">
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "2,000+", label: "Happy Customers" },
            { value: "98%", label: "Would Recommend" },
            { value: "500+", label: "5-Star Reviews" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-[#8dc63f] text-3xl font-black mb-1">{item.value}</div>
              <div className="text-gray-500 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
