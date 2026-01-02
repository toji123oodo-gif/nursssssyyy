
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { Brain, Trophy, AlertCircle, Search, Filter, GraduationCap, BarChart3, TrendingUp, TrendingDown, UserCheck } from 'lucide-react';

interface Props {
  users: User[];
}

export const ExamsTab: React.FC<Props> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');

  const examResults = useMemo(() => {
    const results: any[] = [];
    users.forEach(u => {
      if (u.quizGrades) {
        Object.entries(u.quizGrades).forEach(([lessonId, score]) => {
          // Fix: Explicitly cast score to number to resolve comparison error with unknown type from Object.entries
          const scoreValue = score as number;
          results.push({
            userId: u.id,
            userName: u.name,
            phone: u.phone,
            lessonId,
            score: scoreValue,
            status: scoreValue >= 50 ? 'pass' : 'fail',
            date: new Date().toLocaleDateString('ar-EG') // Ideally would store result timestamp
          });
        });
      }
    });
    return results;
  }, [users]);

  const stats = useMemo(() => {
    if (examResults.length === 0) return { avg: 0, passRate: 0 };
    const totalScore = examResults.reduce((acc, r) => acc + r.score, 0);
    const passCount = examResults.filter(r => r.score >= 50).length;
    return {
      avg: Math.round(totalScore / examResults.length),
      passRate: Math.round((passCount / examResults.length) * 100)
    };
  }, [examResults]);

  const filteredResults = useMemo(() => {
    return examResults.filter(r => {
      const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [examResults, searchTerm, statusFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Exam Performance Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center shadow-inner"><BarChart3 size={32} /></div>
            <div>
               <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">متوسط الدرجات</p>
               <h3 className="text-3xl font-black text-white">{stats.avg}%</h3>
            </div>
         </div>
         <div className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shadow-inner"><UserCheck size={32} /></div>
            <div>
               <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">نسبة النجاح العامة</p>
               <h3 className="text-3xl font-black text-white">{stats.passRate}%</h3>
            </div>
         </div>
         <div className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 bg-brand-main rounded-2xl flex items-center justify-center text-brand-gold shadow-inner border border-white/5"><Brain size={32} /></div>
            <div>
               <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">إجمالي المحاولات</p>
               <h3 className="text-3xl font-black text-white">{examResults.length}</h3>
            </div>
         </div>
      </div>

      {/* 2. Main Results Table */}
      <div className="bg-brand-card rounded-[3.5rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <h3 className="text-2xl font-black text-white flex items-center gap-4"><GraduationCap size={32} className="text-brand-gold" /> سجل نتائج الاختبارات</h3>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
               <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                  <input type="text" placeholder="اسم الطالب أو الرقم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-64 bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-3 text-xs text-white outline-none focus:border-brand-gold transition-all" />
               </div>
               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-brand-main text-white border border-white/10 rounded-2xl px-6 py-3 text-xs outline-none focus:border-brand-gold cursor-pointer">
                  <option value="all">كل النتائج</option>
                  <option value="pass">الناجحين</option>
                  <option value="fail">الراسبين</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-right text-white">
              <thead className="text-brand-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="p-6">الطالب</th>
                  <th className="p-6">المحاضرة / الكورس</th>
                  <th className="p-6">الدرجة النهائية</th>
                  <th className="p-6">حالة الطالب</th>
                  <th className="p-6">تاريخ الاختبار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResults.map((result, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-all group">
                    <td className="p-6">
                      <p className="font-black text-sm group-hover:text-brand-gold transition-colors">{result.userName}</p>
                      <p className="text-[10px] text-brand-muted font-mono">{result.phone}</p>
                    </td>
                    <td className="p-6">
                      <div className="text-[10px] font-black text-brand-muted bg-brand-main/50 px-3 py-1.5 rounded-lg border border-white/5 w-fit uppercase tracking-tighter">
                        {result.lessonId}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <span className="text-2xl font-black text-white">{result.score}%</span>
                         {result.score >= 85 ? <TrendingUp size={14} className="text-green-500" /> : result.score < 50 ? <TrendingDown size={14} className="text-red-500" /> : null}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${result.status === 'pass' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {result.status === 'pass' ? 'ناجح' : 'راسب'}
                      </span>
                    </td>
                    <td className="p-6 text-[10px] text-brand-muted font-mono">{result.date}</td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <AlertCircle size={48} className="mx-auto text-brand-muted opacity-20 mb-4" />
                       <p className="text-brand-muted font-bold italic">لا توجد سجلات حالياً</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
