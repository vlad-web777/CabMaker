import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
import { WhyUs } from "./components/WhyUs";
import { HowItWorks } from "./components/HowItWorks";
import { GalleryStrip } from "./components/GalleryStrip";
import { Testimonials } from "./components/Testimonials";
import { CTABanner } from "./components/CTABanner";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ProductCategories />
        {/* <WhyUs /> */}
        <HowItWorks />
        {/* <GalleryStrip />  */}
        {/* <Testimonials /> */}
        {/* <CTABanner /> */}
      </main>
      <Footer />
    </div>
  );
}
