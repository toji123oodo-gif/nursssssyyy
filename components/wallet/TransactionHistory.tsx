
import React from 'react';
import { History, CheckCircle2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'activation' | 'recharge';
  amount?: number;
  date: string;
  status: 'completed' | 'pending';
}

interface Props {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
         <History size={18} className="text-gray-500" />
         <h3 className="font-bold text-gray-900">سجل المعاملات</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {transactions.length > 0 ? transactions.map((t) => (
          <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
               <div className={`p-2 rounded-full ${t.type === 'recharge' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-brand-blue'}`}>
                  {t.type === 'recharge' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t.type === 'activation' ? 'تفعيل اشتراك' : 'شحن رصيد'}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('ar-EG')}</p>
               </div>
            </div>
            
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">{t.amount ? `${t.amount} ج.م` : '-'}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 rounded">مكتملة</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-12 text-center text-gray-500 text-sm">
             لا توجد معاملات سابقة
          </div>
        )}
      </div>
    </div>
  );
};
