import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MethodologySection from '@/components/MethodologySection';
import CapabilitiesSection from '@/components/CapabilitiesSection';
import EngagementSection from '@/components/EngagementSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <MethodologySection />
        <CapabilitiesSection />
        <EngagementSection />
        <Footer />
      </main>
      <ChatWidget />
    </div>
  );
}
