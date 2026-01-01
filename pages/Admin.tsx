
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
  ChevronRight, Play, FileText, PlusCircle, Trash,
  Layers, Video, FileDown, ExternalLink, Copy, Check,
  // Added AlertCircle to fix the "Cannot find name 'AlertCircle'" error
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Data States
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  
  // Modals States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Stats Logic
  const stats = useMemo(() => {
    const activePro = allUsers.filter(u => u.subscriptionTier === 'pro').length;
    return {
      totalStudents: allUsers.length,
      activePro,
      totalIncome: activePro * 50, // افترضنا أن الاشتراك بـ 50 جنيهاً
      totalCourses: courses.length
    };
  }, [allUsers, courses]);

  // Real-time Data Listeners
  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    return () => { unsubUsers(); unsubCodes(); };
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Student Management Logic ---
  const handleUpdateUser = async () => {
    if (!editingUser || !db) return;
    try {
        await db.collection("users").doc(editingUser.id).update(editingUser);
        setIsUserModalOpen(false);
        showNotification('success', 'تم تحديث بيانات الطالب');
    } catch (e) {
        showNotification('error', 'فشل التحديث');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟')) return;
    try {
        await db.collection("users").doc(id).delete();
        showNotification('success', 'تم حذف الطالب');
    } catch (e) {
        showNotification('error', 'فشل الحذف');
    }
  };

  // --- Activation Codes Logic ---
  const generateCodes = async (count: number, days: number) => {
    if (!db) return;
    try {
      const batch = db.batch();
      for (let i = 0; i < count; i++) {
        // توليد كود سهل القراءة
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
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
      showNotification('success', `تم إنشاء ${count} كود بنجاح`);
    } catch (e) {
      showNotification('error', 'فشل العملية');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --- Advanced Course Editor Logic ---
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

  const addLesson = () => {
    const newLesson: Lesson = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
    setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newLesson] }));
  };

  const addContentToLesson = (lessonIdx: number, type: 'video' | 'pdf') => {
    const newContent: ContentItem = { 
        id: 'cnt' + Date.now(), 
        type, 
        title: type === 'video' ? 'رابط فيديو' : 'رابط ملف PDF', 
        url: '' 
    };
    const newLessons = [...(editingCourse?.lessons || [])];
    newLessons[lessonIdx].contents = [...(newLessons[lessonIdx].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: newLessons }));
  };

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-right">
            <h1 className="text-4xl font-black text-white mb-2">إدارة نيرسي</h1>
            <p className="text-brand-muted">مرحباً بك في لوحة التحكم المركزية</p>
          </div>
          <div className="flex bg-brand-card p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
            {[
              {id: 'overview', label: 'الرئيسية', icon: Layout},
              {id: 'users', label: 'الطلاب', icon: Users},
              {id: 'courses', label: 'المحتوى', icon: BookOpen},
              {id: 'codes', label: 'الأكواد', icon: Key}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TABS CONTENT --- */}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5 group hover:border-brand-gold/50 transition-all">
              <Users className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">إجمالي الطلاب</p>
              <h3 className="text-3xl font-black text-white">{stats.totalStudents}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5 group hover:border-green-500/50 transition-all">
              <UserCheck className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">مشتركين PRO</p>
              <h3 className="text-3xl font-black text-white">{stats.activePro}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5 group hover:border-blue-500/50 transition-all">
              <BookOpen className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">عدد الكورسات</p>
              <h3 className="text-3xl font-black text-white">{stats.totalCourses}</h3>
            </div>
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5 group hover:border-brand-gold/50 transition-all">
              <DollarSign className="text-brand-gold shadow-glow mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-brand-muted text-xs font-bold uppercase mb-1">الدخل المتوقع</p>
              <h3 className="text-3xl font-black text-white">{stats.totalIncome} ج.م</h3>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden animate-fade-in shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex gap-4">
               <div className="relative flex-1">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                 <input type="text" placeholder="ابحث عن اسم أو رقم هاتف..." className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:border-brand-gold" onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">الطالب</th>
                    <th className="px-6 py-4">الهاتف</th>
                    <th className="px-6 py-4">العضوية</th>
                    <th className="px-6 py-4">آخر ظهور</th>
                    <th className="px-6 py-4 text-left">تحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.filter(u => u.name.includes(searchTerm) || u.phone.includes(searchTerm)).map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-brand-muted">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 text-brand-muted font-mono">{u.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-brand-muted border border-white/10'}`}>
                          {u.subscriptionTier === 'pro' ? 'PREMIUM' : 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-brand-muted">{u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG') : 'غير متوفر'}</td>
                      <td className="px-6 py-4 text-left space-x-2 space-x-reverse">
                        <button onClick={() => {setEditingUser(u); setIsUserModalOpen(true);}} className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-main rounded-lg transition-all"><Edit size={16}/></button>
                        <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">إدارة المحتوى الدراسي</h2>
                <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-glow hover:scale-105 transition-all">
                  <PlusCircle size={20} /> كورس جديد
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden group hover:border-brand-gold/30 transition-all">
                  <div className="h-44 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent"></div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-3 bg-brand-gold text-brand-main rounded-xl shadow-lg"><Edit size={18}/></button>
                        <button onClick={() => deleteCourse(course.id)} className="p-3 bg-red-500 text-white rounded-xl shadow-lg"><Trash size={18}/></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{course.subject}</span>
                    <h4 className="text-white font-black text-xl mb-2">{course.title}</h4>
                    <div className="flex items-center gap-4 text-brand-muted text-xs">
                        <span className="flex items-center gap-1"><Layers size={14}/> {course.lessons.length} فصل</span>
                        <span className="flex items-center gap-1"><DollarSign size={14}/> {course.price} ج.م</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-brand-card p-10 rounded-[3rem] border border-brand-gold/20 shadow-2xl">
               <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Ticket className="text-brand-gold" /> توليد أكواد تفعيل جديدة</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                  <div className="space-y-3">
                    <label className="text-xs text-brand-muted font-bold block pr-2">عدد الأكواد المطلوبة</label>
                    <input id="code-count" type="number" defaultValue={20} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-gold outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-brand-muted font-bold block pr-2">صلاحية الكود (بالأيام)</label>
                    <input id="code-days" type="number" defaultValue={30} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-gold outline-none" />
                  </div>
                  <button 
                    onClick={() => {
                      const c = Number((document.getElementById('code-count') as HTMLInputElement).value);
                      const d = Number((document.getElementById('code-days') as HTMLInputElement).value);
                      generateCodes(c, d);
                    }}
                    className="bg-brand-gold text-brand-main font-black px-10 py-4.5 rounded-2xl shadow-glow hover:scale-105 transition-all"
                  >إنشاء الأكواد الآن</button>
               </div>
            </div>
            
            <div className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h4 className="text-white font-bold">آخر الأكواد المنشأة</h4>
                  <span className="text-brand-muted text-xs">{activationCodes.length} كود معروض</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                    <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                      <tr>
                        <th className="px-6 py-4">الكود</th>
                        <th className="px-6 py-4">المدة</th>
                        <th className="px-6 py-4">الحالة</th>
                        <th className="px-6 py-4">تاريخ الإنشاء</th>
                        <th className="px-6 py-4 text-left">نسخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activationCodes.map(code => (
                        <tr key={code.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-brand-gold text-lg">{code.code}</td>
                          <td className="px-6 py-4 text-white text-xs font-bold">{code.days} يوم</td>
                          <td className="px-6 py-4">
                            {code.isUsed ? (
                                <div className="flex flex-col">
                                    <span className="text-red-400 text-[10px] font-black uppercase">مستخدم</span>
                                    <span className="text-brand-muted text-[8px]">{code.usedBy?.substring(0,8)}...</span>
                                </div>
                            ) : (
                                <span className="text-green-400 text-[10px] font-black uppercase bg-green-500/10 px-2 py-1 rounded">متاح</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-brand-muted text-[10px]">{new Date(code.createdAt).toLocaleDateString('ar-EG')}</td>
                          <td className="px-6 py-4 text-left">
                            <button onClick={() => copyToClipboard(code.code)} className={`p-2 rounded-lg transition-all ${copiedCode === code.code ? 'bg-green-500 text-white' : 'bg-white/5 text-brand-muted hover:text-white'}`}>
                                {copiedCode === code.code ? <Check size={16}/> : <Copy size={16}/>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODALS --- */}

      {/* Advanced Course Modal */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-md" onClick={() => setIsCourseModalOpen(false)}></div>
          <div className="relative w-full max-w-5xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-2xl font-black text-white">{editingCourse.id ? 'تعديل الكورس' : 'إضافة كورس جديد'}</h3>
               <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-2 rounded-xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-10 no-scrollbar">
               {/* Basic Info Section */}
               <section className="space-y-6">
                  <h4 className="text-brand-gold text-xs font-black uppercase tracking-widest flex items-center gap-2"><Layout size={14}/> البيانات الأساسية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted mr-1">اسم الكورس</label>
                        <input type="text" placeholder="مثلاً: علم التشريح" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted mr-1">المحاضر</label>
                        <input type="text" placeholder="د. أحمد .." value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted mr-1">السعر (ج.م)</label>
                        <input type="number" placeholder="300" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted mr-1">المادة / التخصص</label>
                        <input type="text" placeholder="Anatomy" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs text-brand-muted mr-1">رابط صورة الكورس</label>
                        <input type="text" placeholder="https://..." value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold outline-none" />
                    </div>
                  </div>
               </section>

               {/* Lessons Section */}
               <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-brand-gold text-xs font-black uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> محاضرات الكورس</h4>
                    <button onClick={addLesson} className="bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-gold hover:text-brand-main transition-all flex items-center gap-2"><Plus size={14} /> إضافة فصل جديد</button>
                  </div>
                  
                  <div className="space-y-6">
                    {editingCourse.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="bg-brand-main p-6 rounded-[2rem] border border-white/5 space-y-6 group">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted text-xs font-black">{lIdx + 1}</span>
                            <input type="text" value={lesson.title} onChange={(e) => {
                                const newLessons = [...(editingCourse.lessons || [])];
                                newLessons[lIdx].title = e.target.value;
                                setEditingCourse({...editingCourse, lessons: newLessons});
                            }} className="bg-transparent border-b border-white/10 text-white font-bold outline-none text-lg flex-1 focus:border-brand-gold pb-1" />
                          </div>
                          <button onClick={() => {
                            const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                            setEditingCourse({...editingCourse, lessons: newLessons});
                          }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                        </div>

                        {/* Content inside Lesson */}
                        <div className="pr-12 space-y-4">
                            {lesson.contents?.map((content, cIdx) => (
                                <div key={content.id} className="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3 text-brand-muted">
                                        {content.type === 'video' ? <Video size={16}/> : <FileDown size={16}/>}
                                        <span className="text-[10px] font-bold uppercase">{content.type}</span>
                                    </div>
                                    <input type="text" placeholder="اسم الملف/الفيديو" value={content.title} onChange={(e) => {
                                        const newLessons = [...(editingCourse.lessons || [])];
                                        newLessons[lIdx].contents[cIdx].title = e.target.value;
                                        setEditingCourse({...editingCourse, lessons: newLessons});
                                    }} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-xs text-white flex-1 outline-none" />
                                    <input type="text" placeholder="الرابط (URL)" value={content.url} onChange={(e) => {
                                        const newLessons = [...(editingCourse.lessons || [])];
                                        newLessons[lIdx].contents[cIdx].url = e.target.value;
                                        setEditingCourse({...editingCourse, lessons: newLessons});
                                    }} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-xs text-white flex-[2] outline-none" />
                                    <button onClick={() => {
                                        const newLessons = [...(editingCourse.lessons || [])];
                                        newLessons[lIdx].contents = newLessons[lIdx].contents.filter((_, i) => i !== cIdx);
                                        setEditingCourse({...editingCourse, lessons: newLessons});
                                    }} className="text-brand-muted hover:text-red-400"><X size={14}/></button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <button onClick={() => addContentToLesson(lIdx, 'video')} className="text-[10px] font-bold bg-white/5 px-4 py-2 rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all flex items-center gap-2"><Video size={12}/> إضافة فيديو</button>
                                <button onClick={() => addContentToLesson(lIdx, 'pdf')} className="text-[10px] font-bold bg-white/5 px-4 py-2 rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all flex items-center gap-2"><FileDown size={12}/> إضافة ملف PDF</button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/5">
              <button onClick={handleSaveCourse} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-[1.5rem] shadow-glow hover:scale-[1.01] transition-all text-lg">حفظ كافة التغييرات</button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-md" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-brand-card border border-white/10 rounded-[2.5rem] shadow-2xl p-8 animate-scale-up">
            <h3 className="text-2xl font-black text-white mb-8">تعديل بيانات الطالب</h3>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs text-brand-muted mr-1">الاسم الكامل</label>
                    <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-gold" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-brand-muted mr-1">نوع العضوية</label>
                    <select value={editingUser.subscriptionTier} onChange={e => setEditingUser({...editingUser, subscriptionTier: e.target.value as any})} className="w-full bg-brand-main border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-gold">
                        <option value="free">FREE</option>
                        <option value="pro">PREMIUM / PRO</option>
                    </select>
                </div>
                <div className="pt-4 flex gap-4">
                    <button onClick={handleUpdateUser} className="flex-1 bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow">تحديث</button>
                    <button onClick={() => setIsUserModalOpen(false)} className="flex-1 bg-white/5 text-brand-muted font-bold py-4 rounded-xl">إلغاء</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Notification */}
      {notification && (
        <div className={`fixed bottom-10 left-10 z-[250] px-8 py-4 rounded-2xl shadow-2xl animate-fade-in-up border ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          <div className="flex items-center gap-3 font-bold">
            {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {notification.text}
          </div>
        </div>
      )}
    </div>
  );
};
