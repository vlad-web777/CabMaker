import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Base Cabinets",
    description: "Floor-standing units offering storage and countertop support. Available in single door, double door, and drawer configurations.",
    image: "https://images.unsplash.com/photo-1769326541210-86e9d3204496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwc2hha2VyJTIwY2FiaW5ldHMlMjBlbGVnYW50fGVufDF8fHx8MTc3MjU4MDIxNHww&ixlib=rb-4.1.0&q=80&w=600",
    tag: "Most Popular",
  },
  {
    title: "Wall Cabinets",
    description: "Mounted above countertops to maximize vertical space. Perfect for dishes, glasses, and pantry essentials.",
    image: "https://images.unsplash.com/photo-1650615653338-0ec058c99fa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB3b29kJTIwY2FiaW5ldCUyMGNyYWZ0c21hbnNoaXB8ZW58MXx8fHwxNzcyNTgwMjE1fDA&ixlib=rb-4.1.0&q=80&w=600",
    tag: null,
  },
  {
    title: "Bathroom Vanities",
    description: "Elegant and functional vanity cabinets designed for bathrooms, with moisture-resistant finishes and customizable sizes.",
    image: "https://images.unsplash.com/photo-1737630914827-829ad1cd972e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBiYXRocm9vbSUyMHZhbml0eSUyMGNhYmluZXQlMjB3aGl0ZXxlbnwxfHx8fDE3NzI1ODAyMTh8MA&ixlib=rb-4.1.0&q=80&w=600",
    tag: "New",
  }
  // ,
  // {
  //   title: "Kitchen Islands",
  //   description: "Freestanding or built-in island cabinets to add workspace, storage, and style to the center of your kitchen.",
  //   image: "https://images.unsplash.com/photo-1765766601532-90e9b96320c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaXNsYW5kJTIwZGFyayUyMHdvb2QlMjBtb2Rlcm4lMjBjYWJpbmV0c3xlbnwxfHx8fDE3NzI1ODAyMTh8MA&ixlib=rb-4.1.0&q=80&w=600",
  //   tag: null,
  // },
];

export function ProductCategories() {
  return (
    <section className="py-20 bg-white" id="products">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-[2px] bg-[#22c55e]" />
              <span className="text-[#22c55e] uppercase tracking-widest" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                Our Products
              </span>
            </div>
            <h2 className="text-[#0f172a]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
              Cabinet Collections
            </h2>
            <p className="text-[#64748b] mt-3 max-w-[500px]" style={{ lineHeight: 1.7 }}>
              Browse our full range of custom cabinet styles. Each unit is built to order with your choice of finish, hardware, and dimensions.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-[#22c55e] hover:text-[#16a34a] transition-colors whitespace-nowrap group"
            style={{ fontWeight: 600 }}
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        {/* old version of grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6*/}
        <div className="flex flex-col md:flex-row gap-8">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href="#"
              className="group relative bg-[#f8fafc] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {cat.tag && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#22c55e] text-white rounded-full" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    {cat.tag}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[#0f172a] mb-2" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                  {cat.title}
                </h3>
                <p className="text-[#64748b] mb-4 flex-1" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {cat.description}
                </p>
                <div className="flex items-center gap-1.5 text-[#22c55e]" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  <span>Explore Options</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
