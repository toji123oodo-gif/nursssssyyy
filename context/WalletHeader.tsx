
import React from 'react';
import { Crown, Clock } from 'lucide-react';

interface Props {
  isPro: boolean;
  daysLeft: number;
  expiryDate?: string;
}

export const WalletHeader: React.FC<Props> = ({ isPro, daysLeft, expiryDate }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-2 text-center md:text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider">
          <Crown size={14} /> حالة الحساب
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          اشتراك <span className={isPro ? 'text-brand-blue' : 'text-gray-500'}>{isPro ? 'بريميوم' : 'مجاني'}</span>
        </h2>
        <p className="text-gray-500 text-sm max-w-md">
          {isPro 
            ? `اشتراكك ساري حتى ${new Date(expiryDate!).toLocaleDateString('ar-EG')}.` 
            : 'قم بالترقية الآن للوصول إلى كافة المحتويات والمميزات الحصرية.'}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex flex-col items-center min-w-[200px]">
         <Clock size={32} className={`mb-2 ${isPro ? 'text-brand-blue' : 'text-gray-400'}`} />
         <span className="text-3xl font-bold text-gray-900">{isPro ? daysLeft : 0}</span>
         <span className="text-xs text-gray-500 font-medium uppercase mt-1">يوماً متبقياً</span>
      </div>
    </div>
  );
};
