
import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Play, Star, Clock, CheckCircle, FileText, MonitorPlay, Brain, X, ChevronLeft, List, FileDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentItem, Course, Lesson } from '../types';
import { QuizPlayer } from '../components/QuizPlayer';

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({ top: Math.random() * 80 + 10, left: Math.random() * 80 + 10 });
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute pointer-events-none z-50 text-white/5 md:text-white/10 font-black select-none transition-all duration-1000 text-[10px] md:text-base" style={{ top: `${position.top}%`, left: `${position.left}%`, transform: 'rotate(-15deg)' }}>
      NURSY - {userPhone}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, courses, updateUserData } = useApp();
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'quiz'>('content');

  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id);
      setActiveLessonId(courses[0].lessons[0]?.id || null);
    }
  }, [courses, activeCourseId]);

  // Derived state: نحصل على البيانات الحديثة دائماً بناءً على الـ ID
  const activeCourse = useMemo(() => courses.find(c => c.id === activeCourseId) || courses[0], [courses, activeCourseId]);
  const activeLesson = useMemo(() => {
    if (!activeCourse) return null;
    return activeCourse.lessons.find(l => l.id === activeLessonId) || activeCourse.lessons[0];
  }, [activeCourse, activeLessonId]);
  
  const activeContent = useMemo(() => {
    if (!activeLesson) return null;
    return activeLesson.contents.find(c => c.type === 'video') || activeLesson.contents[0] || null;
  }, [activeLesson]);

  useEffect(() => {
    if (window.innerWidth < 1024) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setActiveTab('content');
  }, [activeLessonId]);

  if (!user || !activeCourse || !activeLesson) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div>
    </div>
  );

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  const isLessonCompleted = (lessonId: string) => user?.completedLessons?.includes(lessonId);

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return;
    const currentCompleted = user.completedLessons || [];
    const updatedCompleted = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];
    await updateUserData({ completedLessons: updatedCompleted });
  };

  const handleQuizComplete = async (score: number) => {
    if (!user) return;
    const currentGrades = user.quizGrades || {};
    await updateUserData({ quizGrades: { ...currentGrades, [activeLesson.id]: score } });
  };

  return (
    <div className="min-h-screen px-0 md:px-8 py-0 md:py-8 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 md:gap-8">
        <div className="flex-1 space-y-4 md:space-y-6">
            
            <div className="relative aspect-video bg-black md:rounded-[2.5rem] overflow-hidden shadow-2xl border-b md:border border-white/10 group ring-4 ring-black">
                {activeTab === 'quiz' && activeLesson.quiz ? (
                  <div className="absolute inset-0 bg-brand-main z-20 overflow-y-auto no-scrollbar">
                    <QuizPlayer 
                      quiz={activeLesson.quiz} 
                      onComplete={handleQuizComplete} 
                      onClose={() => setActiveTab('content')} 
                    />
                  </div>
                ) : (
                  <>
                    {activeContent?.type === 'video' ? (
                      <iframe className="w-full h-full" src={`${activeContent.url}?modestbranding=1&rel=0`} title={activeContent.title} frameBorder="0" allowFullScreen></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted italic">لا يوجد محتوى فيديو متاح حالياً</div>
                    )}
                    <Watermark userPhone={user.phone || user.email} />
                  </>
                )}
            </div>

            <div className="px-6 md:px-0 space-y-4">
                <div className="bg-brand-card/30 md:bg-brand-card/50 border border-white/5 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full">
                        <div className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase mb-2">
                            <MonitorPlay size={14} /> {activeCourse.title}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{activeLesson.title}</h2>
                    </div>
                    <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5 w-full md:w-auto shadow-inner overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('content')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>الدرس</button>
                        <button onClick={() => setActiveTab('resources')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>الملفات</button>
                        {activeLesson.quiz && (
                          <button onClick={() => setActiveTab('quiz')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 animate-bounce-slow ${activeTab === 'quiz' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>
                            <Brain size={14} /> الاختبار
                          </button>
                        )}
                    </div>
                </div>

                {activeTab === 'resources' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').map(item => (
                          <div key={item.id} className="bg-brand-card/50 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                  <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold"><FileText size={24} /></div>
                                  <div><h4 className="text-white font-black text-sm">{item.title}</h4></div>
                              </div>
                              <button onClick={() => user.subscriptionTier === 'pro' && window.open(item.url)} className={`p-4 rounded-2xl ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main' : 'bg-white/5 text-brand-muted'}`}>
                                  {user.subscriptionTier === 'pro' ? <FileDown size={22} /> : <Lock size={22} />}
                              </button>
                          </div>
                      ))}
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').length === 0 && (
                        <p className="col-span-full text-center py-10 text-brand-muted font-bold italic">لا توجد ملفات مرفقة لهذا الدرس</p>
                      )}
                  </div>
                )}

                <div className="bg-brand-card/50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className={`p-4 rounded-2xl shrink-0 shadow-lg ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/20 text-green-500' : 'bg-brand-gold/20 text-brand-gold'}`}>
                            {isLessonCompleted(activeLesson.id) ? <CheckCircle size={28} /> : <Star size={28} />}
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg leading-tight">حالة الدرس</h4>
                            {user.quizGrades?.[activeLesson.id] !== undefined && (
                              <p className="text-brand-gold text-[10px] font-black uppercase mt-1">درجة الاختبار: {user.quizGrades[activeLesson.id]}%</p>
                            )}
                        </div>
                    </div>
                    <button onClick={() => toggleLessonCompletion(activeLesson.id)} className={`w-full md:w-auto px-10 py-4.5 rounded-[1.5rem] font-black text-sm md:text-base transition-all ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-gold text-brand-main shadow-glow'}`}>
                        {isLessonCompleted(activeLesson.id) ? 'إلغاء المكتمل' : 'تمييز كمكتمل'}
                    </button>
                </div>
            </div>
        </div>

        <div className="hidden lg:block w-96 shrink-0">
            <div className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden sticky top-28 shadow-2xl">
                <div className="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white text-xl font-black flex items-center gap-3"><List size={22} className="text-brand-gold" /> قائمة المحاضرات</h3>
                </div>
                <div className="max-h-[65vh] overflow-y-auto no-scrollbar py-2">
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const active = activeLessonId === lesson.id;
                        const completed = isLessonCompleted(lesson.id);
                        return (
                            <button key={lesson.id} onClick={() => accessible && setActiveLessonId(lesson.id)} className={`w-full flex items-center gap-5 p-6 border-b border-white/5 last:border-0 transition-all text-right ${active ? 'bg-brand-gold/10' : 'hover:bg-white/5'} ${!accessible ? 'opacity-40' : ''}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-lg ${active ? 'bg-brand-gold text-brand-main' : completed ? 'bg-green-500/20 text-green-500' : 'bg-brand-main text-brand-muted'}`}>
                                    {accessible ? completed ? <CheckCircle size={22} /> : (idx + 1) : <Lock size={20} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm md:text-base font-black ${active ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                                    {lesson.quiz && <div className="flex items-center gap-1 mt-1 text-[8px] text-brand-gold font-bold uppercase"><Brain size={10} /> اختبار متاح</div>}
                                </div>
                                {active && <ChevronLeft size={20} className="text-brand-gold" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
