
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, Phone, Calendar, Shield, Edit2, LogOut, CheckCircle, Save, X, 
  Clock, Mail, Award, BookOpen, Zap, ShieldCheck, Monitor, 
  Smartphone, UserCheck, Star, Sparkles, ChevronLeft, Loader2, AlertCircle, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return;
    
    setIsSaving(true);
    try {
        await updateUserData(formData);
        setIsEditing(false);
    } catch (error) {
        console.error("Failed to update profile", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
        name: user.name,
        phone: user.phone
    });
    setIsEditing(false);
  };

  const stats = {
    completedLessons: user.completedLessons?.length || 0,
    enrolledCourses: courses.length, // في تطبيق حقيقي سنقوم بفلترة الكورسات المشترك بها فقط
    joinedSince: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('ar-EG') : 'منذ البداية'
  };

  const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : true;

  return (
    <div className="min-h-screen bg-brand-main pb-32 pt-10">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Profile Hero Header */}
        <div className="relative mb-12 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/20 via-transparent to-transparent rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-brand-card border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden group">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-gradient-to-tr from-brand-gold to-yellow-600 p-1.5 shadow-glow relative overflow-hidden group/avatar">
                  <div className="w-full h-full bg-brand-card rounded-[2.2rem] flex items-center justify-center text-brand-gold font-black text-5xl md:text-7xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-brand-card">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>
                {user.subscriptionTier === 'pro' && !isExpired && (
                  <div className="absolute -top-3 -left-3 bg-brand-gold text-brand-main p-2 rounded-2xl animate-bounce-slow shadow-glow border-4 border-brand-card">
                    <Star size={18} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-right space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{user.name}</h1>
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}`}>
                    {user.role === 'admin' ? 'Admin / مدير النظام' : 'Student / طالب'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-brand-muted font-bold text-sm">
                   <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Mail size={16} className="text-brand-gold" /> {user.email}</div>
                   <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Smartphone size={16} className="text-brand-gold" /> {user.phone}</div>
                </div>
              </div>

              <div className="shrink-0 flex gap-4">
                <button onClick={() => setIsEditing(true)} className="p-4 bg-white/5 text-brand-muted hover:text-white border border-white/10 rounded-2xl transition-all hover:bg-white/10 active:scale-95 shadow-xl">
                  <Edit2 size={24} />
                </button>
                <button onClick={logout} className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl transition-all hover:bg-red-500 hover:text-white active:scale-95 shadow-xl">
                  <LogOut size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'كورسات مفعلة', val: stats.enrolledCourses, icon: BookOpen, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
            { label: 'دروس مكتملة', val: stats.completedLessons, icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'منذ انضمامك', val: stats.joinedSince, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((s, i) => (
            <div key={i} className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center gap-6 group hover:border-brand-gold/20 transition-all">
              <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={30} />
              </div>
              <div>
                <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-white">{s.val}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Account Info & Security */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Detailed Info Card */}
            <div className="bg-brand-card rounded-[3.5rem] border border-white/5 p-10 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><UserCheck className="text-brand-gold" size={28} /> البيانات الشخصية</h3>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] pr-2">الاسم بالكامل</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl px-6 py-4.5 text-white text-lg font-black outline-none focus:border-brand-gold transition-all"
                    />
                  ) : (
                    <div className="bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold">{user.name}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] pr-2">رقم الهاتف المسجل</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl px-6 py-4.5 text-white text-lg font-black outline-none focus:border-brand-gold transition-all font-mono"
                    />
                  ) : (
                    <div className="bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono font-bold tracking-widest">{user.phone}</div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                      {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> حفظ التغييرات</>}
                    </button>
                    <button onClick={handleCancel} className="flex-1 bg-white/5 text-brand-muted font-black py-4.5 rounded-2xl border border-white/10 hover:text-white transition-all">إلغاء</button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-brand-card rounded-[3.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
               <Shield className="absolute -bottom-10 -left-10 text-white/5" size={200} />
               <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 relative z-10"><ShieldCheck className="text-brand-gold" size={24} /> مركز الأمان والجلسة</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-muted"><Monitor size={22} /></div>
                    <div>
                      <p className="text-[10px] text-brand-muted font-black uppercase mb-1">آخر جهاز مستخدم</p>
                      <p className="text-white font-bold text-sm">{user.lastDevice || 'غير معروف'}</p>
                    </div>
                  </div>
                  <div className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-muted"><Clock size={22} /></div>
                    <div>
                      <p className="text-[10px] text-brand-muted font-black uppercase mb-1">آخر ظهور</p>
                      <p className="text-white font-bold text-sm">{user.lastSeen ? new Date(user.lastSeen).toLocaleString('ar-EG') : 'الآن'}</p>
                    </div>
                  </div>
               </div>
               <div className="mt-8 p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl">
                  <p className="text-brand-muted text-xs leading-relaxed font-bold">
                    <AlertCircle size={14} className="inline mr-2 text-brand-gold" />
                    حسابك مؤمن بنظام Watermark. يتم تسجيل رقم هاتفك على جميع المحاضرات لحماية خصوصيتك ومنع تسريب المحتوى.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Subscription Detail */}
          <div className="lg:col-span-5 space-y-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Subscription Card */}
            <div className={`rounded-[3.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden h-full ${user.subscriptionTier === 'pro' && !isExpired ? 'bg-gradient-to-br from-brand-gold/20 to-brand-card border border-brand-gold/30' : 'bg-brand-card border border-white/5'}`}>
              {user.subscriptionTier === 'pro' && !isExpired && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold opacity-10 blur-[80px]"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">حالة الاشتراك</h3>
                    <p className="text-brand-muted text-sm font-bold uppercase tracking-widest">{user.subscriptionTier === 'pro' ? 'Nursy Premium Member' : 'Free Learning Mode'}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-glow ${user.subscriptionTier === 'pro' && !isExpired ? 'bg-brand-gold text-brand-main' : 'bg-white/5 text-brand-muted'}`}>
                    <Sparkles size={28} />
                  </div>
                </div>

                {user.subscriptionTier === 'pro' && !isExpired ? (
                  <div className="space-y-10">
                    <div className="bg-brand-main/60 rounded-[2.5rem] p-8 border border-white/5 text-center">
                       <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4">تاريخ انتهاء الصلاحية</p>
                       <div className="flex items-center justify-center gap-4 text-white">
                          <Calendar size={24} className="text-brand-gold" />
                          <span className="text-3xl font-black font-mono tracking-tighter">{expiryDate?.toLocaleDateString('ar-EG')}</span>
                       </div>
                       <div className="mt-8 h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold w-3/4 rounded-full shadow-glow animate-pulse"></div>
                       </div>
                       <p className="mt-4 text-[10px] text-brand-muted font-bold">باقي 22 يوماً على تجديد الاشتراك</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        'وصول كامل لجميع المحاضرات',
                        'تحميل كافة ملفات الـ PDF',
                        'دعم فني خاص للمشتركين',
                        'بدون إعلانات أو فواصل'
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-4 text-white/80 font-bold text-sm">
                           <CheckCircle size={18} className="text-brand-gold shrink-0" />
                           {feat}
                        </div>
                      ))}
                    </div>

                    <Link to="/dashboard" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg">
                       انتقل لمساحة العمل <ChevronLeft size={20} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <p className="text-brand-muted leading-relaxed font-bold">أنت حالياً تستخدم النسخة المجانية. اشترك في نيرسي PRO لفتح جميع المحاضرات والملفات الدراسية حصرياً.</p>
                    <div className="bg-brand-main/60 rounded-[2.5rem] p-8 border border-white/5 text-center flex flex-col items-center">
                       <Zap size={40} className="text-brand-muted opacity-20 mb-4" />
                       <span className="text-xl font-black text-white/50">لا يوجد اشتراك فعال</span>
                    </div>
                    <Link to="/wallet" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg">
                       اشترك الآن في نيرسي PRO <Zap size={20} fill="currentColor" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Helpful Quick Link */}
            <div className="bg-brand-card/50 rounded-[2.5rem] border border-white/5 p-8 flex items-center justify-between group hover:border-brand-gold/30 transition-all cursor-pointer">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-muted group-hover:text-brand-gold transition-colors"><HelpCircle size={22}/></div>
                  <div>
                    <h4 className="text-white font-bold text-sm">هل تحتاج مساعدة؟</h4>
                    <p className="text-brand-muted text-[10px]">تواصل مع فريق الدعم الفني لنيرسي</p>
                  </div>
               </div>
               <Link to="/help" className="p-3 bg-white/5 rounded-xl group-hover:bg-brand-gold group-hover:text-brand-main transition-all">
                  <ChevronLeft size={20} />
               </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
