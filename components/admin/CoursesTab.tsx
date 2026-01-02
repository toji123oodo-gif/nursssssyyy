
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, Question, Quiz } from '../../types';
import { PlusCircle, Edit, Trash, Layers, Video, FileDown, Plus, X, FileText, Upload, Info, Save, ChevronDown, ChevronUp, GripVertical, PlayCircle, BookOpen, Brain, CheckCircle2 } from 'lucide-react';

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
    if (editingCourse.id) await updateCourse(editingCourse as Course);
    else await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course);
    setIsModalOpen(false);
  };

  const handleBulkImport = () => {
    if (targetIdx === null || !bulkText.trim()) return;
    const lines = bulkText.split('\n').filter(l => l.trim() !== '');
    const newQs: Question[] = lines.map(line => {
      const p = line.split('|').map(x => x.trim());
      return p.length >= 6 ? {
        id: 'qn' + Math.random().toString(36).substring(2, 9),
        text: p[0], options: [p[1], p[2], p[3], p[4]], correctOptionIndex: parseInt(p[5]) || 0
      } : null;
    }).filter(x => x !== null) as Question[];

    const newL = [...(editingCourse?.lessons || [])];
    if (!newL[targetIdx].quiz) newL[targetIdx].quiz = { id: 'q' + Date.now(), title: 'اختبار', questions: [] };
    newL[targetIdx].quiz!.questions = [...newL[targetIdx].quiz!.questions, ...newQs];
    setEditingCourse({ ...editingCourse, lessons: newL });
    setIsBulkOpen(false);
    setBulkText('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-white">إدارة المناهج الأكاديمية</h2>
         <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'}); setIsModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-10 py-5 rounded-[1.8rem] flex items-center gap-3 shadow-glow transition-all hover:scale-105 active:scale-95"><PlusCircle size={24}/> كورس جديد</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col h-full shadow-xl">
            <div className="h-56 relative overflow-hidden">
              <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-4 left-4 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-xl border border-brand-gold/20 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                 {course.subject}
              </div>
              <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <button onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit size={20}/></button>
                <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash size={20}/></button>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h4 className="text-white font-black text-2xl mb-4 leading-tight group-hover:text-brand-gold transition-colors">{course.title}</h4>
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-brand-muted text-[10px] font-black uppercase tracking-widest">
                   <Layers size={14} className="text-brand-gold" /> {course.lessons?.length || 0} محاضرة
                 </div>
                 <span className="text-xl font-black text-white">{course.price} <span className="text-[10px]">ج.م</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/98 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-6xl bg-brand-card border border-white/10 rounded-[4rem] shadow-2xl h-[95vh] flex flex-col overflow-hidden animate-scale-up">
             
             {/* Modal Header */}
             <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
               <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">محرر المنهج الدراسي</h3>
                  <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">تنسيق وتنظيم محاضرات الكورس</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/5 text-brand-muted hover:text-white p-4 rounded-2xl transition-all border border-transparent hover:border-white/10"><X size={32}/></button>
             </div>

             {/* Modal Content */}
             <div className="p-10 overflow-y-auto flex-1 space-y-12 no-scrollbar">
                
                {/* Basic Info Section */}
                <section className="bg-brand-main/30 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2 tracking-widest">اسم الكورس</label>
                      <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold focus:border-brand-gold outline-none shadow-inner" placeholder="مثلاً: علم التشريح" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2 tracking-widest">التخصص / القسم</label>
                      <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold focus:border-brand-gold outline-none shadow-inner" placeholder="Anatomy" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2 tracking-widest">سعر البيع (ج.م)</label>
                      <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold focus:border-brand-gold outline-none shadow-inner" />
                    </div>
                  </div>
                </section>
                
                {/* Lessons Builder */}
                <section className="space-y-8">
                  <div className="flex justify-between items-center px-4">
                     <h4 className="text-2xl font-black text-white flex items-center gap-4"><BookOpen className="text-brand-gold" size={28} /> هيكل المحاضرات</h4>
                     <button onClick={() => {
                        const newL = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
                        setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newL] }));
                        setExpandedLesson((editingCourse.lessons?.length || 0));
                     }} className="bg-brand-gold/10 text-brand-gold px-6 py-3 rounded-2xl text-[10px] font-black uppercase border border-brand-gold/20 flex items-center gap-2 hover:bg-brand-gold hover:text-brand-main transition-all"><Plus size={16}/> إضافة محاضرة</button>
                  </div>

                  <div className="space-y-6">
                    {editingCourse.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className={`bg-brand-main/50 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedLesson === lIdx ? 'border-brand-gold/30 shadow-2xl scale-[1.01]' : 'border-white/5 hover:border-white/20'}`}>
                        {/* Lesson Header */}
                        <div className="p-8 flex items-center gap-6 cursor-pointer" onClick={() => setExpandedLesson(expandedLesson === lIdx ? null : lIdx)}>
                           <div className="w-12 h-12 rounded-2xl bg-brand-card flex items-center justify-center text-brand-gold shadow-inner shrink-0"><GripVertical size={20} /></div>
                           <div className="flex-1">
                              <input 
                                onClick={(e) => e.stopPropagation()}
                                type="text" 
                                value={lesson.title} 
                                onChange={e => {
                                  const newL = [...(editingCourse.lessons || [])];
                                  newL[lIdx].title = e.target.value;
                                  setEditingCourse({...editingCourse, lessons: newL});
                                }} 
                                className="bg-transparent text-white font-black text-2xl border-b border-transparent w-full pb-1 outline-none focus:border-brand-gold transition-all" 
                              />
                              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">المحاضرة {lIdx + 1} • {lesson.contents.length} ملفات</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <button onClick={(e) => {
                                e.stopPropagation();
                                const newL = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                                setEditingCourse({...editingCourse, lessons: newL});
                              }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash size={18} /></button>
                              <div className="p-2 text-brand-muted">{expandedLesson === lIdx ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}</div>
                           </div>
                        </div>

                        {/* Lesson Content Body */}
                        {expandedLesson === lIdx && (
                          <div className="p-10 pt-0 border-t border-white/5 space-y-10 animate-fade-in bg-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                               {/* Video Config */}
                               <div className="space-y-4">
                                  <label className="text-[10px] text-brand-gold font-black uppercase tracking-widest flex items-center gap-2"><Video size={14}/> رابط فيديو YouTube</label>
                                  <input 
                                    type="text" 
                                    placeholder="https://www.youtube.com/embed/..." 
                                    value={lesson.contents.find(c => c.type === 'video')?.url || ''} 
                                    onChange={e => {
                                      const newL = [...(editingCourse.lessons || [])];
                                      const vIdx = newL[lIdx].contents.findIndex(c => c.type === 'video');
                                      if (vIdx >= 0) newL[lIdx].contents[vIdx].url = e.target.value;
                                      else newL[lIdx].contents.push({id: 'v'+Date.now(), type: 'video', title: 'فيديو الشرح', url: e.target.value});
                                      setEditingCourse({...editingCourse, lessons: newL});
                                    }} 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-gold" 
                                  />
                               </div>
                               {/* PDF Config */}
                               <div className="space-y-4">
                                  <label className="text-[10px] text-brand-gold font-black uppercase tracking-widest flex items-center gap-2"><FileDown size={14}/> رابط مذكرة الـ PDF</label>
                                  <input 
                                    type="text" 
                                    placeholder="https://..." 
                                    value={lesson.contents.find(c => c.type === 'pdf')?.url || ''} 
                                    onChange={e => {
                                      const newL = [...(editingCourse.lessons || [])];
                                      const pIdx = newL[lIdx].contents.findIndex(c => c.type === 'pdf');
                                      if (pIdx >= 0) newL[lIdx].contents[pIdx].url = e.target.value;
                                      else newL[lIdx].contents.push({id: 'pdf'+Date.now(), type: 'pdf', title: 'الملخص PDF', url: e.target.value});
                                      setEditingCourse({...editingCourse, lessons: newL});
                                    }} 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-gold" 
                                  />
                               </div>
                            </div>

                            {/* Quiz Builder Section */}
                            <div className="bg-brand-card/80 p-10 rounded-[2.5rem] border border-brand-gold/10 space-y-8 shadow-inner">
                               <div className="flex justify-between items-center">
                                  <div>
                                     <h5 className="text-white font-black text-xl flex items-center gap-4"><Brain className="text-brand-gold" size={24} /> بنك أسئلة المحاضرة</h5>
                                     <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest mt-1">يوجد {lesson.quiz?.questions.length || 0} سؤال حالياً</p>
                                  </div>
                                  <div className="flex gap-4">
                                     <button onClick={() => {setTargetIdx(lIdx); setIsBulkOpen(true);}} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all"><FileText size={16}/> استيراد Notepad</button>
                                     <button onClick={() => {
                                        const newL = [...(editingCourse.lessons || [])];
                                        if (!newL[lIdx].quiz) newL[lIdx].quiz = { id: 'q'+Date.now(), title: 'اختبار', questions: [] };
                                        newL[lIdx].quiz!.questions.push({id: 'qn'+Date.now(), text: 'أدخل السؤال هنا؟', options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'], correctOptionIndex: 0});
                                        setEditingCourse({...editingCourse, lessons: newL});
                                     }} className="bg-brand-gold text-brand-main px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 shadow-glow transition-all hover:scale-105"><Plus size={16}/> إضافة سؤال</button>
                                  </div>
                               </div>

                               {lesson.quiz?.questions.length === 0 && (
                                 <div className="text-center py-10 border border-dashed border-white/5 rounded-[2rem]">
                                    <Brain size={40} className="mx-auto text-white opacity-5 mb-4" />
                                    <p className="text-xs text-brand-muted font-bold">لا توجد أسئلة مضافة بعد</p>
                                 </div>
                               )}

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {lesson.quiz?.questions.map((q, qIdx) => (
                                   <div key={q.id} className="bg-brand-main/40 p-6 rounded-3xl border border-white/5 space-y-6 group/qn">
                                      <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-main flex items-center justify-center font-black text-xs shrink-0">{qIdx + 1}</div>
                                        <input type="text" value={q.text} onChange={e => {
                                           const newL = [...(editingCourse.lessons || [])];
                                           newL[lIdx].quiz!.questions[qIdx].text = e.target.value;
                                           setEditingCourse({...editingCourse, lessons: newL});
                                        }} className="bg-transparent border-b border-white/10 text-white font-bold w-full pb-1 outline-none focus:border-brand-gold" />
                                        <button onClick={() => {
                                           const newL = [...(editingCourse.lessons || [])];
                                           newL[lIdx].quiz!.questions = newL[lIdx].quiz!.questions.filter((_, i) => i !== qIdx);
                                           setEditingCourse({...editingCourse, lessons: newL});
                                        }} className="text-red-500/30 hover:text-red-500 transition-colors"><Trash size={16}/></button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        {q.options.map((opt, oIdx) => (
                                          <div key={oIdx} className="flex items-center gap-2 group/opt">
                                            <button 
                                              onClick={() => {
                                                const newL = [...(editingCourse.lessons || [])];
                                                newL[lIdx].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                setEditingCourse({...editingCourse, lessons: newL});
                                              }}
                                              className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${q.correctOptionIndex === oIdx ? 'bg-brand-gold border-brand-gold shadow-glow' : 'border-white/20 hover:border-white/50'}`}
                                            ></button>
                                            <input type="text" value={opt} onChange={e => {
                                               const newL = [...(editingCourse.lessons || [])];
                                               newL[lIdx].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                               setEditingCourse({...editingCourse, lessons: newL});
                                            }} className={`w-full bg-brand-main/50 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:border-brand-gold outline-none ${q.correctOptionIndex === oIdx ? 'text-brand-gold font-bold' : ''}`} />
                                          </div>
                                        ))}
                                      </div>
                                   </div>
                                 ))}
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
             </div>

             {/* Modal Footer */}
             <div className="p-10 border-t border-white/5 bg-brand-main/50 flex justify-end items-center gap-8">
                <div className="flex items-center gap-3 text-brand-muted text-[10px] font-black uppercase tracking-widest mr-auto">
                   <Info size={16} className="text-brand-gold" /> يتم الحفظ تلقائياً في السحاب
                </div>
                <button onClick={handleSave} className="bg-brand-gold text-brand-main font-black px-16 py-6 rounded-[2rem] shadow-glow text-xl flex items-center gap-4 transition-all hover:scale-[1.03] active:scale-95"><Save size={28}/> حفظ التغييرات النهائية</button>
             </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-3xl" onClick={() => setIsBulkOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl animate-scale-up space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-black text-white flex items-center gap-4"><Upload className="text-brand-gold"/> استيراد جماعي للأسئلة</h3>
                 <button onClick={() => setIsBulkOpen(false)} className="text-brand-muted hover:text-white p-2"><X size={32}/></button>
              </div>
              <div className="bg-brand-gold/5 border border-brand-gold/10 p-6 rounded-2xl flex items-start gap-4">
                 <Info size={24} className="text-brand-gold shrink-0 mt-1" />
                 <div className="space-y-1">
                    <p className="text-brand-gold text-xs font-black">طريقة التنسيق المطلوبة:</p>
                    <p className="text-brand-muted text-[11px] font-bold leading-relaxed">السؤال هنا؟ | خيار 1 | خيار 2 | خيار 3 | خيار 4 | رقم الإجابة الصحيحة (0، 1، 2، أو 3)</p>
                    <p className="text-brand-muted text-[9px] font-mono mt-2 italic">مثال: ما هو علم التشريح؟ | Anatomy | Biology | Physics | Math | 0</p>
                 </div>
              </div>
              <textarea 
                value={bulkText} 
                onChange={(e) => setBulkText(e.target.value)} 
                className="w-full h-80 bg-brand-main border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-brand-gold shadow-inner resize-none no-scrollbar" 
                placeholder="الصق قائمة الأسئلة هنا من ملف Notepad..." 
              />
              <div className="flex gap-4">
                <button onClick={handleBulkImport} className="flex-1 bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow text-xl flex items-center justify-center gap-3"><CheckCircle2 size={24}/> استيراد الآن</button>
                <button onClick={() => setIsBulkOpen(false)} className="px-10 bg-white/5 text-white font-black py-6 rounded-[1.8rem] border border-white/10">إلغاء</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
