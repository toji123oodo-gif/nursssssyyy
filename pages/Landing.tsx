
import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  Play, GraduationCap, Award, Star, ArrowLeft, 
  Zap, Sparkles, BookOpen, Clock, ChevronLeft,
  ArrowRight, PlayCircle, X, Brain, MessageSquare,
  ShieldCheck, Share2, MousePointer2, Mic, Users, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [scrollY, setScrollY] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      return selectedSubject === 'All' || c.subject === selectedSubject;
    });
  }, [courses, selectedSubject]);

  return (
    <div className="pb-32 overflow-x-hidden bg-[#161616]">
      {/* Tutorial Video Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTutorialOpen(false)}></div>
          <div className="relative w-full max-w-5xl aspect-video bg-[#202020] rounded-lg overflow-hidden shadow-2xl border border-white/10">
             <button 
               onClick={() => setIsTutorialOpen(false)} 
               className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded hover:bg-brand-orange hover:text-white transition-all"
             >
               <X size={20}/>
             </button>
             <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Nursy Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
             ></iframe>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 border-b border-white/5 bg-[#161616]">
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded border border-brand-orange/30 bg-brand-orange/10 mb-8">
            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">New Platform Update</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            مستقبلك في التمريض<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-200">يبدأ بخطوة ذكية</span>
          </h1>
          
          <p className="text-[#A0A0A0] text-lg md:text-xl max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
            منصة تعليمية متكاملة تعتمد على الذكاء الاصطناعي لتبسيط المناهج الطبية.
            شرح صوتي، تحليل مرئي، وشهادات معتمدة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/dashboard" : "/signup"} className="btn-primary px-8 py-3 text-base rounded shadow-[0_0_20px_rgba(243,128,32,0.3)]">
              ابدأ رحلة التميز
            </Link>
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="px-8 py-3 rounded border border-white/20 text-white hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
            >
              <PlayCircle size={18} />
              كيفية الاستخدام
            </button>
          </div>
        </div>
      </section>

      {/* Cloudflare Style Bento Grid Feature Section */}
      <section className="py-24 bg-[#161616] px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center md:text-right">
            <h2 className="text-3xl font-bold text-white mb-2">مميزات المنصة</h2>
            <p className="text-[#A0A0A0]">أدوات تقنية صممت خصيصاً لطلاب القطاع الطبي.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: AI Analysis (Hero Card) - Spans 2 Cols */}
            <div className="md:col-span-2 bg-[#202020] border border-white/10 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-brand-orange/50 transition-colors group relative overflow-hidden">
               {/* Background Gradient Effect */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand-orange/10 transition-all"></div>
               
               <div className="relative z-10 flex-1 space-y-4 max-w-lg">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded flex items-center justify-center text-brand-orange mb-2">
                    <Brain size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">تحليل ذكي للفيديوهات</h3>
                  <p className="text-[#A0A0A0] leading-relaxed">
                    ارفع أي فيديو لعملية تمريضية، ودع ذكاء نيرسي الاصطناعي يشرح لك كل خطوة بالتفصيل، يستخرج الملاحظات الهامة، وينبهك للأخطاء الشائعة.
                  </p>
                  <div className="pt-2">
                    <Link to="/ai-vision" className="inline-flex items-center gap-2 text-brand-orange font-medium hover:text-white transition-colors">
                      جرب المساعد الذكي <ArrowLeft size={16} />
                    </Link>
                  </div>
               </div>

               {/* Visual Decoration */}
               <div className="hidden md:block relative z-10 mr-8 border border-white/10 bg-[#1a1a1a] p-4 rounded-lg shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] text-white font-mono">LIVE ANALYSIS</span>
                  </div>
                  <div className="space-y-2 w-48">
                    <div className="h-2 bg-white/10 rounded w-3/4"></div>
                    <div className="h-2 bg-white/10 rounded w-1/2"></div>
                    <div className="h-2 bg-brand-orange/20 rounded w-full mt-2"></div>
                  </div>
               </div>
            </div>

            {/* Feature 2: Podcast */}
            <div className="bg-[#202020] border border-white/10 rounded-lg p-8 hover:border-white/30 transition-colors flex flex-col items-start h-full">
              <div className="w-10 h-10 bg-[#2C2C2C] rounded flex items-center justify-center text-white mb-6 border border-white/5">
                <Mic size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">شروحات صوتية</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-6 flex-1">
                ذاكر في أي وقت وأي مكان. مكتبة صوتية شاملة تغطي كافة المواد بأسلوب البودكاست الممتع.
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="w-1/2 h-full bg-brand-orange"></div>
              </div>
            </div>

            {/* Feature 3: Certificates */}
            <div className="bg-[#202020] border border-white/10 rounded-lg p-8 hover:border-white/30 transition-colors flex flex-col items-start h-full">
               <div className="w-10 h-10 bg-[#2C2C2C] rounded flex items-center justify-center text-white mb-6 border border-white/5">
                <Award size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">شهادات معتمدة</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                احصل على شهادة موثقة بـ QR Code بعد إتمام كل كورس، لتوثيق مهاراتك في سيرتك الذاتية.
              </p>
            </div>

            {/* Feature 4: Community - Spans 2 Cols on large to balance grid if needed, or keep standard */}
            <div className="md:col-span-2 bg-[#202020] border border-white/10 rounded-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/30 transition-colors">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-[#2C2C2C] rounded flex items-center justify-center text-white border border-white/5">
                        <Users size={20} />
                     </div>
                     <h3 className="text-lg font-bold text-white">مجتمع الفرسان</h3>
                  </div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-xl">
                    شات مباشر يجمع طلاب التمريض من كل محافظات مصر. تبادل الخبرات، اسأل المعيدين، وشارك ملخصاتك مع زملائك في بيئة تعليمية آمنة.
                  </p>
               </div>
               <div className="flex -space-x-3 space-x-reverse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#202020] bg-gray-700 flex items-center justify-center text-xs text-white font-bold">
                       U{i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#202020] bg-brand-orange flex items-center justify-center text-xs text-white font-bold">
                    +1k
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 container mx-auto px-6 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12">
          <div className="space-y-2 text-right">
            <h2 className="text-3xl font-bold text-white tracking-tight">الكتالوج الأكاديمي</h2>
            <p className="text-[#A0A0A0]">تصفح المواد الدراسية المتاحة للفصل الحالي.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-[#202020] rounded border border-white/10">
            {subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${selectedSubject === sub ? 'bg-brand-orange text-white shadow-sm' : 'text-[#A0A0A0] hover:text-white'}`}
              >
                {sub === 'All' ? 'الكل' : sub}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <Link 
              to={`/course/${course.id}`} 
              key={course.id} 
              className="group bg-[#202020] rounded-lg overflow-hidden border border-white/10 hover:border-brand-orange/50 transition-all flex flex-col h-full"
            >
                <div className="h-48 relative overflow-hidden bg-[#2C2C2C]">
                  <img src={course.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={course.title} />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-medium border border-white/10">
                    {course.subject}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 mb-6">
                     <span className="text-[#A0A0A0] text-xs flex items-center gap-1">
                        <BookOpen size={14} /> {course.lessons.length} درس
                     </span>
                     <span className="text-[#A0A0A0] text-xs flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" fill="currentColor" /> 4.9
                     </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[#666] text-[10px] uppercase font-bold tracking-wider">المحاضر</span>
                        <span className="text-sm font-semibold text-white">{course.instructor || 'د. نيرسي'}</span>
                     </div>
                     <ArrowLeft size={18} className="text-[#666] group-hover:text-brand-orange transition-colors" />
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="border-t border-white/5 py-16 bg-[#121212]">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
              <div className="text-center py-4">
                 <h4 className="text-4xl font-bold text-white mb-1">15k+</h4>
                 <p className="text-[#666] text-sm uppercase tracking-widest">طالب مسجل</p>
              </div>
              <div className="text-center py-4">
                 <h4 className="text-4xl font-bold text-white mb-1">850+</h4>
                 <p className="text-[#666] text-sm uppercase tracking-widest">مادة علمية</p>
              </div>
              <div className="text-center py-4">
                 <h4 className="text-4xl font-bold text-white mb-1">4.9</h4>
                 <p className="text-[#666] text-sm uppercase tracking-widest">تقييم عام</p>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
};
