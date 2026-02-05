export default function MethodologySection() {
  return (
    <section id="methodology" className="py-24 bg-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/qY57DoIOhiWxBJmMIzGMkz/sandbox/wnevn9Ag6ZWuReI4sWnw1z-img-2_1770272571000_na1fn_bWV0aG9kb2xvZ3ktdmlzdWFsaXphdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVk1N0RvSU9oaVd4QkptTUl6R01rei9zYW5kYm94L3duZXZuOUFnNlpXdVJlSTRzV253MXotaW1nLTJfMTc3MDI3MjU3MTAwMF9uYTFmbl9iV1YwYUc5a2IyeHZaM2t0ZG1semRXRnNhWHBoZEdsdmJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=t-sYIhemGZH9o229j4Kq4wpJYV4~fyz~arnWAfA2OXuza6dnP8FiUKL2T2N28c~OyCBF-~Lc5dcEoOQmuKp12kElCU9jwyvlsqpm2~9dvbcrH01A9NTvEUCm981vo-V1lvhdqYz7~KffpxRQ7kMctvjo6yLJxdo2zjqa2vHe4BvJWBZZmtf-Mnmvsz4x6RzHJ2Wq8PAnSob~VmhktOxyFKJMiYY6FEVoaGTsp4Yrz4D2qh7oAuYGL0EqEL6mWStjW3om3iITmNacfWd23WZrWZFBoNoeQD709m9yFW4oFYPccNK-L9lNb4MyxWnjGkKVRsJM5ZpwAwmr-ypKI4~JqA__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
            <span className="ar-content">منهجية انفِراد</span>
            <span className="en-content">INFIRAD Methodology</span>
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {/* Three-Phase Grid */}
        <div className="grid md:grid-cols-3 gap-0 border-2 border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Phase 1 */}
          <div className="p-10 bg-accent border-l-2 border-border group hover:bg-primary transition-all duration-300 hover-lift">
            <span className="text-5xl font-bold text-secondary/30 block mb-6 group-hover:text-white/10 font-mono transition-colors">
              01
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-white transition-colors font-display">
              <span className="ar-content">التصور والتحقق</span>
              <span className="en-content">Validation</span>
            </h3>
            <p className="text-foreground/70 text-xl md:text-2xl leading-relaxed group-hover:text-secondary transition-colors">
              <span className="ar-content">
                تقييم السوق والجدوى، تعريف المفهوم الفني، وتحديد المخاطر المبكرة لضمان واقعية الفكرة.
              </span>
              <span className="en-content">
                Market assessment, feasibility study, technical concept definition, and early risk identification.
              </span>
            </p>
          </div>
          
          {/* Phase 2 */}
          <div className="p-10 bg-accent border-l-2 border-border group hover:bg-primary transition-all duration-300 hover-lift">
            <span className="text-5xl font-bold text-secondary/30 block mb-6 group-hover:text-white/10 font-mono transition-colors">
              02
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-white transition-colors font-display">
              <span className="ar-content">المحاكاة والتحسين</span>
              <span className="en-content">Simulation</span>
            </h3>
            <p className="text-foreground/70 text-xl md:text-2xl leading-relaxed group-hover:text-secondary transition-colors">
              <span className="ar-content">
                هندسة ونمذجة الأنظمة، اختبار السيناريوهات، وتحليل المفاضلات القائمة على البيانات.
              </span>
              <span className="en-content">
                Engineering and system modeling, scenario testing, and data-driven trade-off analysis.
              </span>
            </p>
          </div>
          
          {/* Phase 3 */}
          <div className="p-10 bg-accent group hover:bg-primary transition-all duration-300 hover-lift">
            <span className="text-5xl font-bold text-secondary/30 block mb-6 group-hover:text-white/10 font-mono transition-colors">
              03
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-white transition-colors font-display">
              <span className="ar-content">التطوير والتجهيز</span>
              <span className="en-content">Preparation</span>
            </h3>
            <p className="text-foreground/70 text-xl md:text-2xl leading-relaxed group-hover:text-secondary transition-colors">
              <span className="ar-content">
                تكامل التقنيات، إعداد خرائط طريق التنفيذ، وتجهيز الوثائق الجاهزة للاستثمار.
              </span>
              <span className="en-content">
                Technology integration, implementation roadmaps, and creating investment-ready documentation.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
