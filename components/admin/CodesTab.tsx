
import React, { useState, useMemo } from 'react';
import { ActivationCode } from '../../types';
import { db } from '../../firebase';
import { Copy, Ticket, CheckCircle, Trash2, Search, Filter, History, Calendar, Hash } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generation Form */}
        <div className="lg:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
           <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Ticket className="text-brand-gold" /> توليد أكواد تفعيل جديدة</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-brand-muted font-black uppercase px-2 tracking-widest flex items-center gap-2"><Hash size={12}/> كمية الأكواد</label>
                <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white font-black focus:border-brand-gold outline-none shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-brand-muted font-black uppercase px-2 tracking-widest flex items-center gap-2"><Calendar size={12}/> صلاحية الاشتراك (يوم)</label>
                <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white font-black focus:border-brand-gold outline-none shadow-inner" />
              </div>
              <div className="flex items-end">
                <button onClick={generate} disabled={isGenerating} className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                  {isGenerating ? 'جاري التوليد...' : 'توليد الأكواد'}
                </button>
              </div>
           </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-xl flex flex-col justify-center">
           <h4 className="text-brand-muted text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-center">إجراءات سريعة</h4>
           <div className="space-y-3">
              <button onClick={deleteUsedCodes} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
                <Trash2 size={16} /> تنظيف الأكواد المستخدمة
              </button>
              <div className="p-4 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                <p className="text-[9px] text-brand-muted font-bold text-center">إجمالي الأكواد المتاحة: {initialCodes.filter(c => !c.isUsed).length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Codes List with Advanced Filter */}
      <div className="bg-brand-card rounded-[3rem] border border-white/5 p-8 space-y-8 shadow-2xl">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
               <input type="text" placeholder="ابحث عن كود محدد..." value={codeSearch} onChange={(e) => setCodeSearch(e.target.value)} className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-3.5 text-white text-xs outline-none focus:border-brand-gold transition-all" />
            </div>
            <div className="flex bg-brand-main p-1 rounded-xl border border-white/5">
               {['all', 'unused', 'used'].map(f => (
                 <button key={f} onClick={() => setStatusFilter(f as any)} className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${statusFilter === f ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>
                   {f === 'unused' ? 'متاحة' : f === 'used' ? 'مستخدمة' : 'الكل'}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto no-scrollbar p-1">
            {filteredCodes.map(c => (
              <div key={c.id} className={`p-5 rounded-2xl border flex items-center justify-between group transition-all duration-300 ${c.isUsed ? 'bg-red-500/5 border-red-500/10 grayscale-[0.8] opacity-50' : 'bg-brand-main border-white/5 hover:border-brand-gold/30 hover:shadow-glow/10'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-mono font-black text-base ${c.isUsed ? 'text-red-400' : 'text-white'}`}>{c.code}</p>
                    {c.isUsed && <History size={12} className="text-red-400" />}
                  </div>
                  <p className="text-[9px] text-brand-muted font-bold tracking-widest uppercase">{c.days} يوم • {new Date(c.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
                {!c.isUsed && (
                  <button onClick={() => {navigator.clipboard.writeText(c.code);}} className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-xl transition-all shadow-sm">
                    <Copy size={16}/>
                  </button>
                )}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
