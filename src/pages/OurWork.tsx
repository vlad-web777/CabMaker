import React, { useState } from "react";

/* -----------------------------
   Our Work Page
----------------------------- */
export default function Work() {
  const projects = [
    {
      id: 1,
      name: "Kitchen Remodel",
      description:
        "A modern kitchen remodel with custom cabinets and open shelving.",
      mainImage: "/images/work1.jpg",
      images: [
        "/images/work1.jpg",
        "/images/work1-2.jpg",
        "/images/work1-3.jpg",
      ],
    },
    {
      id: 2,
      name: "Bathroom Vanity",
      description: "Custom vanity cabinets with marble countertop.",
      mainImage: "/images/work2.jpg",
      images: ["/images/work2.jpg", "/images/work2-2.jpg"],
    },
    {
      id: 3,
      name: "Living Room Built-ins",
      description: "Wall-to-wall cabinetry for storage and decor.",
      mainImage: "/images/work3.jpg",
      images: ["/images/work3.jpg", "/images/work3-2.jpg", "/images/work3-3.jpg"],
    },
  ];

  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="bg-gray-50 pt-[80px]">
      {/* Hero */}
      <HeroSection
        title="Our Work"
        subtitle="Click on any project to view details"
        imageUrl="/images/work-hero.jpg"
      />

      {/* Gallery */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.mainImage}
                alt={project.name}
                className="object-cover w-full h-64 hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center font-semibold">
                {project.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-[900px] overflow-auto max-h-[90vh] p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              ✕
            </button>

            {/* Title & Description */}
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            <p className="text-gray-700 mb-6">{selectedProject.description}</p>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProject.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedProject.name} ${idx + 1}`}
                  className="rounded-md object-cover w-full h-48"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Call to Action Section ---------------- */}
      <CTASection
        title="Ready to Start Your Project?"
        buttonText="Get a Quote"
        buttonLink="/builder"
      />
    </div>
  );
}

/* -----------------------------
   Hero Section
----------------------------- */
function HeroSection({
  title,
  subtitle,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  imageUrl: string;
}) {
  return (
    <div
      className="relative h-[400px] flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-black/50 p-8 rounded-md text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-4 text-lg">{subtitle}</p>
      </div>
    </div>
  );
}

/* -----------------------------
   Call to Action Section
----------------------------- */
function CTASection({
  title,
  buttonText,
  buttonLink,
}: {
  title: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <section className="bg-[#22c55e] py-16 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <a
          href={buttonLink}
          className="bg-white text-[#22c55e] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}