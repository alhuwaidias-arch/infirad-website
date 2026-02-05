import { Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="py-20 border-t-2 border-border bg-accent">
      <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/118103656/mQzhKltIIwOMzPqh.png" 
              alt="INFIRAD Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <p className="text-foreground text-lg md:text-xl leading-relaxed max-w-sm">
            <span className="ar-content">
              الشريك الهندسي الاستراتيجي لتطوير المشاريع النوعية في المملكة العربية السعودية.
            </span>
            <span className="en-content">
              The strategic technical partner for flagship project development in Saudi Arabia.
            </span>
          </p>
        </div>
        
        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-foreground font-bold font-display text-lg">
            <span className="ar-content">تواصل معنا</span>
            <span className="en-content">Contact</span>
          </h4>
          <div className="space-y-3 text-foreground/80 text-lg">
            <a 
              href="mailto:info@infiradeng.com" 
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Mail className="w-5 h-5" /> 
              info@infiradeng.com
            </a>
            <a 
              href="https://wa.me/966530151525" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="phone-number">+966 530 151 525</span>
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h4 className="text-foreground font-bold font-display text-lg">
            <span className="ar-content">المقر</span>
            <span className="en-content">Location</span>
          </h4>
          <p className="text-foreground/80 text-lg flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
            <span>
              <span className="ar-content">الرياض، المملكة العربية السعودية</span>
              <span className="en-content">Riyadh, Saudi Arabia</span>
            </span>
          </p>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="container mx-auto px-6 mt-20 pt-8 border-t-2 border-border text-center">
        <p className="text-base text-secondary uppercase tracking-widest font-mono">
          &copy; 2026 INFIRAD. From Idea to Certainty.
        </p>
      </div>
    </footer>
  );
}
