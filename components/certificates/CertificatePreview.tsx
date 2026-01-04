
import React from 'react';
import { X, Award, ShieldCheck, Download } from 'lucide-react';

interface Props {
  userName: string;
  courseTitle: string;
  date: string;
  onClose: () => void;
}

export const CertificatePreview: React.FC<Props> = ({ userName, courseTitle, date, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
           <h3 className="font-bold text-gray-700">معاينة الشهادة</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center">
           <div className="bg-white p-12 text-center shadow-lg max-w-2xl w-full border-[10px] border-double border-gray-200 relative">
              <div className="w-20 h-20 mx-auto bg-brand-blue text-white rounded-full flex items-center justify-center mb-8">
                 <Award size={40} />
              </div>
              
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">شهادة إتمام</h1>
              <p className="text-gray-500 italic mb-8">تمنح هذه الشهادة إلى</p>
              
              <h2 className="text-4xl font-bold text-brand-blue mb-8 border-b border-gray-200 pb-8 inline-block px-10">
                 {userName}
              </h2>
              
              <p className="text-gray-600 mb-2">لإتمامه بنجاح الكورس التدريبي:</p>
              <h3 className="text-2xl font-bold text-gray-800 mb-12">{courseTitle}</h3>
              
              <div className="flex justify-between items-end text-sm text-gray-500 mt-12 pt-8 border-t border-gray-100">
                 <div className="text-center">
                    <p className="font-bold mb-1">{date}</p>
                    <p className="text-xs uppercase tracking-wider">التاريخ</p>
                 </div>
                 <div className="text-center">
                    <ShieldCheck className="mx-auto mb-2 text-brand-blue" size={32} />
                    <p className="text-xs uppercase tracking-wider font-bold">معتمد من Nursy</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
           <button onClick={onClose} className="btn-secondary text-sm">إغلاق</button>
           <button className="btn-primary text-sm flex items-center gap-2">
              <Download size={16} /> تحميل PDF
           </button>
        </div>
      </div>
    </div>
  );
};
