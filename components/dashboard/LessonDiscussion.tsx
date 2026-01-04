
import React from 'react';
import { User, MessageSquare, Heart, Reply } from 'lucide-react';

export const LessonDiscussion: React.FC = () => {
  const mockComments = [
    { id: 1, user: 'أحمد محمود', text: 'الجزء الخاص بعضلات الطرف العلوي فيه تفاصيل كتير، حد معاه ملخص؟', date: 'منذ ساعتين', likes: 5 },
    { id: 2, user: 'د. سارة (معيد)', text: 'تفضل يا أحمد، هتلاقي ملخص في المرفقات رقم 2 بيشرح الموضوع بالرسم.', date: 'منذ ساعة', likes: 12 },
  ];

  return (
    <div className="space-y-6">
      <h4 className="font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare size={18} className="text-gray-400" /> النقاشات
      </h4>

      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
              {(comment.user || 'U').charAt(0)}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 p-3 rounded-lg rounded-tr-none">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-xs font-bold text-gray-900">{comment.user}</span>
                   <span className="text-[10px] text-gray-400">{comment.date}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
              </div>
              <div className="flex gap-4 mt-1 mr-1">
                <button className="text-xs text-gray-500 hover:text-brand-blue flex items-center gap-1 font-medium">
                   <Heart size={12} /> إعجاب ({comment.likes})
                </button>
                <button className="text-xs text-gray-500 hover:text-brand-blue flex items-center gap-1 font-medium">
                   <Reply size={12} /> رد
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <input 
          type="text" 
          placeholder="اكتب تعليقك هنا..."
          className="w-full bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
           <User size={16} />
        </div>
      </div>
    </div>
  );
};
