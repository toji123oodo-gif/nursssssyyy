
import React, { useState } from 'react';
import { Quiz } from '../types';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, HelpCircle
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

  const currentQuestion = quiz.questions[currentStep];

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
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
    setShowResult(true);
    onComplete(calculateScore());
  };

  if (showResult) {
    const score = calculateScore();
    const passed = score >= 50;
    return (
      <div className="fixed inset-0 z-[1000] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center animate-scale-up">
           <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {passed ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">{passed ? 'أحسنت!' : 'حاول مرة أخرى'}</h2>
           <p className="text-gray-500 mb-6">نتيجتك هي {score}%</p>
           <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-primary">إنهاء</button>
              <button onClick={() => {setShowResult(false); setSelectedAnswers({}); setCurrentStep(0);}} className="flex-1 btn-secondary">إعادة</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
         <span className="font-bold text-gray-900">{quiz.title}</span>
         <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
      </div>

      {/* Progress */}
      <div className="h-1 bg-gray-200 w-full">
         <div className="h-full bg-brand-blue transition-all duration-300" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}></div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">سؤال {currentStep + 1} من {quiz.questions.length}</span>
         <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10 leading-relaxed">
            {currentQuestion.text}
         </h3>

         <div className="w-full space-y-3">
            {currentQuestion.options.map((opt, idx) => (
               <button
                 key={idx}
                 onClick={() => handleSelect(idx)}
                 className={`w-full p-4 rounded-lg border-2 text-right transition-all flex items-center justify-between ${
                    selectedAnswers[currentStep] === idx 
                    ? 'border-brand-blue bg-blue-50 text-brand-blue' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                 }`}
               >
                  <span className="font-medium">{opt}</span>
                  {selectedAnswers[currentStep] === idx && <CheckCircle2 size={18} />}
               </button>
            ))}
         </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 flex justify-between">
         <button 
           disabled={currentStep === 0}
           onClick={() => setCurrentStep(p => p - 1)}
           className="btn-secondary disabled:opacity-50"
         >
           السابق
         </button>
         
         {currentStep === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn-primary" disabled={selectedAnswers[currentStep] === undefined}>إنهاء</button>
         ) : (
            <button onClick={() => setCurrentStep(p => p + 1)} className="btn-primary" disabled={selectedAnswers[currentStep] === undefined}>التالي</button>
         )}
      </div>
    </div>
  );
};
