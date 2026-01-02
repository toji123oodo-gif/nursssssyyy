
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../firebase';
import { Sparkles, Trash2, CheckCircle, ShieldAlert, Monitor, Smartphone, Search, Filter, Ban, UserX } from 'lucide-react';

interface Props {
  users: User[];
  searchTerm: string;
}

export const UsersTab: React.FC<Props> = ({ users, searchTerm }) => {
  const [filter, setFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleTier = async (u: User) => {
    const newTier = u.subscriptionTier === 'pro' ? 'free' : 'pro';
    try {
      await db.collection("users").doc(u.id).update({ subscriptionTier: newTier });
      setNotification(`تم تحديث اشتراك ${u.name.split(' ')[0]} بنجاح`);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (u: User) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطالب ${u.name}؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    await db.collection("users").doc(u.id).delete();
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.phone.includes(searchTerm) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || u.subscriptionTier === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-brand-card rounded-[3rem] border border-white/5 p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
       {notification && (
         <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-500/20 text-green-100 px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm backdrop-blur-xl animate-fade-in-up">
           <CheckCircle size={20} /> {notification}
         </div>
       )}

       <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5 shadow-inner">
           {['all', 'pro', 'free'].map(f => (
             <button key={f} onClick={() => setFilter(f as any)} className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>
               {f === 'all' ? 'الكل' : f.toUpperCase()}
             </button>
           ))}
         </div>
         <div className="text-brand-muted text-[10px] font-black uppercase tracking-widest">
           عرض {filtered.length} طالب من إجمالي {users.length}
         </div>
       </div>

       <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right text-white">
            <thead className="text-brand-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="p-6">الطالب والمعلومات</th>
                <th className="p-6">الجهاز المسجل</th>
                <th className="p-6">حالة الاشتراك</th>
                <th className="p-6">آخر ظهور</th>
                <th className="p-6 text-left">إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-main border border-white/5 flex items-center justify-center text-brand-gold font-black group-hover:border-brand-gold/30 transition-all shadow-inner">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-sm text-white group-hover:text-brand-gold transition-colors">{u.name}</p>
                        <p className="text-[10px] text-brand-muted font-mono mt-0.5">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-muted bg-brand-main/50 px-3 py-2 rounded-xl border border-white/5 w-fit">
                      {u.lastDevice?.includes('Android') || u.lastDevice?.includes('iOS') ? <Smartphone size={14} /> : <Monitor size={14} />}
                      {u.lastDevice || 'غير محدد'}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}`}>
                      {u.subscriptionTier.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 text-[10px] text-brand-muted font-mono">
                    {u.lastSeen ? new Date(u.lastSeen).toLocaleDateString('ar-EG') : 'غير متوفر'}
                  </td>
                  <td className="p-6 text-left space-x-2 space-x-reverse">
                    <button onClick={() => toggleTier(u)} title="تغيير الاشتراك" className="p-3 bg-brand-gold/5 text-brand-gold hover:bg-brand-gold hover:text-brand-main rounded-xl transition-all"><Sparkles size={16}/></button>
                    <button onClick={() => deleteUser(u)} title="حذف الطالب" className="p-3 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <UserX size={48} className="mx-auto text-brand-muted opacity-20 mb-4" />
                    <p className="text-brand-muted font-bold">لم يتم العثور على طلاب تطابق البحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};
