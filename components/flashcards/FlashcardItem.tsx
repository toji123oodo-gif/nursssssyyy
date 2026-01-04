
import React, { useState } from 'react';
import { RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  card: {
    front: string;
    back: string;
    hint?: string;
  };
  onRate: (rating: 'easy' | 'hard') => void;
}

export const FlashcardItem: React.FC<Props> = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto h-[400px] perspective-1000 group">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-4 right-4 text-gray-200"><HelpCircle size={32} /></div>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">المصطلح الطبي</span>
          <h3 className="text-3xl font-black text-gray-900 mb-2">{card.front}</h3>
          <p className="mt-8 text-gray-400 text-xs animate-pulse">اضغط لعرض الإجابة</p>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-blue text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="absolute top-4 right-4 text-white/20"><RotateCcw size={32} /></div>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">التعريف</span>
          <h3 className="text-2xl font-bold mb-8 leading-relaxed">{card.back}</h3>
          
          <div className="flex gap-3 w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onRate('hard')}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-lg transition-all text-xs"
            >
              محتاج مراجعة
            </button>
            <button 
              onClick={() => onRate('easy')}
              className="flex-1 bg-white text-brand-blue font-bold py-3 rounded-lg shadow-md hover:bg-gray-100 transition-all text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> عرفتها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
