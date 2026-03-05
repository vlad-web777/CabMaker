import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Base Cabinets",
    description: "The foundation of every kitchen. Available in standard and custom widths with a variety of door, drawer, and interior configurations.",
    image: "https://images.unsplash.com/photo-1683629357846-30eacff8f615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwc2hha2VyJTIwY2FiaW5ldCUyMHdoaXRlJTIwbWFyYmxlfGVufDF8fHx8MTc3MjU3OTk3N3ww&ixlib=rb-4.1.0&q=80&w=800",
    tag: "Most Popular",
    count: "40+ styles",
  },
  {
    title: "Wall Cabinets",
    description: "Maximize your vertical storage with our wall-mounted cabinet line. Single, double, and corner options to fit any layout.",
    image: "https://images.unsplash.com/photo-1722605090433-41d1183a792d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwY2FiaW5ldHJ5JTIwZGVzaWdufGVufDF8fHx8MTc3MjU3OTk3NHww&ixlib=rb-4.1.0&q=80&w=800",
    tag: "New Styles",
    count: "30+ styles",
  },
  {
    title: "Bathroom Vanities",
    description: "Elegant bathroom vanity cabinets with soft-close hinges and optional integrated sink cutouts. Available in single and double configurations.",
    image: "https://images.unsplash.com/photo-1640657597032-38291af2e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYmF0aHJvb20lMjB2YW5pdHklMjBjYWJpbmV0JTIwY2xvc2V1cHxlbnwxfHx8fDE3NzI1Nzk5Nzh8MA&ixlib=rb-4.1.0&q=80&w=800",
    tag: "Premium",
    count: "20+ styles",
  },
];

export function ProductsSection() {
  return (
    <section className="py-24 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="inline-block text-[#6ab04c] text-sm font-semibold tracking-widest uppercase mb-3">
              Our Products
            </span>
            <h2 className="text-gray-900">
              Browse Our Cabinet Lines
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#6ab04c] hover:text-[#5a9a3e] font-medium transition-colors whitespace-nowrap"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <a
              key={cat.title}
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5] block"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#6ab04c] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {cat.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-white/60 text-xs mb-1">{cat.count}</div>
                <h3 className="text-white mb-2">{cat.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <div className="inline-flex items-center gap-2 text-[#8dc63f] text-sm font-medium group-hover:gap-3 transition-all">
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">Can't find what you're looking for?</h3>
            <p className="text-gray-400">
              Every cabinet we build is custom. Tell us your dimensions, style, and
              budget — we'll make it happen.
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-[#6ab04c] hover:bg-[#5a9a3e] text-white rounded-lg font-semibold transition-colors"
          >
            Request Custom Quote
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
