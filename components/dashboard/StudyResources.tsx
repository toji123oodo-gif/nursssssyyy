
import React from 'react';
import { FileText, Download, Brain } from 'lucide-react';
import { ContentItem } from '../../types';

interface Props {
  pdfFiles: ContentItem[];
  onQuizClick: () => void;
}

export const StudyResources: React.FC<Props> = ({ pdfFiles, onQuizClick }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-gray-400" /> الملفات المرفقة
        </h4>
        <div className="space-y-2">
          {pdfFiles.map(f => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded border border-gray-200 text-red-500">
                  <FileText size={16}/>
                </div>
                <div>
                   <p className="text-sm font-medium text-gray-700">{f.title}</p>
                   <p className="text-xs text-gray-400 uppercase">PDF Document</p>
                </div>
              </div>
              <a href={f.url} target="_blank" className="text-brand-blue hover:text-blue-700 p-2">
                <Download size={18}/>
              </a>
            </div>
          ))}
          {pdfFiles.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">لا توجد ملفات</p>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-6 flex flex-col items-center text-center">
        <div className="bg-white p-3 rounded-full shadow-sm text-brand-blue mb-3">
          <Brain size={24} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">اختبر نفسك</h4>
        <p className="text-sm text-gray-600 mb-4">تأكد من فهمك للدرس عبر كويز سريع.</p>
        <button 
          onClick={onQuizClick} 
          className="btn-primary w-full max-w-xs"
        >
          بدء الاختبار
        </button>
      </div>
    </div>
  );
};
