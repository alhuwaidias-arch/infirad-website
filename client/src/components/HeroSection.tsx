import { MessageCircle, Mail, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-primary">
      {/* Technical Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/qY57DoIOhiWxBJmMIzGMkz/sandbox/wnevn9Ag6ZWuReI4sWnw1z-img-1_1770272572000_na1fn_aGVyby10ZWNobmljYWwtYmFja2dyb3VuZA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVk1N0RvSU9oaVd4QkptTUl6R01rei9zYW5kYm94L3duZXZuOUFnNlpXdVJlSTRzV253MXotaW1nLTFfMTc3MDI3MjU3MjAwMF9uYTFmbl9hR1Z5YnkxMFpXTm9ibWxqWVd3dFltRmphMmR5YjNWdVpBLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=tKOUl7iaAa9yNPXNRlXVlsn8P1gacnbBrt-io4FDfdD~ERFWbc-jzlGiBAYKf47SUklxDjbcMcnzF8Dz0uUxKERYjRDj1lVT7U3AjmjyiKjOmcdG7CYWHhFl0Jbx2jNrL-BobLP2n0BxkBV1WDM7Vy0FlRJxmOLOvyUv8AhM4uqZ9ZeQuz5ov3yt1nkMoc7iosdfZ~QKhjCDWTEsKEWdy7~PCFTzQHGM-uG5uEq7UKo-FXWwA2W9t8xvogXnhSEStht~RitMPmUiqXW9btpJYSLINqpVyGjGEEF3gFacuuU6KuqVnaODA3MtFyHny~T~8podqJ38qnnyZVtDgBCoBg__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 technical-grid opacity-30" />
      
      {/* Gradient Accent */}
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] z-0" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary/50 border-2 border-secondary/30 text-secondary backdrop-blur-sm">
            <span className="ar-content text-sm md:text-base font-bold tracking-wider uppercase font-display">
              انفِراد - شريك هندسي استراتيجي لتطوير المشاريع
            </span>
            <span className="en-content text-sm md:text-base font-bold tracking-wider uppercase font-display">
              INFIRAD - Strategic Venture-Engineering Partner
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white font-display">
            <span className="ar-content">
              من الفكرة إلى <span className="text-secondary">اليقين</span>
            </span>
            <span className="en-content">
              From Idea to <span className="text-secondary">Certainty</span>
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg text-secondary max-w-xl leading-relaxed">
            <span className="ar-content">
              شركة تطوير مشاريع تعمل كشريك تقني لتحويل الأفكار النوعية إلى مشاريع قابلة للتنفيذ وجاهزة للاستثمار.
            </span>
            <span className="en-content">
              A project development company operating as a strategic technical partner to transform flagship ideas into executable, investment-ready projects.
            </span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-secondary hover:bg-white text-primary font-bold transition-brutal hover-lift shadow-lg"
            >
              <a href="https://wa.me/966530151525" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="ar-content">واتساب</span>
                <span className="en-content">WhatsApp</span>
              </a>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-secondary/30 hover:bg-white/5 text-white font-bold transition-brutal hover-lift"
            >
              <a href="mailto:info@infiradeng.com" className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="ar-content">البريد الإلكتروني</span>
                <span className="en-content">Email Us</span>
              </a>
            </Button>
          </div>
        </div>
        
        {/* Visual Element */}
        <div className="hidden lg:block relative animate-fade-in">
          <div className="relative bg-primary/30 ring-2 ring-secondary/20 rounded-2xl p-8 shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="aspect-square bg-primary/50 rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 border-secondary/10 relative">
              <div className="ar-content absolute top-8 text-secondary text-sm font-bold tracking-[0.2em] uppercase font-display">
                المحاكاة والتحليل البياني
              </div>
              <div className="en-content absolute top-8 text-secondary text-sm font-bold tracking-[0.2em] uppercase font-display">
                Simulation & Analytics
              </div>

              {/* Technical Visualization */}
              <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 text-secondary/30">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path d="M40 40 H160 M40 70 H160 M40 100 H160 M40 130 H160 M40 160 H160" stroke="currentColor" strokeWidth="0.5" />
                <path d="M40 40 V160 M70 40 V160 M100 40 V160 M130 40 V160 M160 40 V160" stroke="currentColor" strokeWidth="0.5" />
                <path 
                  d="M40 140 Q 70 60, 100 110 T 160 80" 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  className="graph-line"
                  style={{
                    strokeDasharray: '300',
                    strokeDashoffset: '300',
                    animation: 'drawLine 2s ease-out forwards, waveLine 3s ease-in-out 2s infinite'
                  }}
                />
                <circle cx="70" cy="85" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2s' }} />
                <circle cx="100" cy="110" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2.2s' }} />
                <circle cx="130" cy="95" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2.4s' }} />
              </svg>

              <div className="ar-content absolute bottom-8 px-5 py-2 border-2 border-secondary/30 rounded text-secondary text-xs md:text-sm font-bold uppercase font-display">
                النمذجة الرقمية
              </div>
              <div className="en-content absolute bottom-8 px-5 py-2 border-2 border-secondary/30 rounded text-secondary text-xs md:text-sm font-bold uppercase font-display">
                Digital Twin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary hover:text-white transition-colors animate-bounce z-10"
        aria-label="Scroll to next section"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
}
