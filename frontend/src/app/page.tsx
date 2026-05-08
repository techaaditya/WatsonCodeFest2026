import { DNABackground } from "@/components/shared/DNABackground";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <DNABackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
