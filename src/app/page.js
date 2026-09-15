import AboutSection from "@/components/landing/about-section";
import CTASection from "@/components/landing/cat-section";
import FAQSection from "@/components/landing/faq-section";
import FeaturesSection from "@/components/landing/featureSection";
import HeroSection from "@/components/landing/HeroSection";
import SellWithUsSection from "@/components/landing/price-section";
import TestimonialsSection from "@/components/landing/testimonials";

export default function Home() {
  return (
   <div>
    <HeroSection></HeroSection>
    <FeaturesSection></FeaturesSection>
    <AboutSection></AboutSection>
    <SellWithUsSection></SellWithUsSection>
    <TestimonialsSection></TestimonialsSection>
    <FAQSection></FAQSection>
    <CTASection></CTASection>
   </div>
  );
}
