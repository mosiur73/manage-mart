import AboutSection from "@/components/landing/about-section";
import CTASection from "@/components/landing/cat-section";
import FAQSection from "@/components/landing/faq-section";
import FeaturesSection from "@/components/landing/featureSection";
import HeroSection from "@/components/landing/HeroSection";
import PricingSection from "@/components/landing/price-section";
import TestimonialsSection from "@/components/landing/testimonials";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <HeroSection></HeroSection>
    <FeaturesSection></FeaturesSection>
    <AboutSection></AboutSection>
    <PricingSection></PricingSection>
    <TestimonialsSection></TestimonialsSection>
    <FAQSection></FAQSection>
    <CTASection></CTASection>
   </div>
  );
}
