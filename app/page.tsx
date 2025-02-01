import CTA from "@/components/CTA";
import Features from "@/components/FeaturesSection";
import Hero from "@/components/Hero";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
};

export default LandingPage;
