
import React, { useState, useEffect } from 'react';
import { Save, Edit3, Trash2, Check } from 'lucide-react';

interface Props {
  lessonId: string;
}

export const LessonNotes: React.FC<Props> = ({ lessonId }) => {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem(`note_${lessonId}`);
    if (savedNote) setNote(savedNote);
  }, [lessonId]);

  const handleSave = () => {
    localStorage.setItem(`note_${lessonId}`, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Edit3 size={18} className="text-gray-400" /> ملاحظاتي
        </h4>
        {isSaved && (
          <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
            <Check size={12} /> تم الحفظ
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (isSaved) setIsSaved(false);
          }}
          placeholder="سجل أفكارك وملاحظاتك المهمة هنا..."
          className="w-full h-64 bg-yellow-50/50 border border-yellow-200/50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed outline-none focus:border-brand-blue focus:bg-white transition-colors resize-none"
        ></textarea>
        <div className="absolute bottom-4 left-4 flex gap-2">
           <button 
             onClick={handleSave}
             className="p-2 bg-brand-blue text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
             title="حفظ"
           >
             <Save size={16} />
           </button>
           <button 
             onClick={() => { if(window.confirm('مسح الملاحظة؟')) { setNote(''); localStorage.removeItem(`note_${lessonId}`); }}}
             className="p-2 bg-white border border-gray-200 text-gray-500 rounded-md hover:text-red-600 hover:bg-red-50 transition-colors"
             title="مسح"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};
