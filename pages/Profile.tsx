
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Phone, Save, Mail, Smartphone, UserCheck, Loader2, CheckCircle,
  X, Edit2, LogOut, Award
} from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsGrid } from '../components/profile/StatsGrid';

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, phone: user.phone });
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setIsSaving(true);
    try { 
      await updateUserData(formData); 
      setIsEditing(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } 
    catch (error) { console.error("Update failed", error); } 
    finally { setIsSaving(false); }
  };

  const completedCount = user.completedLessons?.length || 0;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8">
       {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-white px-8 py-4 rounded shadow-lg font-bold text-sm flex items-center gap-3 animate-bounce">
            <CheckCircle size={20} /> تم التحديث بنجاح!
          </div>
        )}

      <div className="cf-card p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-[#202020] shadow-md">
            {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
        </div>

        <div className="flex-1 text-center md:text-right space-y-2">
            <h1 className="text-2xl font-bold text-main">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-muted">
            <span>{user.email}</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${user.subscriptionTier === 'pro' ? 'bg-blue-100 dark:bg-blue-900/30 text-brand-blue' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
                {user.subscriptionTier === 'pro' ? 'PRO Plan' : 'Free Plan'}
            </span>
            </div>
        </div>

        <div className="flex gap-3">
            <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn-secondary flex items-center gap-2"
            >
            {isEditing ? <X size={16}/> : <Edit2 size={16}/>}
            {isEditing ? 'إلغاء' : 'تعديل'}
            </button>
            <button onClick={logout} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded text-sm font-medium flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all">
            <LogOut size={16}/> خروج
            </button>
        </div>
      </div>

      {isEditing ? (
          <div className="cf-card p-10">
            <h3 className="text-xl font-bold text-main flex items-center gap-2 mb-8">
              <UserCheck className="text-brand-orange" /> تعديل البيانات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">اسمك الثلاثي</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="cf-input" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">رقم الهاتف</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="cf-input" />
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18}/> حفظ التغييرات</>}
            </button>
          </div>
        ) : (
          <StatsGrid progress={progressPercentage} />
      )}

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cf-card p-6 flex items-center gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded text-brand-orange"><Mail size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-muted uppercase">البريد الإلكتروني</p>
                    <p className="text-main font-semibold">{user.email}</p>
                </div>
            </div>
             <div className="cf-card p-6 flex items-center gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded text-brand-orange"><Smartphone size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-muted uppercase">رقم الهاتف</p>
                    <p className="text-main font-semibold">{user.phone || 'غير مسجل'}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
