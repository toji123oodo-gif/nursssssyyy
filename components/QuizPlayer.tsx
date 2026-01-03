
import React, { useState } from 'react';
import { Quiz, Question } from '../types';
import { 
  CheckCircle2, XCircle, ArrowLeft, ArrowRight, 
  RefreshCw, Trophy, HelpCircle, X, Brain, Timer,
  Info, ChevronLeft, Award, Sparkles, Star
} from 'lucide-react';

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
    const finalScore = calculateScore();
    setIsSubmitted(true);
    setShowResult(true);
    onComplete(finalScore);
  };

  if (showResult) {
    const score = calculateScore();
    const isPassed = score >= 50;

    return (
      <div className="fixed inset-0 z-[1000] bg-brand-main/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fade-in overflow-y-auto">
        <div className="w-full max-w-2xl bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-16 text-center shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-2 ${isPassed ? 'bg-green-500 shadow-glow-green' : 'bg-red-500 shadow-glow-red'}`}></div>
          
          <div className="space-y-12 relative z-10">
            <div className={`w-32 h-32 md:w-40 md:h-40 mx-auto rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-1000 ${isPassed ? 'bg-green-500/10 text-green-500 border border-green-500/20 rotate-12' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {isPassed ? <Award size={80} className="animate-bounce-slow" /> : <Brain size={80} />}
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10 text-[10px] font-black text-brand-muted uppercase tracking-widest">
                تم الانتهاء من الاختبار
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {isPassed ? 'عاش يا بطل! 👏' : 'محاولة جيدة يا دكتور'}
              </h3>
              <p className="text-brand-muted text-lg font-medium">النتيجة النهائية التي حققتها هي:</p>
              <div className={`text-8xl md:text-[9rem] font-black drop-shadow-2xl ${isPassed ? 'text-brand-gold' : 'text-red-500'}`}>
                {score}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <button 
                onClick={onClose} 
                className="bg-brand-gold text-brand-main font-black py-6 px-8 rounded-2xl shadow-glow hover:scale-[1.03] active:scale-95 transition-all text-xl flex items-center justify-center gap-3"
              >
                <ChevronLeft size={24} /> العودة للدرس
              </button>
              <button 
                onClick={() => { setShowResult(false); setIsSubmitted(false); setSelectedAnswers({}); setCurrentStep(0); }} 
                className="bg-white/5 text-white font-black py-6 px-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-xl"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-brand-main flex flex-col animate-fade-in overflow-hidden">
      {/* Cinematic Header */}
      <div className="h-24 md:h-32 bg-brand-card/60 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-8 md:px-16 shrink-0 relative">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl text-brand-gold hidden md:flex items-center justify-center border border-brand-gold/20 shadow-glow">
              <Brain size={28} />
           </div>
           <div>
              <h4 className="text-white font-black text-lg md:text-2xl line-clamp-1 tracking-tight">{quiz.title}</h4>
              <div className="flex items-center gap-4 mt-1">
                 <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest">اختبار المحاضرة</p>
                 <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                 <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={10}/> {quiz.questions.length} سؤال
                 </p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <Timer size={18} className="text-brand-gold animate-pulse" />
                <span className="text-white font-english font-black text-sm uppercase">Active Session</span>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 md:w-16 md:h-16 bg-white/5 text-brand-muted hover:text-white hover:bg-red-500/20 rounded-[1.5rem] transition-all border border-white/5 flex items-center justify-center"
            >
              <X size={28} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-6 md:px-16 bg-mesh">
        <div className="max-w-5xl mx-auto space-y-12 pb-32">
          
          {/* Progress Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em]">المرحلة الحالية</p>
                  <h5 className="text-white font-black text-3xl md:text-4xl">سؤال {currentStep + 1} <span className="text-brand-muted font-bold text-xl opacity-40">من {quiz.questions.length}</span></h5>
               </div>
               <div className="text-right">
                  <span className="text-brand-gold font-black text-3xl md:text-5xl">{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}%</span>
               </div>
            </div>
            <div className="h-4 bg-brand-card rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
               <div 
                 className="h-full bg-brand-gold rounded-full shadow-glow transition-all duration-1000 ease-out relative" 
                 style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
               >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
               </div>
            </div>
          </div>

          {/* Question & Choices Card */}
          <div className="bg-brand-card/50 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-10 md:p-20 shadow-2xl space-y-12 relative overflow-hidden group">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-gold/5 blur-[100px] rounded-full"></div>
              
              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter relative z-10">
                {currentQuestion.text}
              </h3>

              <div className="grid grid-cols-1 gap-6 relative z-10">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full group text-right p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between
                        ${isSelected 
                          ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-[1.03]' 
                          : 'bg-brand-main/40 border-white/5 text-brand-muted hover:border-brand-gold/40 hover:text-white hover:bg-brand-main'
                        }`}
                    >
                      <div className="flex items-center gap-8">
                         <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl transition-all ${isSelected ? 'bg-brand-main text-brand-gold' : 'bg-brand-card text-brand-muted group-hover:bg-white/5'}`}>
                           {String.fromCharCode(65 + idx)}
                         </div>
                         <span className="text-xl md:text-3xl font-black">{option}</span>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-brand-main bg-brand-main text-brand-gold' : 'border-white/10'}`}>
                        {isSelected && <CheckCircle2 size={24} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentQuestion.explanation && isSubmitted && (
                 <div className="bg-brand-gold/10 border border-brand-gold/20 p-8 rounded-3xl mt-10 animate-fade-in-up">
                    <h5 className="text-brand-gold font-black text-sm mb-2 flex items-center gap-2 uppercase tracking-widest"><Info size={16}/> شرح الإجابة:</h5>
                    <p className="text-brand-text/80 font-bold text-lg leading-relaxed">{currentQuestion.explanation}</p>
                 </div>
              )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="h-28 md:h-40 bg-brand-card/80 backdrop-blur-3xl border-t border-white/10 px-8 md:px-16 flex items-center justify-center shrink-0">
          <div className="max-w-5xl w-full flex gap-6 md:gap-10">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex-1 bg-white/5 text-white font-black py-6 md:py-8 rounded-[2rem] border border-white/10 disabled:opacity-10 flex items-center justify-center gap-4 transition-all active:scale-95 text-lg"
            >
              <ArrowRight size={32} /> المحتوى السابق
            </button>

            {currentStep === quiz.questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={selectedAnswers[currentStep] === undefined}
                className="flex-[2] bg-brand-gold text-brand-main font-black py-6 md:py-8 rounded-[2rem] shadow-glow disabled:opacity-30 transition-all active:scale-95 text-2xl md:text-3xl flex items-center justify-center gap-4 group"
              >
                إنهاء وتصحيح الاختبار <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentStep(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                disabled={selectedAnswers[currentStep] === undefined}
                className="flex-[2] bg-brand-gold text-brand-main font-black py-6 md:py-8 rounded-[2rem] shadow-glow disabled:opacity-30 flex items-center justify-center gap-4 transition-all active:scale-95 text-2xl md:text-3xl group"
              >
                السؤال التالي <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
              </button>
            )}
          </div>
      </div>
    </div>
  );
};
