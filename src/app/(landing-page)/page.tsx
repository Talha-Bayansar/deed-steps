import CTA from "./_components/cta";
import Features from "./_components/features";
import Footer from "./_components/footer";
import Header from "./_components/header";
import Hero from "./_components/hero";
import Pricing from "./_components/pricing";
import Testimonials from "./_components/testimonials";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
