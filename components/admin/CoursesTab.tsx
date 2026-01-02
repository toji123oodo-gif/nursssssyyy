
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, Question, Quiz } from '../../types';
import { PlusCircle, Edit, Trash, Layers, Video, FileDown, Plus, X, FileText, Upload, Info, Save, ChevronDown, ChevronUp, GripVertical, BookOpen, Brain, CheckCircle2 } from 'lucide-react';

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
        // نرسل الكائن بالكامل للتأكد من استبدال المصفوفات القديمة بالجديدة في Firestore
        await updateCourse(editingCourse as Course);
      } else {
        await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course);
      }
      setIsModalOpen(false);
      alert('تم حفظ التعديلات بنجاح وستظهر للطلاب فوراً');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    }
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

    const newLessons = [...(editingCourse?.lessons || [])];
    const currentLesson = { ...newLessons[targetIdx] };
    
    if (!currentLesson.quiz) {
      currentLesson.quiz = { id: 'q' + Date.now(), title: 'اختبار', questions: [] };
    }
    
    currentLesson.quiz = {
      ...currentLesson.quiz,
      questions: [...currentLesson.quiz.questions, ...newQs]
    };
    
    newLessons[targetIdx] = currentLesson;
    setEditingCourse({ ...editingCourse, lessons: newLessons });
    setIsBulkOpen(false);
    setBulkText('');
  };

  const addManualQuestion = (lessonIdx: number) => {
    const newLessons = [...(editingCourse?.lessons || [])];
    const currentLesson = { ...newLessons[lessonIdx] };
    
    if (!currentLesson.quiz) {
      currentLesson.quiz = { id: 'q' + Date.now(), title: 'اختبار', questions: [] };
    }

    const newQuestion: Question = {
      id: 'qn' + Date.now(),
      text: 'سؤال جديد؟',
      options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
      correctOptionIndex: 0
    };

    currentLesson.quiz = {
      ...currentLesson.quiz,
      questions: [...currentLesson.quiz.questions, newQuestion]
    };

    newLessons[lessonIdx] = currentLesson;
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  const updateQuestion = (lessonIdx: number, qIdx: number, updates: Partial<Question>) => {
    const newLessons = [...(editingCourse?.lessons || [])];
    const currentLesson = { ...newLessons[lessonIdx] };
    if (!currentLesson.quiz) return;

    const newQuestions = [...currentLesson.quiz.questions];
    newQuestions[qIdx] = { ...newQuestions[qIdx], ...updates };
    
    currentLesson.quiz = { ...currentLesson.quiz, questions: newQuestions };
    newLessons[lessonIdx] = currentLesson;
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  const deleteQuestion = (lessonIdx: number, qIdx: number) => {
    const newLessons = [...(editingCourse?.lessons || [])];
    const currentLesson = { ...newLessons[lessonIdx] };
    if (!currentLesson.quiz) return;

    const newQuestions = currentLesson.quiz.questions.filter((_, i) => i !== qIdx);
    currentLesson.quiz = { ...currentLesson.quiz, questions: newQuestions };
    newLessons[lessonIdx] = currentLesson;
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-white">إدارة المناهج الأكاديمية</h2>
         <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'}); setIsModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-10 py-5 rounded-[1.8rem] flex items-center gap-3 shadow-glow transition-all hover:scale-105"><PlusCircle size={24}/> كورس جديد</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col h-full shadow-xl">
            <div className="h-56 relative overflow-hidden">
              <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
              <div className="absolute bottom-6 right-6 flex gap-3">
                <button onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl"><Edit size={20}/></button>
                <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl"><Trash size={20}/></button>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h4 className="text-white font-black text-2xl mb-4 leading-tight">{course.title}</h4>
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-brand-muted text-[10px] font-black uppercase tracking-widest">
                   <Layers size={14} className="text-brand-gold" /> {course.lessons?.length || 0} محاضرة
                 </div>
                 <span className="text-xl font-black text-white">{course.price} ج.م</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/98 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-6xl bg-brand-card border border-white/10 rounded-[4rem] shadow-2xl h-[95vh] flex flex-col overflow-hidden animate-scale-up">
             
             <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-3xl font-black text-white tracking-tighter">محرر المنهج الدراسي</h3>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/5 text-brand-muted hover:text-white p-4 rounded-2xl transition-all"><X size={32}/></button>
             </div>

             <div className="p-10 overflow-y-auto flex-1 space-y-12 no-scrollbar">
                <section className="bg-brand-main/30 p-10 rounded-[3rem] border border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-brand-gold" placeholder="اسم الكورس" />
                    <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-brand-gold" placeholder="التخصص" />
                    <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-brand-gold" placeholder="السعر" />
                  </div>
                </section>
                
                <section className="space-y-8">
                  <div className="flex justify-between items-center px-4">
                     <h4 className="text-2xl font-black text-white flex items-center gap-4"><BookOpen className="text-brand-gold" size={28} /> هيكل المحاضرات</h4>
                     <button onClick={() => {
                        const newL = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
                        setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newL] }));
                        setExpandedLesson((editingCourse.lessons?.length || 0));
                     }} className="bg-brand-gold text-brand-main px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2"><Plus size={16}/> إضافة محاضرة</button>
                  </div>

                  <div className="space-y-6">
                    {editingCourse.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className={`bg-brand-main/50 rounded-[2.5rem] border overflow-hidden ${expandedLesson === lIdx ? 'border-brand-gold/30' : 'border-white/5'}`}>
                        <div className="p-8 flex items-center gap-6 cursor-pointer" onClick={() => setExpandedLesson(expandedLesson === lIdx ? null : lIdx)}>
                           <GripVertical size={20} className="text-brand-muted" />
                           <div className="flex-1">
                              <input 
                                onClick={(e) => e.stopPropagation()}
                                type="text" 
                                value={lesson.title} 
                                onChange={e => {
                                  const newL = [...(editingCourse.lessons || [])];
                                  newL[lIdx] = { ...newL[lIdx], title: e.target.value };
                                  setEditingCourse({...editingCourse, lessons: newL});
                                }} 
                                className="bg-transparent text-white font-black text-2xl border-b border-transparent w-full outline-none focus:border-brand-gold" 
                              />
                           </div>
                           {expandedLesson === lIdx ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                        </div>

                        {expandedLesson === lIdx && (
                          <div className="p-10 pt-0 border-t border-white/5 space-y-10 animate-fade-in bg-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                               <input 
                                    type="text" 
                                    placeholder="رابط فيديو YouTube" 
                                    value={lesson.contents.find(c => c.type === 'video')?.url || ''} 
                                    onChange={e => {
                                      const newL = [...(editingCourse.lessons || [])];
                                      const newContents = [...newL[lIdx].contents];
                                      const vIdx = newContents.findIndex(c => c.type === 'video');
                                      if (vIdx >= 0) newContents[vIdx] = { ...newContents[vIdx], url: e.target.value };
                                      else newContents.push({id: 'v'+Date.now(), type: 'video', title: 'فيديو الشرح', url: e.target.value});
                                      newL[lIdx] = { ...newL[lIdx], contents: newContents };
                                      setEditingCourse({...editingCourse, lessons: newL});
                                    }} 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-xs text-white" 
                               />
                               <input 
                                    type="text" 
                                    placeholder="رابط ملف PDF" 
                                    value={lesson.contents.find(c => c.type === 'pdf')?.url || ''} 
                                    onChange={e => {
                                      const newL = [...(editingCourse.lessons || [])];
                                      const newContents = [...newL[lIdx].contents];
                                      const pIdx = newContents.findIndex(c => c.type === 'pdf');
                                      if (pIdx >= 0) newContents[pIdx] = { ...newContents[pIdx], url: e.target.value };
                                      else newContents.push({id: 'pdf'+Date.now(), type: 'pdf', title: 'الملخص PDF', url: e.target.value});
                                      newL[lIdx] = { ...newL[lIdx], contents: newContents };
                                      setEditingCourse({...editingCourse, lessons: newL});
                                    }} 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-xs text-white" 
                               />
                            </div>

                            <div className="bg-brand-card/80 p-10 rounded-[2.5rem] border border-brand-gold/10 space-y-8 shadow-inner">
                               <div className="flex justify-between items-center">
                                  <h5 className="text-white font-black text-xl flex items-center gap-4"><Brain className="text-brand-gold" size={24} /> بنك أسئلة المحاضرة</h5>
                                  <div className="flex gap-4">
                                     <button onClick={() => {setTargetIdx(lIdx); setIsBulkOpen(true);}} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black border border-white/10 flex items-center gap-3"><FileText size={16}/> استيراد Notepad</button>
                                     <button onClick={() => addManualQuestion(lIdx)} className="bg-brand-gold text-brand-main px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3"><Plus size={16}/> إضافة سؤال يدوياً</button>
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 gap-6">
                                 {lesson.quiz?.questions.map((q, qIdx) => (
                                   <div key={q.id} className="bg-brand-main/40 p-6 rounded-3xl border border-white/5 space-y-6">
                                      <div className="flex gap-4 items-center">
                                        <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-main flex items-center justify-center font-black text-xs shrink-0">{qIdx + 1}</div>
                                        <input type="text" value={q.text} onChange={e => updateQuestion(lIdx, qIdx, { text: e.target.value })} className="bg-transparent border-b border-white/10 text-white font-bold w-full pb-1 outline-none focus:border-brand-gold" />
                                        <button onClick={() => deleteQuestion(lIdx, qIdx)} className="text-red-500 hover:scale-110 transition-transform"><Trash size={18}/></button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIdx) => (
                                          <div key={oIdx} className="flex items-center gap-3">
                                            <button 
                                              onClick={() => updateQuestion(lIdx, qIdx, { correctOptionIndex: oIdx })}
                                              className={`w-4 h-4 rounded-full border-2 shrink-0 ${q.correctOptionIndex === oIdx ? 'bg-brand-gold border-brand-gold' : 'border-white/20'}`}
                                            ></button>
                                            <input type="text" value={opt} onChange={e => {
                                               const newOpts = [...q.options];
                                               newOpts[oIdx] = e.target.value;
                                               updateQuestion(lIdx, qIdx, { options: newOpts });
                                            }} className="w-full bg-brand-main/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold" />
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
             <div className="p-8 border-t border-white/5 bg-brand-main/50 flex justify-end">
                <button onClick={handleSave} className="bg-brand-gold text-brand-main font-black px-16 py-6 rounded-[2rem] shadow-glow text-xl flex items-center gap-4 transition-all hover:scale-[1.03]"><Save size={28}/> حفظ الكورس بالكامل</button>
             </div>
          </div>
        </div>
      )}

      {isBulkOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-3xl" onClick={() => setIsBulkOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-brand-card border border-white/10 rounded-[3.5rem] p-14 shadow-2xl animate-scale-up space-y-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-4"><Upload className="text-brand-gold"/> استيراد جماعي من Notepad</h3>
              <textarea 
                value={bulkText} 
                onChange={(e) => setBulkText(e.target.value)} 
                className="w-full h-80 bg-brand-main border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-brand-gold shadow-inner resize-none" 
                placeholder="السؤال | خيار 1 | خيار 2 | خيار 3 | خيار 4 | رقم الإجابة الصحيحة (0-3)" 
              />
              <div className="flex gap-4">
                <button onClick={handleBulkImport} className="flex-1 bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow text-xl">استيراد الآن</button>
                <button onClick={() => setIsBulkOpen(false)} className="px-10 bg-white/5 text-white font-black py-6 rounded-[1.8rem] border border-white/10">إلغاء</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
