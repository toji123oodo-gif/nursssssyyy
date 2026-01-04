
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  FileText, Brain, ChevronDown, ChevronRight, 
  Play, Lock, Clock, CheckCircle2, AlertCircle,
  BarChart3, Settings, Download
} from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';
import { QuizPlayer } from '../components/QuizPlayer';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'lessons' | 'analytics' | 'settings'>('lessons');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  if (!course) return <div className="p-8 text-center text-muted">Configuration not found.</div>;

  const isCompleted = (id: string) => user?.completedLessons?.includes(id);
  const progress = Math.round((user?.completedLessons?.filter(id => course.lessons.some(l => l.id === id)).length || 0) / course.lessons.length * 100);

  return (
    <div className="space-y-6">
      {activeQuizId && (
        <QuizPlayer 
          quiz={course.lessons.find(l => l.id === activeQuizId)?.quiz!} 
          onComplete={() => {}} 
          onClose={() => setActiveQuizId(null)} 
        />
      )}

      {/* Enterprise Header */}
      <div className="flex flex-col gap-4 border-b border-[#E5E5E5] dark:border-[#333] pb-6">
        <div className="flex items-center gap-2 text-xs text-muted">
           <Link to="/dashboard" className="hover:text-[#0051C3] dark:hover:text-[#68b5fb] flex items-center gap-1">
             <ChevronRight size={12} className="rotate-180" /> Resources
           </Link>
           <span className="text-gray-300">/</span>
           <span className="font-mono text-main">{course.id.toUpperCase()}</span>
        </div>
        
        <div className="flex items-start justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#2C2C2C] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] flex items-center justify-center">
                 <img src={course.image} alt="" className="w-full h-full object-cover opacity-80 rounded-[3px]" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-main flex items-center gap-3">
                   {course.title}
                   <span className="cf-badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                     Active
                   </span>
                 </h1>
                 <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock size={12}/> Last updated 2 days ago</span>
                    <span>•</span>
                    <span>{course.instructor}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-2">
              <button className="btn-secondary">
                 <Settings size={14} /> Configure
              </button>
              <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
                 Pause Learning
              </button>
           </div>
        </div>

        {/* Cloudflare-style Tabs */}
        <div className="flex gap-6 mt-2">
           {['lessons', 'analytics', 'settings'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`text-sm font-medium pb-2 border-b-2 transition-colors capitalize ${
                 activeTab === tab 
                 ? 'border-[#0051C3] dark:border-[#68b5fb] text-[#0051C3] dark:text-[#68b5fb]' 
                 : 'border-transparent text-muted hover:text-main'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'lessons' && (
        <div className="cf-card">
          <div className="cf-header">
             <h3 className="text-sm font-bold text-main">Learning Rules</h3>
             <span className="text-xs text-muted">{course.lessons.length} rules configured</span>
          </div>
          
          <div className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
             {course.lessons.map((lesson) => {
               const isOpen = expandedLesson === lesson.id;
               const done = isCompleted(lesson.id);
               
               return (
                 <div key={lesson.id} className="group bg-white dark:bg-[#1E1E1E]">
                    <div 
                      onClick={() => setExpandedLesson(isOpen ? null : lesson.id)}
                      className={`px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors ${isOpen ? 'bg-gray-50 dark:bg-[#252525]' : ''}`}
                    >
                       <div className="flex items-center gap-4">
                          <button className="text-muted hover:text-main">
                             {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <div className={`w-2 h-2 rounded-full ${done ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <div>
                             <p className="text-sm font-medium text-main font-mono">{lesson.title}</p>
                             <p className="text-[10px] text-muted">{lesson.duration || '00:00:00'} • ID: {lesson.id}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {lesson.isLocked ? (
                             <Lock size={14} className="text-muted" />
                          ) : (
                             <span className="text-[10px] bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb] px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                               Deployed
                             </span>
                          )}
                       </div>
                    </div>

                    {/* Expanded "Configuration" Panel */}
                    {isOpen && (
                       <div className="px-5 py-4 bg-[#F9FAFB] dark:bg-[#151515] border-t border-[#E5E5E5] dark:border-[#333] shadow-inner">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {/* Media Column */}
                             <div className="md:col-span-2 space-y-4">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Media Content</h4>
                                <div className="cf-card p-3 flex items-center gap-3">
                                   <div className="w-8 h-8 bg-brand-orange text-white flex items-center justify-center rounded-[3px]">
                                      <Play size={14} fill="currentColor" />
                                   </div>
                                   <div className="flex-1">
                                      <AudioPlayer 
                                         url={lesson.contents.find(c => c.type === 'audio')?.url || ''} 
                                         title="Primary Audio Track" 
                                      />
                                   </div>
                                </div>
                             </div>

                             {/* Assets Column */}
                             <div className="space-y-4">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Assets & Controls</h4>
                                <div className="space-y-2">
                                   {lesson.contents.filter(c => c.type === 'pdf').map(pdf => (
                                      <a key={pdf.id} href={pdf.url} target="_blank" className="flex items-center justify-between p-2 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded-[3px] hover:border-[#0051C3] transition-colors group/link">
                                         <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted group-hover/link:text-[#0051C3]" />
                                            <span className="text-xs text-main">Document.pdf</span>
                                         </div>
                                         <Download size={12} className="text-muted" />
                                      </a>
                                   ))}
                                   
                                   {lesson.quiz && (
                                      <button 
                                         onClick={() => setActiveQuizId(lesson.id)}
                                         className="w-full flex items-center justify-between p-2 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded-[3px] hover:border-brand-orange transition-colors group/quiz"
                                      >
                                         <div className="flex items-center gap-2">
                                            <Brain size={14} className="text-muted group-hover/quiz:text-brand-orange" />
                                            <span className="text-xs text-main">Assessment</span>
                                         </div>
                                         <span className="text-[10px] text-muted">Start</span>
                                      </button>
                                   )}
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
               );
             })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cf-card p-6">
               <h4 className="text-sm font-bold text-main mb-4">Engagement Score</h4>
               <div className="flex items-end gap-2 h-32">
                  <div className="w-full bg-blue-50 dark:bg-[#2B3A4F] h-full relative rounded-sm overflow-hidden">
                     <div className="absolute bottom-0 left-0 right-0 bg-[#0051C3] dark:bg-[#68b5fb] transition-all duration-1000" style={{ height: `${progress}%` }}></div>
                  </div>
               </div>
               <div className="mt-4 flex justify-between items-center text-xs text-muted">
                  <span>Current: {progress}%</span>
                  <span>Target: 100%</span>
               </div>
            </div>
            <div className="cf-card p-6 flex flex-col justify-center">
               <AlertCircle className="text-brand-orange mb-3" size={24} />
               <h4 className="text-sm font-bold text-main">No Data Available</h4>
               <p className="text-xs text-muted mt-1">Complete more lessons to generate detailed analytics.</p>
            </div>
         </div>
      )}
    </div>
  );
};
