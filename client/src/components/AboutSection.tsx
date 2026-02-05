import { ShieldCheck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-accent">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-display">
              <span className="ar-content">عن انفِراد</span>
              <span className="en-content">About INFIRAD</span>
            </h2>
            
            <p className="text-lg text-foreground leading-relaxed font-medium">
              <span className="ar-content">
                تعمل انفِراد في تقاطع الهندسة والتكنولوجيا والأعمال، مع التركيز على المبادرات التي تتسم بعدم اليقين التقني وارتفاع مخاطر الأداء.
              </span>
              <span className="en-content">
                INFIRAD operates at the intersection of engineering, technology, and business. We focus on initiatives where technical uncertainty and performance risks are high.
              </span>
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="p-6 bg-white rounded-lg shadow-sm border-2 border-border hover-lift transition-brutal">
                <h3 className="text-foreground font-bold text-4xl mb-2 font-mono">0%</h3>
                <p className="text-xs uppercase tracking-wider text-secondary font-bold font-display">
                  <span className="ar-content">تحيز للمقاولين</span>
                  <span className="en-content">Vendor Bias</span>
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border-2 border-border hover-lift transition-brutal">
                <h3 className="text-foreground font-bold text-4xl mb-2 font-mono">100%</h3>
                <p className="text-xs uppercase tracking-wider text-secondary font-bold font-display">
                  <span className="ar-content">استقلالية القرار</span>
                  <span className="en-content">Decision Autonomy</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative animate-fade-in">
            <div className="aspect-video bg-primary rounded-2xl shadow-xl flex items-center justify-center p-12 relative overflow-hidden border-2 border-secondary/20">
              <div className="absolute inset-0 bg-secondary/5" />
              <div className="text-center relative z-10 space-y-6">
                <ShieldCheck className="w-16 h-16 text-secondary mx-auto" />
                <h4 className="text-xl font-bold text-white uppercase tracking-widest font-display">
                  <span className="ar-content">شريك هندسي استراتيجي</span>
                  <span className="en-content">Strategic Technical Partner</span>
                </h4>
                <p className="text-sm md:text-base text-secondary tracking-widest">
                  <span className="ar-content">تحقيق اليقين في المشاريع النوعية</span>
                  <span className="en-content">Building Certainty in Flagship Projects</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
