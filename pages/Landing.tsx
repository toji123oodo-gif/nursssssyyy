
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, 
  Activity, Microscope, Stethoscope, BedDouble, User, Filter, Zap, ChevronDown, 
  Sparkles, GraduationCap, MessageCircle, Briefcase, MousePointer2, Smartphone, 
  Users, FileCheck, Search, UserPlus, LogIn, ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const getCourseIcon = (subject: string) => {
  switch(subject) {
    case 'Anatomy': return <Skull size={16} />;
    case 'Physiology': return <Activity size={16} />;
    case 'Microbiology': return <Microscope size={16} />;
    case 'Adult Nursing': return <BedDouble size={16} />;
    case 'Health': return <Stethoscope size={16} />;
    default: return <BookOpen size={16} />;
  }
};

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSubject = selectedSubject === 'All' || c.subject === selectedSubject;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [courses, selectedSubject, searchQuery]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-brand-main/80 backdrop-blur-[2px] z-10"></div>
            <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2400&auto=format&fit=crop" 
                alt="Nursing Education" 
                className="w-full h-full object-cover scale-110 animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-brand-main/40 to-transparent z-15"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 text-brand-gold px-6 py-2.5 rounded-full text-xs font-black mb-8 border border-brand-gold/20 animate-fade-in-up shimmer-premium">
                <Sparkles size={16} className="text-brand-gold" />
                <span className="tracking-[0.2em] uppercase">نظام نيرسي التعليمي المتكامل</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tighter text-white animate-fade-in-up">
                بوابتك نحو <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-400 to-white">
                  الاحتراف التمريضي
                </span>
            </h1>
            
            <p className="text-brand-muted text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                انضم لأكثر من 50,000 طالب تمريض في مصر، وتعلم بأسلوب "نيرسي" الذي يجمع بين سهولة الفهم وقوة المنهج.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/dashboard" className="group bg-brand-gold text-brand-main text-lg font-black py-5 px-12 rounded-3xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-4">
                  ابدأ رحلتك الآن
                  <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/signup" className="glass-button text-white text-lg font-black py-5 px-12 rounded-3xl flex items-center justify-center gap-4">
                  إنشاء حساب مجاني
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Bento Grid */}
      <section className="py-24 relative container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-10">
            <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter flex items-center gap-4">
                    <Zap className="text-brand-gold" /> المحاضرات الأكاديمية
                </h2>
                <p className="text-brand-muted text-lg">اختر المادة العلمية وابدأ بمشاهدة العينات المجانية.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="ابحث بالاسم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-card/50 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white text-sm outline-none focus:border-brand-gold transition-all"
                    />
                </div>
                <div className="flex bg-brand-card/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar gap-2">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                                selectedSubject === subject
                                ? 'bg-brand-gold text-brand-main shadow-glow'
                                : 'text-brand-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {subject === 'All' ? 'الكل' : subject}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id} className="group flex flex-col h-full premium-card rounded-[3rem] overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent"></div>
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <div className="bg-brand-main/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-[10px] font-black text-brand-gold flex items-center gap-2 shadow-xl">
                              {getCourseIcon(course.subject)}
                              {course.subject}
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-gold transition-colors leading-tight">{course.title}</h3>
                      <div className="flex items-center gap-6 mb-8 border-y border-white/5 py-4">
                          <div className="flex items-center gap-2 text-brand-muted text-[10px] font-bold uppercase tracking-widest">
                            <BookOpen size={16} className="text-brand-gold" /> {course.lessons.length} محاضرات
                          </div>
                          <div className="flex items-center gap-2 text-brand-muted text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={16} className="text-brand-gold" /> محتوى متجدد
                          </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                              <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">الاستثمار التعليمي</span>
                              <span className="text-3xl font-black text-white">{course.price} <span className="text-xs text-brand-gold">ج.م</span></span>
                          </div>
                          <div className="w-16 h-16 bg-brand-main rounded-3xl flex items-center justify-center text-brand-gold border border-white/5 group-hover:bg-brand-gold group-hover:text-brand-main transition-all duration-500 shadow-inner">
                              <ChevronLeft size={28} strokeWidth={3} />
                          </div>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
};
