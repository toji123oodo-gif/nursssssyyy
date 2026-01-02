
import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Play, Star, Clock, CheckCircle, FileText, MonitorPlay, Brain, X, ChevronLeft, List, FileDown, Layers, ChevronRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id);
      setActiveLessonId(courses[0].lessons[0]?.id || null);
    }
  }, [courses, activeCourseId]);

  const activeCourse = useMemo(() => courses.find(c => c.id === activeCourseId) || courses[0], [courses, activeCourseId]);
  const activeLesson = useMemo(() => {
    if (!activeCourse) return null;
    return activeCourse.lessons.find(l => l.id === activeLessonId) || activeCourse.lessons[0];
  }, [activeCourse, activeLessonId]);
  
  const activeContent = useMemo(() => {
    if (!activeLesson) return null;
    return activeLesson.contents.find(c => c.type === 'video') || activeLesson.contents[0] || null;
  }, [activeLesson]);

  if (!user || !activeCourse || !activeLesson) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-main">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
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
    <div className="min-h-screen bg-brand-main py-6 md:py-10 px-4 md:px-6">
      {/* Quiz Full Screen Overlay */}
      {isQuizActive && activeLesson.quiz && (
        <QuizPlayer 
          quiz={activeLesson.quiz} 
          onComplete={handleQuizComplete} 
          onClose={() => setIsQuizActive(false)} 
        />
      )}

      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8 md:gap-10">
        
        {/* Main Area: Player & Tabs */}
        <div className="flex-1 space-y-6 md:space-y-8">
            <div className="bg-brand-card rounded-[2rem] md:rounded-[3.5rem] border border-white/5 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative group">
                <div className="aspect-video bg-black relative">
                   {activeContent?.type === 'video' ? (
                      <iframe className="w-full h-full" src={`${activeContent.url}?modestbranding=1&rel=0&autoplay=0`} title={activeContent.title} frameBorder="0" allowFullScreen></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted gap-4">
                         <MonitorPlay size={64} className="opacity-20" />
                         <p className="font-bold italic">المحتوى المرئي غير متاح لهذه المحاضرة</p>
                      </div>
                    )}
                    <Watermark userPhone={user.phone || user.email} />
                </div>
                
                {/* Lesson Info Header */}
                <div className="p-6 md:p-10 bg-gradient-to-b from-brand-card to-brand-main/50 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                    <div className="text-center md:text-right w-full">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 md:mb-3">
                            <Layers size={14} /> {activeCourse.title}
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">{activeLesson.title}</h2>
                    </div>
                    
                    <div className="flex bg-brand-main/80 p-1 rounded-2xl md:rounded-3xl border border-white/5 shadow-inner w-full md:w-auto">
                        <button onClick={() => setActiveTab('content')} className={`flex-1 md:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all ${activeTab === 'content' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>المحاضرة</button>
                        <button onClick={() => setActiveTab('resources')} className={`flex-1 md:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>المصادر</button>
                    </div>
                </div>
            </div>

            {/* Tab Contents */}
            <div className="animate-fade-in-up">
                {activeTab === 'resources' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').map(item => (
                          <div key={item.id} className="premium-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group">
                              <div className="flex items-center gap-4 md:gap-5">
                                  <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold shadow-inner shrink-0"><FileText size={24} className="md:size-[28px]" /></div>
                                  <div>
                                      <h4 className="text-white font-black text-sm md:text-lg line-clamp-1">{item.title}</h4>
                                      <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest mt-1">ملف دراسي PDF</p>
                                  </div>
                              </div>
                              <button onClick={() => user.subscriptionTier === 'pro' && window.open(item.url)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-white/5 text-brand-muted'}`}>
                                  {user.subscriptionTier === 'pro' ? <FileDown size={22} className="md:size-[24px]" /> : <Lock size={18} className="md:size-[20px]" />}
                              </button>
                          </div>
                      ))}
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').length === 0 && (
                        <div className="col-span-full py-10 text-center text-brand-muted italic font-bold">لا توجد ملفات مرفقة للتحميل</div>
                      )}
                  </div>
                )}
                
                {activeTab === 'content' && (
                  <div className="space-y-6 md:space-y-8">
                      {/* Check Progress & Start Quiz Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="premium-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 group hover:border-brand-gold/40">
                              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/20 text-green-500 rotate-6' : 'bg-brand-gold/20 text-brand-gold -rotate-6'}`}>
                                  {isLessonCompleted(activeLesson.id) ? <CheckCircle size={40} className="md:size-[44px]" /> : <Star size={40} className="md:size-[44px]" />}
                              </div>
                              <div>
                                  <h4 className="text-white font-black text-xl md:text-2xl mb-2">إكمال المحاضرة</h4>
                                  <p className="text-brand-muted text-xs md:text-sm font-medium px-4">حدد المحاضرة كمكتملة لتنضم لسجل إنجازاتك</p>
                              </div>
                              <button onClick={() => toggleLessonCompletion(activeLesson.id)} className={`w-full py-4.5 rounded-2xl font-black text-sm md:text-lg transition-all transform active:scale-95 ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-gold text-brand-main shadow-glow'}`}>
                                  {isLessonCompleted(activeLesson.id) ? 'إلغاء المكتمل' : 'تمييز كمكتمل'}
                              </button>
                          </div>

                          {activeLesson.quiz && (
                            <div className="premium-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 border-brand-gold/10 bg-brand-gold/5 group hover:bg-brand-gold/10 transition-all">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-brand-gold text-brand-main flex items-center justify-center shadow-glow animate-pulse-slow">
                                    <Brain size={40} className="md:size-[44px]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xl md:text-2xl mb-2">اختبر معلوماتك</h4>
                                    <p className="text-brand-muted text-xs md:text-sm font-medium px-4">ابدأ الاختبار الآن لقياس مستوى استيعابك للمحاضرة</p>
                                </div>
                                <button onClick={() => setIsQuizActive(true)} className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl shadow-glow hover:scale-[1.03] transition-all text-sm md:text-lg flex items-center justify-center gap-3">
                                    ابدأ الاختبار الآن <ChevronLeft size={20} />
                                </button>
                            </div>
                          )}
                      </div>
                  </div>
                )}
            </div>
        </div>

        {/* Right Sidebar: Curriculum Roadmap */}
        <div className="xl:w-[450px] shrink-0">
            <div className="bg-brand-card/50 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 overflow-hidden sticky top-28 shadow-2xl">
                <div className="p-8 md:p-10 border-b border-white/5 bg-white/5">
                    <h3 className="text-white text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3"><List size={22} className="text-brand-gold md:size-[24px]" /> المنهج الدراسي</h3>
                    <p className="text-[9px] md:text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">خارطة طريق المادة العلمية</p>
                </div>
                
                <div className="max-h-[50vh] xl:max-h-[60vh] overflow-y-auto no-scrollbar py-4 md:py-6 px-4 space-y-3 md:space-y-4">
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const active = activeLessonId === lesson.id;
                        const completed = isLessonCompleted(lesson.id);
                        return (
                            <button 
                              key={lesson.id} 
                              onClick={() => accessible && setActiveLessonId(lesson.id)} 
                              className={`w-full group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[1.8rem] md:rounded-[2.5rem] border transition-all duration-500 text-right relative overflow-hidden ${
                                active 
                                ? 'bg-brand-gold/10 border-brand-gold/30 shadow-glow/10' 
                                : 'bg-brand-main/30 border-white/5 hover:border-white/20'
                              } ${!accessible ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                            >
                                {active && <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-brand-gold shadow-glow"></div>}
                                
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shrink-0 transition-all duration-500 ${
                                  active 
                                  ? 'bg-brand-gold text-brand-main shadow-glow scale-110' 
                                  : completed 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-brand-card text-brand-muted'
                                }`}>
                                    {accessible ? (completed ? <CheckCircle size={20} className="md:size-[26px]" /> : idx + 1) : <Lock size={18} className="md:size-[22px]" />}
                                </div>

                                <div className="flex-1">
                                    <p className={`text-sm md:text-lg font-black transition-all line-clamp-1 ${active ? 'text-brand-gold' : 'text-white/90'}`}>{lesson.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-brand-muted">
                                       <span className="flex items-center gap-1"><Clock size={10} className="md:size-[12px]" /> 45 دقيقة</span>
                                       {lesson.quiz && <span className="text-brand-gold flex items-center gap-1"><Brain size={10} className="md:size-[12px]" /> اختبار متاح</span>}
                                    </div>
                                </div>
                                
                                <div className={`transition-all duration-500 hidden md:block ${active ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                                   <ChevronLeft size={22} className="text-brand-gold" />
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {/* Sidebar Footer Stats */}
                <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 flex items-center justify-around">
                    <div className="text-center">
                        <p className="text-[8px] md:text-[9px] text-brand-muted font-black uppercase tracking-widest mb-1">نسبة الإنجاز</p>
                        <p className="text-lg md:text-xl font-black text-white">{Math.round((user.completedLessons?.length || 0) / activeCourse.lessons.length * 100)}%</p>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[8px] md:text-[9px] text-brand-muted font-black uppercase tracking-widest mb-1">الرتبة</p>
                        <p className="text-lg md:text-xl font-black text-brand-gold">طالب ذهبي</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
