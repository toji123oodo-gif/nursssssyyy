
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, Course, Lesson, ContentItem, ActivationCode } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Trash2, Edit, BookOpen, 
  DollarSign, UserCheck, UserPlus, 
  Plus, Save, X, 
  Layout, BarChart3, 
  Zap, Bell, CreditCard, UserCog,
  Monitor, Smartphone, Key, Ticket, 
  ChevronRight, Play, FileText, PlusCircle, Trash
} from 'lucide-react';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  
  // States for Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Stats Logic
  const stats = useMemo(() => {
    const activePro = allUsers.filter(u => u.subscriptionTier === 'pro').length;
    return {
      totalStudents: allUsers.length,
      activePro,
      totalIncome: activePro * 50,
      totalCourses: courses.length
    };
  }, [allUsers, courses]);

  // Data Fetching
  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(50).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    return () => { unsubUsers(); unsubCodes(); };
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Activation Codes Logic ---
  const generateCodes = async (count: number, days: number) => {
    if (!db) return;
    try {
      const batch = db.batch();
      for (let i = 0; i < count; i++) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
        const ref = db.collection("activation_codes").doc();
        batch.set(ref, {
          id: ref.id,
          code,
          isUsed: false,
          days,
          createdAt: new Date().toISOString()
        });
      }
      await batch.commit();
      showNotification('success', `تم إنشاء ${count} كود تفعيل بنجاح`);
    } catch (e) {
      showNotification('error', 'فشل إنشاء الأكواد');
    }
  };

  // --- Course Management ---
  const handleSaveCourse = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) {
        await updateCourse(editingCourse as Course);
      } else {
        const newId = 'c' + Date.now();
        await addCourse({ ...editingCourse, id: newId } as Course);
      }
      setIsCourseModalOpen(false);
      showNotification('success', 'تم حفظ الكورس بنجاح');
    } catch (e) {
      showNotification('error', 'خطأ في الحفظ');
    }
  };

  const addLessonToCourse = () => {
    const newLesson: Lesson = {
      id: 'l' + Date.now(),
      title: 'محاضرة جديدة',
      isLocked: true,
      contents: []
    };
    setEditingCourse(prev => ({
      ...prev,
      lessons: [...(prev?.lessons || []), newLesson]
    }));
  };

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-right">
            <h1 className="text-4xl font-black text-white mb-2">لوحة الإدارة</h1>
            <p className="text-brand-muted">تحكم كامل في منصة نيرسي التعليمية</p>
          </div>
          <div className="flex bg-brand-card p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
            {[
              {id: 'overview', label: 'الرئيسية', icon: Layout},
              {id: 'users', label: 'الطلاب', icon: Users},
              {id: 'courses', label: 'المحتوى', icon: BookOpen},
              {id: 'codes', label: 'الأكواد', icon: Key}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5">
              <Users className="text-brand-gold mb-4" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">إجمالي الطلاب</p>
              <h3 className="text-3xl font-black text-white">{stats.totalStudents}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5">
              <UserCheck className="text-green-500 mb-4" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">مشتركين PRO</p>
              <h3 className="text-3xl font-black text-white">{stats.activePro}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5">
              <BookOpen className="text-blue-500 mb-4" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">عدد الكورسات</p>
              <h3 className="text-3xl font-black text-white">{stats.totalCourses}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5">
              <DollarSign className="text-brand-gold shadow-glow" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">الدخل التقديري</p>
              <h3 className="text-3xl font-black text-white">{stats.totalIncome} ج.م</h3>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-white/5">
               <input 
                type="text" 
                placeholder="ابحث عن طالب..." 
                className="w-full bg-brand-main border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-brand-gold"
                onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">الطالب</th>
                    <th className="px-6 py-4">رقم الهاتف</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-left">تحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.filter(u => u.name.includes(searchTerm)).map(u => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                      <td className="px-6 py-4 text-brand-muted font-mono">{u.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-brand-muted'}`}>
                          {u.subscriptionTier === 'pro' ? 'PREMIUM' : 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <button onClick={() => {setEditingUser(u); setIsUserModalOpen(true);}} className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-main rounded-lg"><Edit size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => {setEditingCourse({lessons: []}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-glow">
              <PlusCircle size={20} /> إضافة كورس جديد
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all bg-brand-main/40 backdrop-blur-sm">
                      <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-3 bg-brand-gold text-brand-main rounded-xl"><Edit size={20}/></button>
                      <button onClick={() => deleteCourse(course.id)} className="p-3 bg-red-500 text-white rounded-xl"><Trash size={20}/></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-white font-black text-lg mb-2">{course.title}</h4>
                    <p className="text-brand-muted text-xs">{course.lessons.length} محاضرة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-brand-card p-8 rounded-3xl border border-brand-gold/20 flex flex-col md:flex-row items-end gap-6">
               <div className="flex-1 space-y-2">
                 <label className="text-xs text-brand-muted font-bold">عدد الأكواد</label>
                 <input id="code-count" type="number" defaultValue={10} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-3 text-white" />
               </div>
               <div className="flex-1 space-y-2">
                 <label className="text-xs text-brand-muted font-bold">المدة (أيام)</label>
                 <input id="code-days" type="number" defaultValue={30} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-3 text-white" />
               </div>
               <button 
                onClick={() => {
                  const c = Number((document.getElementById('code-count') as HTMLInputElement).value);
                  const d = Number((document.getElementById('code-days') as HTMLInputElement).value);
                  generateCodes(c, d);
                }}
                className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-xl shadow-glow"
               >توليد الأكواد</button>
            </div>
            
            <div className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden">
               <table className="w-full text-right">
                <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">الكود</th>
                    <th className="px-6 py-4">المدة</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activationCodes.map(code => (
                    <tr key={code.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-mono font-bold text-brand-gold">{code.code}</td>
                      <td className="px-6 py-4 text-white text-xs">{code.days} يوم</td>
                      <td className="px-6 py-4">
                        {code.isUsed ? <span className="text-red-400 text-xs">مستخدم</span> : <span className="text-green-400 text-xs">متاح</span>}
                      </td>
                      <td className="px-6 py-4 text-brand-muted text-[10px]">{new Date(code.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals - Course Editor */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-md" onClick={() => setIsCourseModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-2xl font-black text-white">{editingCourse.id ? 'تعديل كورس' : 'إضافة كورس جديد'}</h3>
               <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 space-y-8 no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input type="text" placeholder="اسم الكورس" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white" />
                 <input type="text" placeholder="اسم المحاضر" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white" />
                 <input type="number" placeholder="السعر" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white" />
                 <input type="text" placeholder="رابط صورة الكورس" value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white" />
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-white font-bold">محاضرات الكورس</h5>
                    <button onClick={addLessonToCourse} className="text-brand-gold flex items-center gap-1 text-sm"><Plus size={14} /> إضافة محاضرة</button>
                  </div>
                  {editingCourse.lessons?.map((lesson, lIdx) => (
                    <div key={lesson.id} className="bg-brand-main p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <input type="text" value={lesson.title} onChange={(e) => {
                            const newLessons = [...(editingCourse.lessons || [])];
                            newLessons[lIdx].title = e.target.value;
                            setEditingCourse({...editingCourse, lessons: newLessons});
                          }} className="bg-transparent border-b border-white/10 text-white font-bold outline-none" />
                          <button onClick={() => {
                            const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                            setEditingCourse({...editingCourse, lessons: newLessons});
                          }} className="text-red-400"><Trash size={16}/></button>
                        </div>
                        {/* More detailed lesson editing could be added here */}
                    </div>
                  ))}
               </div>
            </div>
            <div className="p-8 border-t border-white/5 bg-white/5">
              <button onClick={handleSaveCourse} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow">حفظ الكورس</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-10 left-10 z-[250] px-8 py-4 rounded-2xl shadow-2xl animate-fade-in-up border ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          {notification.text}
        </div>
      )}
    </div>
  );
};
