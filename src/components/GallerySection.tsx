const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1765371514650-1f99696ca69f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB3b29kJTIwa2l0Y2hlbiUyMHJlbm92YXRpb258ZW58MXx8fHwxNzcyNTc5OTc0fDA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Custom wood kitchen renovation",
    label: "Modern Walnut Kitchen",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1683629357846-30eacff8f615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwc2hha2VyJTIwY2FiaW5ldCUyMHdoaXRlJTIwbWFyYmxlfGVufDF8fHx8MTc3MjU3OTk3N3ww&ixlib=rb-4.1.0&q=80&w=800",
    alt: "White shaker kitchen",
    label: "White Shaker with Marble",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1749704647512-3f556575a241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwaXNsYW5kJTIwZGVzaWduJTIwaG9tZXxlbnwxfHx8fDE3NzI1Nzk5Nzh8MA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Contemporary kitchen island",
    label: "Contemporary Island Design",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1722605090433-41d1183a792d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwY2FiaW5ldHJ5JTIwZGVzaWdufGVufDF8fHx8MTc3MjU3OTk3NHww&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Luxury kitchen cabinetry",
    label: "Luxury Full Kitchen",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1640657597032-38291af2e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYmF0aHJvb20lMjB2YW5pdHklMjBjYWJpbmV0JTIwY2xvc2V1cHxlbnwxfHx8fDE3NzI1Nzk5Nzh8MA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Bathroom vanity cabinet",
    label: "Spa Bathroom Vanity",
    span: "col-span-1 row-span-1",
  },
];

export function GallerySection() {
  return (
    <section className="py-24 bg-gray-50" id="gallery">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#6ab04c] text-sm font-semibold tracking-widest uppercase mb-3">
            Our Work
          </span>
          <h2 className="text-gray-900 mb-4">
            Projects We're Proud Of
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real cabinets built for real clients. Browse our latest installations
            and find inspiration for your next project.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[260px]">
          {galleryImages.map((img) => (
            <div
              key={img.alt}
              className={`${img.span} relative group rounded-2xl overflow-hidden cursor-pointer`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white font-semibold">{img.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#6ab04c] text-[#6ab04c] hover:bg-[#6ab04c] hover:text-white rounded-lg font-semibold transition-all"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}
