
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, Question, Quiz } from '../../types';
import { 
  PlusCircle, Edit, Trash, Layers, Mic2, FileDown, Plus, X, 
  FileText, Upload, Info, Save, ChevronDown, ChevronUp, 
  GripVertical, BookOpen, Brain, CheckCircle2, FileJson,
  Trash2, HelpCircle
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);

  const handleSave = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) {
        await updateCourse(editingCourse as Course);
      } else {
        await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course);
      }
      setIsModalOpen(false);
      alert('تم الحفظ بنجاح');
    } catch (e) {
      alert('خطأ في الحفظ');
    }
  };

  const addManualQuestion = (lIdx: number) => {
    const newL = [...(editingCourse?.lessons || [])];
    if (!newL[lIdx].quiz) {
      newL[lIdx].quiz = { id: 'q' + Date.now(), title: 'اختبار ' + newL[lIdx].title, questions: [] };
    }
    newL[lIdx].quiz!.questions.push({
      id: 'qn' + Date.now(),
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    });
    setEditingCourse({ ...editingCourse, lessons: newL });
  };

  const removeQuestion = (lIdx: number, qIdx: number) => {
    const newL = [...(editingCourse?.lessons || [])];
    newL[lIdx].quiz!.questions.splice(qIdx, 1);
    setEditingCourse({ ...editingCourse, lessons: newL });
  };

  const handleBulkImport = () => {
    if (targetIdx === null || !bulkText.trim()) return;
    
    // الصيغة: السؤال | اختيار1 | اختيار2 | اختيار3 | اختيار4 | 0
    const lines = bulkText.split('\n').filter(l => l.trim().includes('|'));
    const importedQuestions: Question[] = lines.map(line => {
      const parts = line.split('|').map(p => p.trim());
      const text = parts[0];
      const options = [parts[1] || '', parts[2] || '', parts[3] || '', parts[4] || ''];
      const correctIdx = parseInt(parts[5]) || 0;
      return {
        id: 'qn' + Math.random().toString(36).substr(2, 9),
        text,
        options,
        correctOptionIndex: correctIdx > 3 ? 0 : correctIdx
      };
    });

    const newL = [...(editingCourse?.lessons || [])];
    if (!newL[targetIdx].quiz) {
      newL[targetIdx].quiz = { id: 'q' + Date.now(), title: 'اختبار مستورد', questions: [] };
    }
    newL[targetIdx].quiz!.questions = [...(newL[targetIdx].quiz!.questions || []), ...importedQuestions];
    
    setEditingCourse({ ...editingCourse, lessons: newL });
    setBulkText('');
    setIsBulkOpen(false);
    setTargetIdx(null);
    alert(`تم استيراد ${importedQuestions.length} سؤال بنجاح`);
  };

  const updateQuestionField = (lIdx: number, qIdx: number, field: string, value: any) => {
    const newL = [...(editingCourse?.lessons || [])];
    if (field === 'text') {
      newL[lIdx].quiz!.questions[qIdx].text = value;
    } else if (field === 'correct') {
      newL[lIdx].quiz!.questions[qIdx].correctOptionIndex = value;
    }
    setEditingCourse({ ...editingCourse, lessons: newL });
  };

  const updateOptionText = (lIdx: number, qIdx: number, optIdx: number, value: string) => {
    const newL = [...(editingCourse?.lessons || [])];
    newL[lIdx].quiz!.questions[qIdx].options[optIdx] = value;
    setEditingCourse({ ...editingCourse, lessons: newL });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-white">إدارة المحتوى الدراسي</h2>
         <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: '', instructor: ''}); setIsModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-glow transition-all hover:scale-105"><PlusCircle size={20}/> إنشاء كورس جديد</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-brand-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-xl hover:border-brand-gold/20 transition-all group">
            <div className="h-48 relative overflow-hidden">
              <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
              <div className="absolute inset-0 bg-brand-main/40 group-hover:bg-brand-main/10 transition-all"></div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} className="p-3 bg-brand-gold text-brand-main rounded-xl shadow-lg"><Edit size={18}/></button>
                <button onClick={() => deleteCourse(course.id)} className="p-3 bg-red-500 text-white rounded-xl shadow-lg"><Trash size={18}/></button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-white font-black text-lg mb-2">{course.title}</h4>
              <div className="flex justify-between text-[10px] font-black uppercase text-brand-muted">
                 <span>{course.lessons.length} محاضرة</span>
                 <span className="text-brand-gold">{course.price} ج.م</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/98 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-6xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl h-[92vh] flex flex-col overflow-hidden animate-scale-up">
             
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <div>
                  <h3 className="text-2xl font-black text-white">محرر المحتوى والاختبارات</h3>
                  <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">تعديل: {editingCourse.title || 'كورس جديد'}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white/5 text-brand-muted hover:text-white rounded-2xl flex items-center justify-center transition-all"><X size={24}/></button>
             </div>

             <div className="p-8 overflow-y-auto flex-1 space-y-10 no-scrollbar">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">اسم الكورس</label>
                      <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" placeholder="أدخل اسم الكورس..." />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">المحاضر</label>
                      <input type="text" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" placeholder="اسم الدكتور..." />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">التخصص</label>
                      <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" placeholder="مثلاً: Anatomy" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">السعر (ج.م)</label>
                      <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-white flex items-center gap-2"><Mic2 className="text-brand-gold" size={20} /> المحاضرات الصوتية والملفات</h4>
                      <button onClick={() => setEditingCourse({...editingCourse, lessons: [...(editingCourse.lessons || []), {id: 'l'+Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: []}]})} className="bg-brand-gold/10 text-brand-gold px-6 py-3 rounded-xl text-[10px] font-black border border-brand-gold/20 flex items-center gap-2 hover:bg-brand-gold hover:text-brand-main transition-all shadow-glow"><Plus size={14}/> إضافة محاضرة</button>
                   </div>

                   <div className="space-y-6">
                      {editingCourse.lessons?.map((lesson, lIdx) => (
                        <div key={lesson.id} className="bg-brand-main/50 rounded-[2.5rem] border border-white/5 overflow-hidden">
                           <div className="p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all" onClick={() => setExpandedLesson(expandedLesson === lIdx ? null : lIdx)}>
                              <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-white/5 font-black text-sm">{lIdx + 1}</div>
                              <input type="text" value={lesson.title} onChange={e => {const newL = [...editingCourse.lessons!]; newL[lIdx].title = e.target.value; setEditingCourse({...editingCourse, lessons: newL})}} className="bg-transparent text-white font-black text-lg outline-none flex-1" onClick={e => e.stopPropagation()} />
                              <div className="flex items-center gap-3">
                                 <button onClick={(e) => { e.stopPropagation(); const newL = [...editingCourse.lessons!]; newL.splice(lIdx, 1); setEditingCourse({...editingCourse, lessons: newL}); }} className="p-2 text-brand-muted hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                 {expandedLesson === lIdx ? <ChevronUp className="text-brand-gold" /> : <ChevronDown className="text-brand-muted" />}
                              </div>
                           </div>
                           
                           {expandedLesson === lIdx && (
                             <div className="p-8 pt-0 border-t border-white/5 space-y-8 animate-fade-in bg-brand-card/20">
                                {/* Lesson Media Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                   <div className="space-y-2">
                                      <label className="text-[10px] text-brand-gold font-black uppercase tracking-widest px-2">رابط الملف الصوتي (MP3)</label>
                                      <div className="relative group">
                                         <Mic2 className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={16} />
                                         <input type="text" placeholder="https://cloud.com/audio.mp3" value={lesson.contents.find(c => c.type === 'audio')?.url || ''} onChange={e => {
                                            const newL = [...editingCourse.lessons!];
                                            const newC = [...newL[lIdx].contents];
                                            const idx = newC.findIndex(x => x.type === 'audio');
                                            if (idx >= 0) newC[idx].url = e.target.value;
                                            else newC.push({id: 'a'+Date.now(), type: 'audio', title: 'الشرح الصوتي', url: e.target.value});
                                            newL[lIdx].contents = newC;
                                            setEditingCourse({...editingCourse, lessons: newL});
                                         }} className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-xs text-white focus:border-brand-gold outline-none" />
                                      </div>
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] text-brand-gold font-black uppercase tracking-widest px-2">رابط المذكرة (PDF)</label>
                                      <div className="relative group">
                                         <FileText className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={16} />
                                         <input type="text" placeholder="https://cloud.com/notes.pdf" value={lesson.contents.find(c => c.type === 'pdf')?.url || ''} onChange={e => {
                                            const newL = [...editingCourse.lessons!];
                                            const newC = [...newL[lIdx].contents];
                                            const idx = newC.findIndex(x => x.type === 'pdf');
                                            if (idx >= 0) newC[idx].url = e.target.value;
                                            else newC.push({id: 'p'+Date.now(), type: 'pdf', title: 'مذكرة الشرح', url: e.target.value});
                                            newL[lIdx].contents = newC;
                                            setEditingCourse({...editingCourse, lessons: newL});
                                         }} className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-xs text-white focus:border-brand-gold outline-none" />
                                      </div>
                                   </div>
                                </div>

                                {/* Lesson Quiz Editor */}
                                <div className="bg-brand-main/40 p-8 rounded-[2rem] border border-brand-gold/10">
                                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                                      <h5 className="text-white font-black text-lg flex items-center gap-3"><Brain size={24} className="text-brand-gold" /> اختبار المحاضرة</h5>
                                      <div className="flex gap-3">
                                         <button onClick={() => { setTargetIdx(lIdx); setIsBulkOpen(true); }} className="text-[10px] font-black text-brand-gold bg-brand-gold/10 px-5 py-2.5 rounded-xl flex items-center gap-2 border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-main transition-all"><FileJson size={14}/> استيراد الأسئلة</button>
                                         <button onClick={() => addManualQuestion(lIdx)} className="text-[10px] font-black text-brand-gold bg-brand-gold/10 px-5 py-2.5 rounded-xl flex items-center gap-2 border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-main transition-all"><Plus size={14}/> إضافة سؤال يدوي</button>
                                      </div>
                                   </div>

                                   <div className="space-y-10">
                                      {lesson.quiz?.questions.map((q, qIdx) => (
                                        <div key={q.id} className="relative group/q p-8 bg-brand-card/40 border border-white/5 rounded-[2.2rem] space-y-6">
                                           <button 
                                              onClick={() => removeQuestion(lIdx, qIdx)}
                                              className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/q:opacity-100 transition-all hover:scale-110 shadow-lg"
                                           >
                                              <X size={14} />
                                           </button>
                                           
                                           <div className="space-y-3">
                                              <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">نص السؤال {qIdx + 1}</label>
                                              <input 
                                                type="text" 
                                                value={q.text} 
                                                onChange={e => updateQuestionField(lIdx, qIdx, 'text', e.target.value)} 
                                                className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white text-sm font-bold focus:border-brand-gold outline-none" 
                                                placeholder="مثال: ما هو عدد العظام في جسم الإنسان؟"
                                              />
                                           </div>

                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="space-y-2">
                                                   <div className="flex justify-between px-2">
                                                      <label className="text-[9px] text-brand-muted font-black uppercase">اختيار {oIdx + 1}</label>
                                                      <button 
                                                        onClick={() => updateQuestionField(lIdx, qIdx, 'correct', oIdx)}
                                                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md transition-all ${q.correctOptionIndex === oIdx ? 'bg-green-500 text-white shadow-glow-green' : 'bg-white/5 text-brand-muted'}`}
                                                      >
                                                        {q.correctOptionIndex === oIdx ? 'الإجابة الصحيحة' : 'تحديد كصحيحة'}
                                                      </button>
                                                   </div>
                                                   <input 
                                                      type="text" 
                                                      value={opt} 
                                                      onChange={e => updateOptionText(lIdx, qIdx, oIdx, e.target.value)} 
                                                      className={`w-full bg-brand-main border-2 rounded-2xl p-4 text-xs font-bold outline-none transition-all ${q.correctOptionIndex === oIdx ? 'border-green-500/50 focus:border-green-500' : 'border-white/5 focus:border-brand-gold'}`} 
                                                      placeholder={`أدخل الاختيار ${oIdx + 1}...`}
                                                   />
                                                </div>
                                              ))}
                                           </div>
                                        </div>
                                      ))}

                                      {(!lesson.quiz || lesson.quiz.questions.length === 0) && (
                                        <div className="py-12 text-center bg-white/2 rounded-3xl border border-white/5 border-dashed">
                                          <HelpCircle size={40} className="mx-auto text-brand-muted/20 mb-3" />
                                          <p className="text-brand-muted font-bold text-xs">لا يوجد أسئلة مضافة لهذا الدرس حتى الآن.</p>
                                        </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-8 border-t border-white/5 bg-white/5 flex justify-end shadow-2xl">
                <button onClick={handleSave} className="bg-brand-gold text-brand-main font-black px-12 py-5 rounded-2xl shadow-glow flex items-center gap-3 hover:scale-[1.03] active:scale-95 transition-all text-lg"><Save size={24}/> حفظ كافة التعديلات</button>
             </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsBulkOpen(false)}></div>
           <div className="relative w-full max-w-3xl bg-brand-card border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl animate-scale-up overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
              
              <div className="flex justify-between items-center relative z-10">
                 <h3 className="text-2xl font-black text-white flex items-center gap-4"><FileJson className="text-brand-gold" /> استيراد الأسئلة دفعة واحدة</h3>
                 <button onClick={() => setIsBulkOpen(false)} className="text-brand-muted hover:text-white"><X size={24}/></button>
              </div>

              <div className="bg-brand-gold/10 border border-brand-gold/20 p-6 rounded-2xl relative z-10">
                 <h5 className="text-brand-gold font-black text-xs uppercase tracking-widest mb-3">الصيغة المطلوبة (هام جداً):</h5>
                 <p className="text-brand-text/80 text-[11px] font-bold leading-relaxed">
                   أدخل كل سؤال في سطر منفصل، وافصل بين العناصر بعلامة الـ <span className="bg-brand-gold text-brand-main px-1.5 py-0.5 rounded mx-1">|</span> كالتالي: <br/>
                   <span className="text-white block mt-2 font-mono bg-brand-main p-3 rounded-lg border border-white/10 overflow-x-auto whitespace-nowrap">
                     نص السؤال | الاختيار الأول | الاختيار الثاني | الاختيار الثالث | الاختيار الرابع | رقم الإجابة الصحيحة (0-3)
                   </span>
                 </p>
              </div>

              <textarea 
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder="مثال:&#10;كم عدد فقرات العمود الفقري؟ | 33 | 24 | 30 | 25 | 0&#10;أين يوجد عظم العضد؟ | الساق | الذراع | الحوض | الرقبة | 1"
                className="w-full h-80 bg-brand-main/50 border border-white/10 rounded-[2rem] p-8 text-white text-xs font-mono outline-none focus:border-brand-gold resize-none shadow-inner relative z-10"
              ></textarea>

              <div className="flex gap-4 relative z-10">
                 <button onClick={handleBulkImport} className="flex-1 bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all text-lg">بدء الاستيراد للدرس</button>
                 <button onClick={() => setIsBulkOpen(false)} className="flex-1 bg-white/5 text-white font-black py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg">إلغاء</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
