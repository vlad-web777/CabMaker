import { ArrowRight } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1771862956369-c840b0a1fc9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwcmVub3ZhdGlvbiUyMGRlc2lnbnxlbnwxfHx8fDE3NzI0OTY3OTV8MA&ixlib=rb-4.1.0&q=80&w=800",
    label: "Modern Kitchen Renovation",
    size: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1769326541210-86e9d3204496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwc2hha2VyJTIwY2FiaW5ldHMlMjBlbGVnYW50fGVufDF8fHx8MTc3MjU4MDIxNHww&ixlib=rb-4.1.0&q=80&w=600",
    label: "Shaker Style Kitchen",
    size: "",
  },
  {
    src: "https://images.unsplash.com/photo-1737630914827-829ad1cd972e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBiYXRocm9vbSUyMHZhbml0eSUyMGNhYmluZXQlMjB3aGl0ZXxlbnwxfHx8fDE3NzI1ODAyMTh8MA&ixlib=rb-4.1.0&q=80&w=600",
    label: "Bathroom Vanity",
    size: "",
  },
  {
    src: "https://images.unsplash.com/photo-1650615653338-0ec058c99fa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB3b29kJTIwY2FiaW5ldCUyMGNyYWZ0c21hbnNoaXB8ZW58MXx8fHwxNzcyNTgwMjE1fDA&ixlib=rb-4.1.0&q=80&w=600",
    label: "Handcrafted Details",
    size: "",
  },
  {
    src: "https://images.unsplash.com/photo-1765766601532-90e9b96320c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaXNsYW5kJTIwZGFyayUyMHdvb2QlMjBtb2Rlcm4lMjBjYWJpbmV0c3xlbnwxfHx8fDE3NzI1ODAyMTh8MA&ixlib=rb-4.1.0&q=80&w=600",
    label: "Dark Wood Island",
    size: "",
  },
];

export function GalleryStrip() {
  return (
    <section className="py-20 bg-white" id="gallery">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-[2px] bg-[#22c55e]" />
              <span className="text-[#22c55e] uppercase tracking-widest" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                Project Gallery
              </span>
            </div>
            <h2 className="text-[#0f172a]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
              Be Inspired
            </h2>
            <p className="text-[#64748b] mt-3 max-w-[480px]" style={{ lineHeight: 1.7 }}>
              A look at some of our recent work. Every project is one-of-a-kind, built with the same care and precision.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-[#22c55e] hover:text-[#16a34a] transition-colors whitespace-nowrap group"
            style={{ fontWeight: 600 }}
          >
            Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {galleryImages.map((img, i) => (
            <div
              key={img.label}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
