
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { Brain, Search, GraduationCap, BarChart3, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';

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
          const scoreValue = score as number;
          results.push({
            userId: u.id,
            userName: u.name,
            phone: u.phone,
            lessonId,
            score: scoreValue,
            status: scoreValue >= 50 ? 'pass' : 'fail',
            date: new Date().toLocaleDateString('ar-EG')
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
      const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [examResults, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-brand-blue rounded-full">
               <BarChart3 size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 font-medium">متوسط الدرجات</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.avg}%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
               <UserCheck size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 font-medium">نسبة النجاح</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.passRate}%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
               <Brain size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 font-medium">إجمالي الاختبارات</p>
               <h3 className="text-2xl font-bold text-gray-900">{examResults.length}</h3>
            </div>
         </div>
      </div>

      {/* 2. Results Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap size={20} className="text-gray-400" /> نتائج الطلاب
            </h3>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="بحث باسم الطالب..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-300 rounded-md pr-9 pl-3 py-1.5 text-sm outline-none focus:border-brand-blue focus:bg-white transition-colors" 
                  />
               </div>
               <select 
                 value={statusFilter} 
                 onChange={(e) => setStatusFilter(e.target.value as any)} 
                 className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-1.5 outline-none focus:border-brand-blue"
               >
                  <option value="all">الكل</option>
                  <option value="pass">ناجح</option>
                  <option value="fail">راسب</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الطالب</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الاختبار</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الدرجة</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{result.userName}</p>
                      <p className="text-xs text-gray-500 font-mono">{result.phone || 'No Phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {result.lessonId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-bold text-gray-900">{result.score}%</span>
                         {result.score >= 85 && <TrendingUp size={14} className="text-green-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.status === 'pass' ? 'ناجح' : 'راسب'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{result.date}</td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                       <AlertCircle size={24} className="mx-auto mb-2 text-gray-400" />
                       <p>لا توجد نتائج مطابقة</p>
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
