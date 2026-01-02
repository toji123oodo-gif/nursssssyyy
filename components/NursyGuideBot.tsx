
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, MessageCircle, ChevronLeft, ChevronRight, 
  Sparkles, Zap, Wallet, PlayCircle, Brain, 
  ShieldCheck, Smartphone, HelpCircle 
} from 'lucide-react';

interface GuideStep {
  page: string;
  title: string;
  message: string;
  highlight?: string;
}

export const NursyGuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);
  const [isMinimized, setIsMinimized] = useState(true);
  const location = useLocation();

  // سيناريوهات الشرح حسب الصفحة
  const scripts: Record<string, GuideStep[]> = {
    '/': [
      { page: '/', title: "منور يا دكتور!", message: "بص يا سيدي، دي الصفحة الرئيسية. هنا هتلاقي كل المواد اللي عليك في الكلية، متقسمة ومرتبة عشان متتوهش." },
      { page: '/', title: "تختار مادتك إزاي؟", message: "هتلاقي فوق 'فلاتر' للمواد.. دوس على المادة اللي عايزها، والكورسات بتاعتها هتظهرلك فوراً. كل كورس فيه فيديوهات وملازم." }
    ],
    '/dashboard': [
      { page: '/dashboard', title: "ده ملعبك يا بطل!", message: "هنا بقى المكان اللي هتذاكر فيه. الفيديو في النص، والمنهج كله على إيدك الشمال (أو اليمين لو موبايل)." },
      { page: '/dashboard', title: "الملفات والاختبارات", message: "تحت الفيديو هتلاقي تبويب 'المصادر' عشان تحمل الملازم PDF، وتبويب 'الاختبار' عشان تمتحن نفسك بعد كل محاضرة." }
    ],
    '/wallet': [
      { page: '/wallet', title: "تشترك إزاي؟", message: "الموضوع بسيط جداً.. عندك طريقتين: إما تحول فودافون كاش على الرقم اللي قدامك وتبعت السكرين شوت واتساب، أو لو معاك كود تفعيل حطه هنا وهوبا! الحساب هيفتح." }
    ],
    'common': [
      { page: '*', title: "حماية حسابك", message: "خد بالك، حسابك متأمن جداً. اسمك ورقمك هيظهروا على الشاشة (ووتر مارك) عشان مصلحتك، ومينفعش تفتح الحساب من جهازين في نفس الوقت." }
    ]
  };

  const currentPath = location.pathname;
  const currentScript = scripts[currentPath] || scripts['/'];

  const handleNext = () => {
    if (activeMessage < currentScript.length - 1) {
      setActiveMessage(activeMessage + 1);
    } else {
      setIsOpen(false);
      setIsMinimized(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2500] flex flex-col items-end">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="mb-4 w-72 md:w-80 bg-brand-card border border-brand-gold/30 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-up origin-bottom-right">
          <div className="bg-brand-gold p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Sparkles size={16} className="text-brand-main animate-pulse" />
               <span className="text-brand-main font-black text-xs uppercase tracking-tighter">Nursy Assistant</span>
            </div>
            <button onClick={() => {setIsOpen(false); setIsMinimized(true);}} className="text-brand-main/50 hover:text-brand-main transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
             <h4 className="text-white font-black text-lg leading-tight">{currentScript[activeMessage].title}</h4>
             <p className="text-brand-muted text-sm leading-relaxed font-bold">
               {currentScript[activeMessage].message}
             </p>
             
             <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">
                  خطوة {activeMessage + 1} من {currentScript.length}
                </span>
                <button 
                  onClick={handleNext}
                  className="bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-main px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2"
                >
                  {activeMessage < currentScript.length - 1 ? 'فهمت.. اللي بعده' : 'تمام شكراً'} 
                  <ChevronLeft size={14} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* The Bot Character */}
      <button 
        onClick={() => {setIsOpen(!isOpen); setIsMinimized(false); setActiveMessage(0);}}
        className={`relative group transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen ? 'scale-90' : 'scale-100'}`}
      >
        {/* Breathing Aura */}
        <div className="absolute inset-0 bg-brand-gold rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse-slow"></div>
        
        {/* Character Body */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-brand-card border-2 border-brand-gold rounded-3xl flex items-center justify-center shadow-glow overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 to-transparent"></div>
           
           {/* Bot Face */}
           <div className="flex flex-col items-center gap-1 animate-float">
              <div className="flex gap-2">
                 <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
              </div>
              <div className="w-6 h-1 bg-brand-gold/30 rounded-full"></div>
           </div>

           {/* Notification Badge */}
           {isMinimized && (
             <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-brand-card animate-bounce">
               1
             </div>
           )}
        </div>

        {/* Hover Label */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-main px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-glow">
            مش عارف تعمل إيه؟ دوس هنا!
          </div>
        )}
      </button>
    </div>
  );
};
