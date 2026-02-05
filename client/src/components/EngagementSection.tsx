export default function EngagementSection() {
  return (
    <section id="engagement" className="py-24 bg-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/qY57DoIOhiWxBJmMIzGMkz/sandbox/wnevn9Ag6ZWuReI4sWnw1z-img-4_1770272569000_na1fn_cGFydG5lcnNoaXAtY29uY2VwdA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVk1N0RvSU9oaVd4QkptTUl6R01rei9zYW5kYm94L3duZXZuOUFnNlpXdVJlSTRzV253MXotaW1nLTRfMTc3MDI3MjU2OTAwMF9uYTFmbl9jR0Z5ZEc1bGNuTm9hWEF0WTI5dVkyVndkQS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ZUITSti~tFtrJrgZQlvICsZsor4oMdixlOt2yBCOlBo55st6uFlc7oXcc5iaJRA4iyIVgv0exqZYBLrMeHgzbPBeX8RNwW4SDL1pOfbd-aCX78DRIMeio~oFiSJ7P91-pw10v7pbxX6yByLtTo~IqGKIRbbBFrpN6Xf5GN4ih2Sga7H0Z8v-hQ4oExe1Sqh28C2cFbAWsiwJCjelwTk8u5B7nlZWBcRZhapsLlInNu-ZLBFaxCWFsMKU3SOm3Bjzv5hmEAn0i~VrP3We1iyPvJTJY-s0euO~A-CrSz1wihSXd2GcHVPvamnwnaJ2Wu7Xajbx~vo-OW3~zFcb3z1H~w__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
            <span className="ar-content">نموذج الشراكة</span>
            <span className="en-content">Engagement Model</span>
          </h2>
          <p className="text-secondary text-xl md:text-2xl max-w-2xl mx-auto font-medium">
            <span className="ar-content">
              نعمل وفق نموذجين مرنين يتناسبان مع احتياجات المشاريع الكبرى.
            </span>
            <span className="en-content">
              Operating through two flexible modes tailored for high-impact projects.
            </span>
          </p>
        </div>
        
        {/* Engagement Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Consulting */}
          <div className="p-10 bg-accent border-l-4 border-secondary rounded-xl shadow-sm hover-lift transition-brutal">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              <span className="ar-content">التعاقدات الاستشارية</span>
              <span className="en-content">Consulting Engagements</span>
            </h3>
            <p className="text-foreground/80 text-xl md:text-2xl leading-relaxed">
              <span className="ar-content">
                دراسات فنية وتحليلية لدعم اتخاذ القرار، التحقق من الجدوى، وتقليل المخاطر.
              </span>
              <span className="en-content">
                Targeted studies and analyses supporting critical decisions and risk reduction.
              </span>
            </p>
          </div>
          
          {/* Strategic Partnerships */}
          <div className="p-10 bg-primary border-l-4 border-secondary rounded-xl shadow-lg hover-lift transition-brutal">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
              <span className="ar-content">شراكات التطوير الاستراتيجية</span>
              <span className="en-content">Strategic Partnerships</span>
            </h3>
            <p className="text-secondary text-xl md:text-2xl leading-relaxed">
              <span className="ar-content">
                تعمل انفِراد كعمود فقري تقني لمشروعك من مرحلة التصور وحتى الجاهزية للتنفيذ.
              </span>
              <span className="en-content">
                Selective, phased partnerships where INFIRAD acts as a technical backbone.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
