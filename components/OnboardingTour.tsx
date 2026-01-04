
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, GraduationCap, Wallet, BookOpen, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingTour: React.FC = () => {
  const { user } = useApp();
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user && !user.quizGrades && !user.completedLessons?.length && !user.subscriptionTier.includes('pro')) {
       const hasSeenTour = localStorage.getItem(`tour_done_${user.id}`);
       if (!hasSeenTour) {
         const timer = setTimeout(() => setIsVisible(true), 1000);
         return () => clearTimeout(timer);
       }
    }
  }, [user]);

  const steps = [
    {
      title: "أهلاً بك في نيرسي!",
      desc: "منصتك الأولى للتعليم الطبي المتطور. جولة سريعة لنعرفك على المميزات.",
      icon: <GraduationCap size={48} className="text-brand-blue" />,
    },
    {
      title: "المحتوى الأكاديمي",
      desc: "تصفح الكورسات والمحاضرات بسهولة، وتابع تقدمك لحظة بلحظة.",
      icon: <BookOpen size={48} className="text-green-500" />,
    },
    {
      title: "الاشتراكات",
      desc: "يمكنك تفعيل العضوية المميزة بسهولة عبر المحفظة للوصول للمحتوى الحصري.",
      icon: <Wallet size={48} className="text-orange-500" />,
    }
  ];

  const handleComplete = () => {
    if (user) localStorage.setItem(`tour_done_${user.id}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-up">
        <div className="flex justify-end">
           <button onClick={handleComplete} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <div className="py-8">
           <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              {steps[step].icon}
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-3">{steps[step].title}</h2>
           <p className="text-gray-600 leading-relaxed">{steps[step].desc}</p>
        </div>

        <div className="flex gap-3 mt-4">
           {step > 0 && (
             <button onClick={() => setStep(s => s - 1)} className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
               <ChevronRight size={20} />
             </button>
           )}
           <button 
             onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleComplete()}
             className="flex-1 btn-primary py-3 rounded-lg flex items-center justify-center gap-2"
           >
             {step < steps.length - 1 ? 'التالي' : 'ابدأ الآن'} 
             {step < steps.length - 1 && <ChevronLeft size={18} />}
           </button>
        </div>
        
        <div className="flex justify-center gap-2 mt-6">
           {steps.map((_, i) => (
             <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-brand-blue' : 'w-1.5 bg-gray-200'}`}></div>
           ))}
        </div>
      </div>
    </div>
  );
};
