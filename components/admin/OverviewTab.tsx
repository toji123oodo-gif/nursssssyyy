
import React, { useMemo } from 'react';
import { Users, UserCheck, Brain, DollarSign, Activity, Clock, TrendingUp, ArrowUpRight, Target } from 'lucide-react';
import { User, Course } from '../../types';

interface Props {
  users: User[];
  courses: Course[];
  activities: any[];
}

export const OverviewTab: React.FC<Props> = ({ users, courses, activities }) => {
  const stats = useMemo(() => {
    const activePro = users.filter(u => u.subscriptionTier === 'pro').length;
    const totalQuizzes = courses.reduce((acc, c) => acc + (c.lessons?.filter(l => l.quiz).length || 0), 0);
    const completedLessons = users.reduce((acc, u) => acc + (u.completedLessons?.length || 0), 0);
    
    return {
      totalStudents: users.length,
      activePro,
      totalQuizzes,
      totalIncome: activePro * 50,
      engagementRate: users.length > 0 ? Math.round((completedLessons / (users.length * 5)) * 100) : 0
    };
  }, [users, courses]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'الطلاب المسجلين', val: stats.totalStudents, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: '+12%' },
          { label: 'مشتركي البريميوم', val: stats.activePro, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10', trend: '+5%' },
          { label: 'إجمالي الأرباح', val: `${stats.totalIncome} ج.م`, icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: 'مستقر' },
          { label: 'معدل التفاعل', val: `${stats.engagementRate}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+8%' },
        ].map((s, i) => (
          <div key={i} className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6">
               <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                 <s.icon size={28} />
               </div>
               <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                 <ArrowUpRight size={12} /> {s.trend}
               </span>
            </div>
            <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-4xl font-black text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Visual Activity Graph (Simulated with CSS) */}
        <div className="lg:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-white flex items-center gap-3"><TrendingUp className="text-brand-gold" /> إحصائيات المشاهدات الأسبوعية</h3>
              <select className="bg-brand-main text-xs text-brand-muted border border-white/10 rounded-xl px-4 py-2 outline-none">
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
              </select>
           </div>
           <div className="flex items-end justify-between h-48 gap-2">
              {[40, 70, 55, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-full bg-brand-gold/10 rounded-t-xl relative overflow-hidden transition-all duration-500 group-hover:bg-brand-gold/20" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 left-0 w-full bg-brand-gold/40 h-1/2 blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-full bg-brand-gold h-1 transition-all"></div>
                   </div>
                   <span className="text-[9px] text-brand-muted font-bold uppercase">{['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        {/* 3. Recent Activity Feed */}
        <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10">
           <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Activity className="text-brand-gold" /> نشاط المنصة</h3>
           <div className="space-y-6">
             {activities.length > 0 ? activities.map((act, i) => (
               <div key={i} className="flex items-start gap-4 group">
                 <div className="w-10 h-10 bg-white/5 text-brand-gold rounded-xl flex items-center justify-center shrink-0 border border-white/5 group-hover:border-brand-gold/30 transition-all"><Clock size={18} /></div>
                 <div className="flex-1">
                   <p className="text-white text-xs font-bold leading-relaxed">{act.message}</p>
                   <p className="text-[9px] text-brand-muted font-mono mt-1 opacity-60">{new Date(act.timestamp).toLocaleTimeString('ar-EG')}</p>
                 </div>
               </div>
             )) : (
               <div className="text-center py-10">
                 <Activity size={40} className="mx-auto text-brand-muted opacity-20 mb-3" />
                 <p className="text-xs text-brand-muted">لا توجد نشاطات حالية</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
