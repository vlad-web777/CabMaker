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
import Cabinetry from "./pages/Cabinetry";
import ProtectedRoute from "./components/ProtectedRoute";
import APIErrorPage from "./pages/APIErrorPage";
import Test from "./pages/test";
import BrickBreakerPage from "./pages/BrickBreakerPage";

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
      {/* <Cabinetry/> */}
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
            <Route
              path="/shop-standards"
              element={
                //Vlad 3-18-2026:  Wrap the ShopStandards component with ProtectedRoute so only logged-in users can access it
                <ProtectedRoute> 
                  <ShopStandards />
                </ProtectedRoute>
              }
            />
            <Route path="/builder" element={<CabinetBuilder />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About/>} />
            <Route path="/work" element={<Work/>} />
            <Route path="/account" element={<Account />} />
            <Route path="/Cabinetry" element={<Cabinetry />} />
            <Route path="/APIErrorPage" element={<APIErrorPage />} />
            <Route path="/test" element={<Test/>}/> 
            <Route path="/brick-breaker" element={<BrickBreakerPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}