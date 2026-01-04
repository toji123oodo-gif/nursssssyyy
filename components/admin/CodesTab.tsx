
import React, { useState, useMemo } from 'react';
import { ActivationCode } from '../../types';
import { db } from '../../firebase';
import { Copy, Ticket, CheckCircle, Trash2, Search, Filter, History, Calendar, Hash, RefreshCw } from 'lucide-react';

interface Props {
  initialCodes: ActivationCode[];
}

export const CodesTab: React.FC<Props> = ({ initialCodes }) => {
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all');

  const generate = async () => {
    if (count <= 0) return;
    setIsGenerating(true);
    const batch = db.batch();
    for (let i = 0; i < count; i++) {
      const code = 'NR-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
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
    setIsGenerating(false);
  };

  const deleteUsedCodes = async () => {
    if (!window.confirm('هل تريد مسح جميع الأكواد المستخدمة من القائمة؟')) return;
    const used = initialCodes.filter(c => c.isUsed);
    const batch = db.batch();
    used.forEach(c => batch.delete(db.collection("activation_codes").doc(c.id)));
    await batch.commit();
  };

  const filteredCodes = useMemo(() => {
    return initialCodes.filter(c => {
      const matchesSearch = c.code.includes(codeSearch.toUpperCase());
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'used' ? c.isUsed : !c.isUsed);
      return matchesSearch && matchesStatus;
    });
  }, [initialCodes, codeSearch, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
           <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-50 text-brand-blue rounded-md">
                <Ticket size={20} />
              </div>
              <h3 className="font-bold text-gray-900">توليد أكواد تفعيل جديدة</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">الكمية</label>
                <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-blue outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">الصلاحية (يوم)</label>
                <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-blue outline-none" />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={generate} 
                  disabled={isGenerating} 
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Ticket size={16}/>}
                  {isGenerating ? 'جاري التوليد...' : 'توليد الأكواد'}
                </button>
              </div>
           </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
           <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">إجراءات سريعة</h4>
           <div className="space-y-3">
              <button onClick={deleteUsedCodes} className="w-full py-2 px-4 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={16} /> مسح الأكواد المستخدمة
              </button>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 text-center">
                <p className="text-xs text-gray-500">الأكواد المتاحة حالياً</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{initialCodes.filter(c => !c.isUsed).length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Codes List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
            <div className="relative w-full sm:w-64">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="بحث عن كود..." 
                 value={codeSearch} 
                 onChange={(e) => setCodeSearch(e.target.value)} 
                 className="w-full bg-white border border-gray-300 rounded-md pr-9 pl-3 py-2 text-sm outline-none focus:border-brand-blue" 
               />
            </div>
            <div className="flex bg-white p-1 rounded-md border border-gray-200">
               {['all', 'unused', 'used'].map(f => (
                 <button 
                   key={f} 
                   onClick={() => setStatusFilter(f as any)} 
                   className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${statusFilter === f ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                 >
                   {f === 'unused' ? 'متاحة' : f === 'used' ? 'مستخدمة' : 'الكل'}
                 </button>
               ))}
            </div>
         </div>

         <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الكود</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">المدة</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCodes.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-sm font-medium text-gray-900">{c.code}</td>
                    <td className="px-6 py-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.isUsed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                         {c.isUsed ? 'مستخدم' : 'متاح'}
                       </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{c.days} يوم</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="px-6 py-3 text-left">
                      {!c.isUsed && (
                        <button 
                          onClick={() => navigator.clipboard.writeText(c.code)} 
                          className="text-gray-400 hover:text-brand-blue transition-colors"
                          title="نسخ الكود"
                        >
                          <Copy size={16}/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
