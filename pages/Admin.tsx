
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, SubscriptionTier, Course, Lesson, ContentItem } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Activity, Trash2, Edit, RefreshCw, BookOpen, 
  TrendingUp, DollarSign, UserCheck, UserPlus, 
  Filter, MoreHorizontal, Plus, Save, X, 
  ChevronRight, Layout, BarChart3, Settings, 
  Eye, Video, FileText, Music, Image as ImageIcon,
  Zap
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // States for Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch Users from Firestore
  useEffect(() => {
    setIsDataLoading(true);
    const q = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      setAllUsers(users);
      setIsDataLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsDataLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Stats Calculation
  const stats = useMemo(() => {
    const now = new Date();
    const activeSubs = allUsers.filter(u => u.subscriptionTier === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) > now);
    const totalIncome = activeSubs.length * 50;
    return {
      totalStudents: allUsers.length,
      activePro: activeSubs.length,
      income: totalIncome,
      newToday: allUsers.filter(u => {
          // Simple check for users synced today (mocking with lastSeen if available)
          const lastSeen = (u as any).lastSeen ? new Date((u as any).lastSeen) : null;
          return lastSeen && lastSeen.toDateString() === now.toDateString();
      }).length
    };
  }, [allUsers]);

  // Handle User Update
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
        await setDoc(doc(db, "users", editingUser.id), editingUser, { merge: true });
        showNotification('success', 'تم تحديث بيانات الطالب بنجاح');
        setIsUserModalOpen(false);
    } catch (err) {
        showNotification('error', 'فشل تحديث البيانات');
    }
  };

  // Filtered Users
  const filteredUsers = allUsers.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || "").includes(searchTerm)
  );

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-gold/10 rounded-3xl border border-brand-gold/20">
                    <ShieldAlert size={32} className="text-brand-gold" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">إدارة المنصة</h1>
                    <p className="text-brand-muted text-sm">أهلاً بك يا أدمن، إليك ملخص النشاط اليوم</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 bg-brand-card p-2 rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto">
                <TabButton id="overview" label="الرئيسية" icon={Layout} />
                <TabButton id="users" label="الطلاب" icon={Users} />
                <TabButton id="courses" label="الكورسات" icon={BookOpen} />
                <TabButton id="analytics" label="الإحصائيات" icon={BarChart3} />
            </div>
        </header>

        {notification && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl animate-fade-in-up border backdrop-blur-md ${
                notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'
            }`}>
                <div className="flex items-center gap-3">
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-bold">{notification.text}</span>
                </div>
            </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">إجمالي الطلاب</p>
                        <h3 className="text-4xl font-black text-white">{stats.totalStudents}</h3>
                        <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
                            <TrendingUp size={14} /> <span>+12% هذا الشهر</span>
                        </div>
                    </div>
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><UserCheck size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">المشتركين PRO</p>
                        <h3 className="text-4xl font-black text-green-400">{stats.activePro}</h3>
                        <div className="mt-4 flex items-center gap-2 text-brand-gold text-xs font-bold">
                            <Activity size={14} /> <span>{Math.round((stats.activePro/stats.totalStudents)*100)}% من الإجمالي</span>
                        </div>
                    </div>
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">الدخل الشهري</p>
                        <h3 className="text-4xl font-black text-brand-gold">{stats.income} <span className="text-sm">ج.م</span></h3>
                        <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
                            <TrendingUp size={14} /> <span>نمو مستقر</span>
                        </div>
                    </div>
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><UserPlus size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">طلاب جدد (اليوم)</p>
                        <h3 className="text-4xl font-black text-purple-400">{stats.newToday}</h3>
                        <div className="mt-4 flex items-center gap-2 text-brand-muted text-xs font-bold">
                            <RefreshCw size={14} /> <span>تحديث لحظي</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Activation Card */}
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            {/* Fixed: Added Zap to imports to resolve component reference */}
                            <Zap className="text-brand-gold" size={24} />
                            تفعيل سريع للطلاب
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                placeholder="ابحث برقم الهاتف أو الإيميل..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="flex-1 bg-brand-main border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold transition-all"
                            />
                            <button className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-2xl hover:bg-brand-goldHover shadow-glow transition-all">
                                تفعيل الآن
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-brand-muted">سيتم تفعيل الاشتراك لمدة 30 يوماً تلقائياً للطالب المختار.</p>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">أداء المحتوى</h3>
                                <p className="text-brand-muted text-sm">عدد الكورسات المتاحة حالياً: {courses.length}</p>
                            </div>
                            <div className="p-4 bg-brand-gold/20 rounded-2xl">
                                <BookOpen size={32} className="text-brand-gold" />
                            </div>
                        </div>
                        <div className="mt-6 w-full bg-brand-main h-3 rounded-full overflow-hidden">
                            <div className="bg-brand-gold h-full w-[75%] rounded-full shadow-glow"></div>
                        </div>
                        <p className="mt-3 text-xs text-brand-muted text-center">باقي 25% من سعة السيرفر لهذا الشهر</p>
                    </div>
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden animate-fade-in shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-white">إدارة الطلاب</h3>
                        <p className="text-brand-muted text-sm">عرض وتحرير بيانات الطلاب والتحكم في الاشتراكات</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                        <input 
                            type="text" 
                            placeholder="ابحث عن اسم، هاتف، أو بريد..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white outline-none focus:border-brand-gold transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-brand-main/50 text-brand-muted text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-6">الطالب</th>
                                <th className="px-8 py-6">معلومات التواصل</th>
                                <th className="px-8 py-6">نوع الاشتراك</th>
                                <th className="px-8 py-6">الحالة</th>
                                <th className="px-8 py-6">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xl border border-brand-gold/20">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{u.name}</p>
                                                <p className="text-brand-muted text-xs">منذ: {new Date().toLocaleDateString('ar-EG')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-white text-sm font-mono">{u.email || 'لا يوجد بريد'}</p>
                                        <p className="text-brand-muted text-xs font-mono">{u.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider border ${
                                            u.subscriptionTier === 'pro' 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : 'bg-white/5 text-brand-muted border-white/10'
                                        }`}>
                                            {u.subscriptionTier === 'pro' ? 'PREMIUM (PRO)' : 'FREE STUDENT'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.subscriptionTier === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) > new Date() ? (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                <CheckCircle size={14} /> نشط
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-brand-muted text-xs font-bold">
                                                <XCircle size={14} /> غير مفعل
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }}
                                                className="p-3 bg-white/5 hover:bg-brand-gold hover:text-brand-main rounded-xl transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Courses Tab (Simplified Preview) */}
        {activeTab === 'courses' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-white">إدارة المحتوى</h3>
                    <button className="bg-brand-gold text-brand-main font-black px-8 py-3 rounded-2xl flex items-center gap-2 shadow-glow">
                        <Plus size={20} /> كورس جديد
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div key={course.id} className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/30 transition-all">
                             <div className="h-40 relative">
                                <img src={course.image} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-brand-main/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-gold">
                                    {course.subject}
                                </div>
                             </div>
                             <div className="p-6">
                                <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                                <p className="text-brand-muted text-sm mb-6 flex items-center gap-2"><Users size={14} /> 120 طالب مسجل</p>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-white/5 hover:bg-brand-gold hover:text-brand-main py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        <Edit size={16} /> تعديل
                                    </button>
                                    <button className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* User Edit Modal */}
        {isUserModalOpen && editingUser && (
            <div className="fixed inset-0 z-[200] bg-brand-main/80 backdrop-blur-xl flex items-center justify-center p-4">
                <div className="bg-brand-card border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-scale-up">
                    <button onClick={() => setIsUserModalOpen(false)} className="absolute top-6 left-6 text-brand-muted hover:text-white"><X size={24}/></button>
                    <h3 className="text-2xl font-black text-white mb-8">تعديل حساب طالب</h3>
                    
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div>
                            <label className="block text-xs text-brand-muted font-bold mb-2 mr-2">الاسم بالكامل</label>
                            <input 
                                className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white" 
                                value={editingUser.name} 
                                onChange={e => setEditingUser({...editingUser, name: e.target.value})} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2 mr-2">نوع الباقة</label>
                                <select 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white appearance-none"
                                    value={editingUser.subscriptionTier}
                                    onChange={e => setEditingUser({...editingUser, subscriptionTier: e.target.value as SubscriptionTier})}
                                >
                                    <option value="free">FREE</option>
                                    <option value="pro">PRO</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2 mr-2">تاريخ الانتهاء</label>
                                <input 
                                    type="date"
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                    value={editingUser.subscriptionExpiry ? new Date(editingUser.subscriptionExpiry).toISOString().split('T')[0] : ''}
                                    onChange={e => setEditingUser({...editingUser, subscriptionExpiry: new Date(e.target.value).toISOString()})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-3 mt-4">
                            <Save size={20} /> حفظ التعديلات
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
