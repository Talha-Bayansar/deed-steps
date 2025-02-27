import Header from "./_components/header";
import Footer from "./_components/footer";
import Pricing from "./_components/pricing";
import Hero from "./_components/hero";
import Features from "./_components/features";
import { InstallSection } from "./_components/install-section";
// import { FeatureComparison } from "./_components/feature-comparison";
import CTA from "./_components/cta";

export default function Home() {
  return (
    <div className="block scroll-smooth overflow-y-scroll h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        {/* <FeatureComparison /> */}
        <InstallSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
