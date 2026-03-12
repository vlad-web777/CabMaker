import { ContactHero } from "../components/contact/ContactHero.tsx";
import { ContactForm } from "../components/contact/ContactForm.tsx";
import { ContactInfo } from "../components/contact/ContactInfo.tsx";
import { ContactMap } from "../components/contact/ContactMap.tsx";

export default function Contact() {
  return (
    <div className="pt-[80px] bg-gray-50">
      <ContactHero />

      <section className="max-w-[1200px] mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        <ContactForm />
        <ContactInfo />
      </section>

      <ContactMap />
    </div>
  );
}