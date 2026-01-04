
import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, X, ListChecks } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Exam } from '../types';

const EXAMS_DATA: Exam[] = [
  { id: 'ex1', title: 'English 1', code: 'ENG022', date: 'الخميس 25/12/2025', time: '2:30PM - 4:00PM', location: 'Digital Library L2' },
  { id: 'ex2', title: 'Adult Health Nursing I', code: 'AHN 111', date: 'الأربعاء 31/12/2025', time: '9:15AM - 11:30AM', location: 'Digital Library L1A' },
];

export const ExamHub: React.FC = () => {
  const { user, updateUserData, isExamHubOpen, setExamHubOpen } = useApp();

  const completedExams = useMemo(() => user?.completedExams || [], [user]);
  const progress = useMemo(() => Math.round((completedExams.length / EXAMS_DATA.length) * 100), [completedExams]);

  const toggleExam = async (examId: string) => {
    if (!user) return;
    const newCompleted = completedExams.includes(examId) 
      ? completedExams.filter(id => id !== examId) 
      : [...completedExams, examId];
    await updateUserData({ completedExams: newCompleted });
  };

  if (!isExamHubOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
                <h2 className="text-xl font-bold text-gray-900">جدول الامتحانات</h2>
                <p className="text-sm text-gray-500">متابعة مواعيد ولجان امتحانات الفصل الدراسي</p>
            </div>
            <button onClick={() => setExamHubOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-4">
                    <div className="p-2 bg-blue-100 text-brand-blue rounded-md"><ListChecks size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">المتبقي</p>
                        <h4 className="text-lg font-bold text-gray-900">{EXAMS_DATA.length - completedExams.length} مواد</h4>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-md"><CheckCircle2 size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">تم الانتهاء</p>
                        <h4 className="text-lg font-bold text-gray-900">{completedExams.length} مواد</h4>
                    </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center gap-4">
                    <div className="p-2 bg-white border border-gray-200 text-gray-600 rounded-md"><Clock size={20} /></div>
                    <div>
                         <p className="text-xs text-gray-500 font-semibold uppercase">الإنجاز الكلي</p>
                         <h4 className="text-lg font-bold text-gray-900">{progress}%</h4>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {EXAMS_DATA.map((exam) => {
                    const isDone = completedExams.includes(exam.id);
                    return (
                        <div 
                            key={exam.id}
                            className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg border transition-all ${
                                isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-brand-blue'
                            }`}
                        >
                            <div className="flex-1 text-center md:text-right">
                                <h3 className={`font-bold ${isDone ? 'text-green-800' : 'text-gray-900'}`}>
                                    {exam.title} <span className="text-xs font-normal text-gray-500 mx-2">{exam.code}</span>
                                </h3>
                                <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {exam.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {exam.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {exam.location}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleExam(exam.id)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
                                    isDone 
                                    ? 'bg-white text-green-600 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                                    : 'bg-brand-blue text-white hover:bg-blue-700'
                                }`}
                            >
                                {isDone ? 'إلغاء' : 'تم الانتهاء'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};
