
import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

export const FlashcardWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Brain size={24} />
         </div>
      </div>

      <h4 className="font-bold text-gray-900 mb-1">تحدي الكروت</h4>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        نشط ذاكرتك بمراجعة 5 مصطلحات في دقيقتين.
      </p>

      <Link 
        to="/flashcards" 
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
      >
        بدء المراجعة <ArrowRight size={16} />
      </Link>
    </div>
  );
};
