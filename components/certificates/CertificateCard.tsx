
import React from 'react';
import { Award, Lock, Eye, Download } from 'lucide-react';

interface Props {
  courseTitle: string;
  isUnlocked: boolean;
  completionDate?: string;
  onPreview: () => void;
}

export const CertificateCard: React.FC<Props> = ({ courseTitle, isUnlocked, completionDate, onPreview }) => {
  return (
    <div className={`rounded-lg border p-6 transition-all ${
      isUnlocked 
      ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' 
      : 'bg-gray-50 border-gray-200 opacity-75'
    }`}>
      <div className="flex items-start justify-between mb-4">
         <div className={`p-3 rounded-lg ${isUnlocked ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
            {isUnlocked ? <Award size={24} /> : <Lock size={24} />}
         </div>
         {isUnlocked && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded">
               مكتملة
            </span>
         )}
      </div>

      <h3 className="font-bold text-gray-900 mb-1">{courseTitle}</h3>
      <p className="text-xs text-gray-500 mb-6">
        {isUnlocked ? `تاريخ الإصدار: ${completionDate}` : 'أكمل الكورس لفتح الشهادة'}
      </p>

      {isUnlocked ? (
        <div className="flex gap-2">
          <button 
            onClick={onPreview}
            className="flex-1 btn-primary text-xs flex items-center justify-center gap-2"
          >
            <Eye size={14} /> عرض
          </button>
          <button className="p-2 btn-secondary text-gray-500 hover:text-gray-900">
            <Download size={14} />
          </button>
        </div>
      ) : (
         <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 w-[40%]"></div>
         </div>
      )}
    </div>
  );
};
