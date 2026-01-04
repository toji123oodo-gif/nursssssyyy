
import React from 'react';
import { X, Bell, Zap, Calendar, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, title: 'محاضرة جديدة!', desc: 'تمت إضافة "تشريح القلب" في كورس الأناتومي.', date: 'الآن', icon: <Sparkles className="text-blue-600" size={18} /> },
    { id: 2, title: 'تنبيه الاشتراك', desc: 'باقي 3 أيام على انتهاء اشتراك الـ PRO.', date: 'منذ ساعة', icon: <Zap className="text-yellow-500" size={18} /> },
    { id: 3, title: 'تحديث الجدول', desc: 'تعديل موعد امتحان الميكروبيولوجي.', date: 'منذ يوم', icon: <Calendar className="text-purple-500" size={18} /> }
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 z-[150] bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div className={`fixed top-0 left-0 bottom-0 z-[160] w-full max-w-sm bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <Bell size={18} /> الإشعارات
           </h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <div className="p-4 space-y-3 h-full overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                 {n.icon}
              </div>
              <div>
                 <p className="text-sm font-bold text-gray-900">{n.title}</p>
                 <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.desc}</p>
                 <span className="text-[10px] text-gray-400 mt-2 block">{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
