
import React, { useState } from 'react';
import { Quiz, Question } from '../types';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, RefreshCw, Trophy, HelpCircle, X, Brain, Timer } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentStep];

  const handleSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: optionIndex });
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correctCount++;
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResult(true);
    onComplete(calculateScore());
  };

  // نافذة النتائج النهائية
  if (showResult) {
    const score = calculateScore();
    return (
      <div className="fixed inset-0 z-[1000] bg-brand-main flex items-center justify-center p-4 md:p-8 animate-fade-in overflow-y-auto">
        <div className="w-full max-w-2xl bg-brand-card border border-white/10 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] rounded-full"></div>
          
          <div className={`w-32 h-32 md:w-44 md:h-44 mx-auto rounded-full flex items-center justify-center shadow-glow transition-all duration-1000 ${score >= 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            <Trophy size={score >= 50 ? 80 : 64} className="animate-bounce-slow" />
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              {score >= 50 ? 'مبروك يا بطل!' : 'فرصة تانية يا بطل'}
            </h3>
            <p className="text-brand-muted text-lg font-medium">لقد أتممت الاختبار بنجاح</p>
            <div className="text-7xl md:text-8xl font-black text-brand-gold drop-shadow-glow">
              {score}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <button 
              onClick={onClose} 
              className="bg-brand-gold text-brand-main font-black py-5 px-8 rounded-2xl shadow-glow hover:scale-[1.03] transition-all text-xl"
            >
              العودة للدرس
            </button>
            <button 
              onClick={() => { setShowResult(false); setIsSubmitted(false); setSelectedAnswers({}); setCurrentStep(0); }} 
              className="bg-white/5 text-white font-black py-5 px-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-xl"
            >
              إعادة الاختبار
            </button>
          </div>
        </div>
      </div>
    );
  }

  // واجهة الأسئلة
  return (
    <div className="fixed inset-0 z-[1000] bg-brand-main flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="h-20 md:h-28 bg-brand-card/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 shrink-0">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold hidden md:block">
              <Brain size={24} />
           </div>
           <div>
              <h4 className="text-white font-black text-base md:text-xl line-clamp-1">{quiz.title}</h4>
              <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">اختبار المحاضرة</p>
           </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-3 bg-brand-main/50 px-4 py-2 rounded-xl border border-white/5">
                <Timer size={16} className="text-brand-gold" />
                <span className="text-white font-mono font-bold text-sm">مستمر...</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 md:p-4 bg-white/5 text-brand-muted hover:text-white hover:bg-red-500/20 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
            >
              <X size={24} strokeWidth={3} />
            </button>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">التقدم الحالي</p>
                  <h5 className="text-white font-black text-2xl">سؤال {currentStep + 1} <span className="text-brand-muted font-normal text-lg">/ {quiz.questions.length}</span></h5>
               </div>
               <div className="text-right">
                  <span className="text-brand-gold font-black text-3xl">{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}%</span>
               </div>
            </div>
            <div className="h-3 bg-brand-card rounded-full overflow-hidden p-0.5 border border-white/5">
               <div 
                 className="h-full bg-brand-gold rounded-full shadow-glow transition-all duration-700 ease-out" 
                 style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
               ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-brand-card/50 border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-2xl space-y-10">
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {currentQuestion.text}
              </h3>

              <div className="grid grid-cols-1 gap-5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full group text-right p-6 md:p-8 rounded-3xl border-2 transition-all flex items-center justify-between
                        ${isSelected 
                          ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-glow/10 scale-[1.02]' 
                          : 'bg-brand-main/50 border-white/5 text-brand-muted hover:border-white/20 hover:text-white hover:bg-brand-main'
                        }`}
                    >
                      <div className="flex items-center gap-5">
                         <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${isSelected ? 'bg-brand-gold text-brand-main' : 'bg-brand-card text-brand-muted group-hover:bg-white/10'}`}>
                           {String.fromCharCode(65 + idx)}
                         </div>
                         <span className="text-lg md:text-2xl font-black">{option}</span>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-brand-gold bg-brand-gold text-brand-main' : 'border-white/10'}`}>
                        {isSelected && <CheckCircle2 size={18} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-24 md:h-32 bg-brand-card/80 backdrop-blur-2xl border-t border-white/5 px-6 md:px-12 flex items-center justify-center shrink-0">
          <div className="max-w-4xl w-full flex gap-4 md:gap-8">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex-1 bg-white/5 text-white font-black py-5 md:py-6 rounded-2xl border border-white/10 disabled:opacity-20 flex items-center justify-center gap-3 transition-all active:scale-95 text-sm md:text-lg"
            >
              <ArrowRight size={24} /> السابق
            </button>

            {currentStep === quiz.questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={selectedAnswers[currentStep] === undefined}
                className="flex-[2] bg-brand-gold text-brand-main font-black py-5 md:py-6 rounded-2xl shadow-glow disabled:opacity-50 transition-all active:scale-95 text-lg md:text-2xl flex items-center justify-center gap-3"
              >
                إنهاء الاختبار وتصحيح <ArrowLeft size={24} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentStep(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                disabled={selectedAnswers[currentStep] === undefined}
                className="flex-[2] bg-brand-gold text-brand-main font-black py-5 md:py-6 rounded-2xl shadow-glow disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95 text-lg md:text-2xl"
              >
                السؤال التالي <ArrowLeft size={24} />
              </button>
            )}
          </div>
      </div>
    </div>
  );
};
