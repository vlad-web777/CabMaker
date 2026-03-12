import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
// import { WhyUs } from "./components/WhyUs";
import { HowItWorks } from "./components/HowItWorks";
// import { GalleryStrip } from "./components/GalleryStrip";
// import { Testimonials } from "./components/Testimonials";
// import { CTABanner } from "./components/CTABanner";
import { Footer } from "./components/Footer";
import CabinetBuilder from "./pages/cabinet-builder"
import ShopStandards from "./pages/shop-standards";
import CartPage from "./pages/cart";
import ScrollToTop from "./components/ScrollToTop";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Work from "./pages/OurWork";
import Account from "./pages/Account";
// import CabinetSide from "./components/CabinetSide";

function HomePage() {
  return (
    <>
      <Hero />
      {/* <CabinetSide/> */}
      <ProductCategories />
      {/* <WhyUs /> */}
      <HowItWorks />
      {/* <GalleryStrip /> */}
      {/* <Testimonials /> */}
      {/* <CTABanner /> */}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop-standards" element={<ShopStandards />} />
            <Route path="/builder" element={<CabinetBuilder />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About/>} />
            <Route path="/work" element={<Work/>} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}