import { Cog, Cpu, Briefcase, GraduationCap } from 'lucide-react';

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 bg-accent relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/qY57DoIOhiWxBJmMIzGMkz/sandbox/wnevn9Ag6ZWuReI4sWnw1z-img-3_1770272573000_na1fn_Y2FwYWJpbGl0aWVzLWFic3RyYWN0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVk1N0RvSU9oaVd4QkptTUl6R01rei9zYW5kYm94L3duZXZuOUFnNlpXdVJlSTRzV253MXotaW1nLTNfMTc3MDI3MjU3MzAwMF9uYTFmbl9ZMkZ3WVdKcGJHbDBhV1Z6TFdGaWMzUnlZV04wLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fkaVWZ6-XOgefkAim~8Hb6wSyjy3iMIHWAxjyqrTTMjlUTdJkWsVBcdq8OlNqDfZCc2951FpJxC96Zy~OI~bTOiqWDsn3dt2NneCt7xB4H1mfSaO6P5ps7Pj4UGXbxBmwfTSSlvxeOGDibv-i0NtqiG9UZrJK6sMsIrEl5JtR0l~YVOLq8zf45turOTJ5qhYMjfLNkCEaTSfq6IXDk8jJduMBIDVCo-eN3wYI3hKUMVAjexqf0vW8YEKy7~~zYVNN1W20FlAeoeetKC5aFXP0HCXAp9j4MYklbe141fndkF207tDdxQt~nTaDgCCvWNEByT6fK9P~4OKuZ0RU8cvlg__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-foreground font-display animate-fade-in-up">
          <span className="ar-content">منظومة القدرات المتكاملة</span>
          <span className="en-content">Integrated Capability Stack</span>
        </h2>

        {/* Capabilities Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {/* Engineering */}
          <div className="p-8 bg-white rounded-2xl border-2 border-border hover-lift transition-brutal shadow-sm hover:shadow-lg group">
            <Cog className="w-8 h-8 text-primary mb-6 group-hover:rotate-90 transition-transform duration-500" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              <span className="ar-content">الهندسة</span>
              <span className="en-content">Engineering</span>
            </h3>
            <p className="text-secondary text-lg leading-relaxed font-semibold">
              <span className="ar-content">
                التصميم الأساسي (BFD/PFD)، مراجعة P&ID، والمحاكاة الديناميكية للعمليات.
              </span>
              <span className="en-content">
                Front-end design (BFD/PFD), P&ID review, and dynamic process simulation.
              </span>
            </p>
          </div>
          
          {/* Tech & AI */}
          <div className="p-8 bg-white rounded-2xl border-2 border-border hover-lift transition-brutal shadow-sm hover:shadow-lg group">
            <Cpu className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              <span className="ar-content">التقنية والذكاء الاصطناعي</span>
              <span className="en-content">Tech & AI</span>
            </h3>
            <p className="text-secondary text-lg leading-relaxed font-semibold">
              <span className="ar-content">
                وكلاء ذكاء اصطناعي لدعم اتخاذ القرارات الهندسية، وتحليل البيانات لرفع الكفاءة.
              </span>
              <span className="en-content">
                AI agents for engineering decision support and data analytics for performance.
              </span>
            </p>
          </div>
          
          {/* Venture Dev */}
          <div className="p-8 bg-white rounded-2xl border-2 border-border hover-lift transition-brutal shadow-sm hover:shadow-lg group">
            <Briefcase className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              <span className="ar-content">تطوير الأعمال</span>
              <span className="en-content">Venture Dev</span>
            </h3>
            <p className="text-secondary text-lg leading-relaxed font-semibold">
              <span className="ar-content">
                هيكلة المشاريع، الحوكمة، ورفع الجاهزية الاستثمارية للأفكار المعقدة.
              </span>
              <span className="en-content">
                Venture structuring, governance, and investment readiness for complex ideas.
              </span>
            </p>
          </div>
          
          {/* Education */}
          <div className="p-8 bg-white rounded-2xl border-2 border-border hover-lift transition-brutal shadow-sm hover:shadow-lg group">
            <GraduationCap className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              <span className="ar-content">التعليم ونقل المعرفة</span>
              <span className="en-content">Education & Training</span>
            </h3>
            <p className="text-secondary text-lg leading-relaxed font-semibold">
              <span className="ar-content">
                بناء الكفاءات الوطنية المتخصصة وتطوير المهارات التقنية في المجالات الهندسية المتقدمة.
              </span>
              <span className="en-content">
                Building specialized national competencies and developing skills in advanced engineering.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
