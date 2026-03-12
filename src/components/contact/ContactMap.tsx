export function ContactMap() {
  return (
    <section className="bg-white border-t border-gray-100 py-16">

      <div className="max-w-[1200px] mx-auto px-6">

        <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">
          Visit Our Showroom
        </h2>

        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200">

          <iframe
            src="https://maps.google.com/maps?q=boston&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full"
          />

        </div>

      </div>

    </section>
  );
}