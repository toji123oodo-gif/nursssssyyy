
import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, GraduationCap, 
  Wallet, Key, PlayCircle, ShieldCheck, CheckCircle2, 
  Smartphone, MessageCircle, Brain, BookOpen 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingTour: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // تظهر الجولة فقط إذا كان المستخدم جديداً ولم يسبق له إتمامها
  useEffect(() => {
    if (user && !user.quizGrades && !user.completedLessons?.length && !user.subscriptionTier.includes('pro')) {
       // فحص محلي إضافي للتأكد من عدم الإزعاج
       const hasSeenTour = localStorage.getItem(`tour_done_${user.id}`);
       if (!hasSeenTour) {
         const timer = setTimeout(() => setIsVisible(true), 1500);
         return () => clearTimeout(timer);
       }
    }
  }, [user]);

  const steps = [
    {
      title: "أهلاً بك في عائلة نيرسي!",
      desc: "مبروك! أنت الآن جزء من أكبر تجمع لطلاب التمريض في مصر. رحلتك نحو الامتياز تبدأ من هنا.",
      icon: <GraduationCap size={48} className="text-brand-gold" />,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "إزاي تلاقي محاضراتك؟",
      desc: "في الصفحة الرئيسية، هتلاقي المنهج متقسم لمواد (تشريح، فسيولوجي، تمريض بالغين.. إلخ). اختار المادة اللي حابب تذاكرها وهتلاقي دروس مجانية متاحة فوراً.",
      icon: <BookOpen size={48} className="text-brand-gold" />,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "إزاي تفعل حساب الـ PRO؟",
      desc: "عشان تفتح كل الدروس وتحمل الملازم، هتروح لصفحة 'المحفظة'. تقدر تدفع بـ (فودافون كاش) أو (انستا باي) وتبعت الإيصال واتساب، والحساب بيتفعل في دقايق.",
      icon: <Wallet size={48} className="text-brand-gold" />,
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "معاك كود تفعيل؟",
      desc: "لو اشتريت كود من السنتر أو من المناديب، كل اللي عليك تدخل صفحة 'المحفظة' وتختار 'كود تفعيل' وتحط الكود المكون من 12 رقم، والمنصة هتفتح معاك فوراً.",
      icon: <Key size={48} className="text-brand-gold" />,
      image: "https://images.unsplash.com/photo-1633265486231-22983216f633?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "بيئة مذاكرة آمنة ومميزة",
      desc: "فيديوهاتنا سريعة وتعمل على أقل إنترنت. هتلاقي 'ووتر مارك' باسمك ورقمك لحماية حسابك، وبعد كل فيديو فيه اختبار بيقيس مستواك وجدول امتحانات بيعرفك مواعيدك.",
      icon: <ShieldCheck size={48} className="text-brand-gold" />,
      image: "https://images.unsplash.com/photo-15887025902cf-25a81205387c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleComplete = () => {
    if (user) {
      localStorage.setItem(`tour_done_${user.id}`, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-2xl animate-fade-in"></div>
      
      <div className="relative w-full max-w-4xl bg-brand-card border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto animate-scale-up">
        
        {/* Left Side: Image/Visual */}
        <div className="md:w-1/2 relative overflow-hidden hidden md:block">
           <img src={steps[step].image} className="w-full h-full object-cover opacity-60 scale-105" alt="onboarding" />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent"></div>
           <div className="absolute bottom-10 right-10 left-10 text-center">
              <div className="bg-brand-gold/20 backdrop-blur-md p-6 rounded-3xl border border-brand-gold/30">
                  <div className="flex justify-center mb-4">{steps[step].icon}</div>
                  <h4 className="text-brand-gold font-black text-xl">{steps[step].title}</h4>
              </div>
           </div>
        </div>

        {/* Right Side: Content & Controls */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-between">
           <div className="flex justify-between items-center mb-10">
              <div className="flex gap-2">
                 {steps.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-brand-gold shadow-glow' : 'w-2 bg-white/10'}`}></div>
                 ))}
              </div>
              <button onClick={handleComplete} className="text-brand-muted hover:text-white transition-colors"><X size={28}/></button>
           </div>

           <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in-up">
              <div className="md:hidden flex justify-center">{steps[step].icon}</div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter text-center md:text-right">
                {steps[step].title}
              </h2>
              <p className="text-brand-muted text-lg md:text-xl leading-relaxed text-center md:text-right font-medium">
                {steps[step].desc}
              </p>
           </div>

           <div className="mt-12 flex gap-4">
              {step < steps.length - 1 ? (
                <button 
                  onClick={() => setStep(prev => prev + 1)}
                  className="flex-1 bg-brand-gold text-brand-main font-black py-5 rounded-[1.8rem] shadow-glow hover:scale-[1.03] transition-all text-xl flex items-center justify-center gap-3"
                >
                   الخطوة التالية <ChevronLeft size={24} />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  className="flex-1 bg-brand-gold text-brand-main font-black py-5 rounded-[1.8rem] shadow-glow hover:scale-[1.03] transition-all text-xl flex items-center justify-center gap-3"
                >
                   يلا نبدأ المذاكرة <CheckCircle2 size={24} />
                </button>
              )}
              
              {step > 0 && (
                <button 
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-8 bg-white/5 text-white font-black py-5 rounded-[1.8rem] border border-white/10 hover:bg-white/10 transition-all text-xl flex items-center justify-center"
                >
                  <ChevronRight size={24} />
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
