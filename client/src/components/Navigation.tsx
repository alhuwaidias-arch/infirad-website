import { useState, useEffect } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/118103656/mQzhKltIIwOMzPqh.png" 
              alt="INFIRAD Logo" 
              className={`h-12 w-auto object-contain transition-all duration-300 drop-shadow-lg ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
            />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('about')}
            className={`text-xl font-bold hover:text-secondary transition-colors font-display ${
              isScrolled ? 'text-foreground' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
          >
            <span className="ar-content">من نحن</span>
            <span className="en-content">About Us</span>
          </button>
          <button 
            onClick={() => scrollToSection('methodology')}
            className={`text-xl font-bold hover:text-secondary transition-colors font-display ${
              isScrolled ? 'text-foreground' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
          >
            <span className="ar-content">منهجيتنا</span>
            <span className="en-content">Methodology</span>
          </button>
          <button 
            onClick={() => scrollToSection('capabilities')}
            className={`text-xl font-bold hover:text-secondary transition-colors font-display ${
              isScrolled ? 'text-foreground' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
          >
            <span className="ar-content">القدرات</span>
            <span className="en-content">Capabilities</span>
          </button>
          <button 
            onClick={() => scrollToSection('engagement')}
            className={`text-xl font-bold hover:text-secondary transition-colors font-display ${
              isScrolled ? 'text-foreground' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
          >
            <span className="ar-content">نموذج العمل</span>
            <span className="en-content">Engagement</span>
          </button>
          
          <Button 
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 font-bold border-2 transition-brutal drop-shadow-lg ${
              isScrolled 
                ? 'hover:bg-primary hover:text-primary-foreground' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm'
            }`}
          >
            <Globe className="w-6 h-6" />
            <span className="text-lg font-bold">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 hover:text-secondary transition-colors ${
            isScrolled ? 'text-foreground' : 'text-white'
          }`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-right text-sm font-bold text-foreground hover:text-secondary transition-colors font-display py-2"
            >
              <span className="ar-content">من نحن</span>
              <span className="en-content">About Us</span>
            </button>
            <button 
              onClick={() => scrollToSection('methodology')}
              className="block w-full text-right text-sm font-bold text-foreground hover:text-secondary transition-colors font-display py-2"
            >
              <span className="ar-content">منهجيتنا</span>
              <span className="en-content">Methodology</span>
            </button>
            <button 
              onClick={() => scrollToSection('capabilities')}
              className="block w-full text-right text-sm font-bold text-foreground hover:text-secondary transition-colors font-display py-2"
            >
              <span className="ar-content">القدرات</span>
              <span className="en-content">Capabilities</span>
            </button>
            <button 
              onClick={() => scrollToSection('engagement')}
              className="block w-full text-right text-sm font-bold text-foreground hover:text-secondary transition-colors font-display py-2"
            >
              <span className="ar-content">نموذج العمل</span>
              <span className="en-content">Engagement</span>
            </button>
            
            <Button 
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 font-bold border-2"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
