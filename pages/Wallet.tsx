
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Camera, MessageCircle, CheckCircle, Clock, CalendarCheck, Copy, 
  Smartphone, Zap, ShieldCheck, ChevronLeft, Info, CreditCard, 
  QrCode, ArrowRightCircle, Shield, Loader2, AlertCircle, HelpCircle, 
  Trophy, Activity, Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

export const Wallet: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'vodafone' | 'instapay' | 'code'>('vodafone');
  const [activationCode, setActivationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const VODAFONE_NUMBER = "01093077151";
  
  const handleActivateByCode = async () => {
    if (!activationCode || !db || !user) return;
    setIsProcessing(true);
    setError('');
    try {
      const query = await db.collection("activation_codes")
        .where("code", "==", activationCode.toUpperCase())
        .where("isUsed", "==", false)
        .limit(1)
        .get();

      if (query.empty) {
        setError('كود التفعيل غير صحيح أو مستخدم مسبقاً');
        setIsProcessing(false);
        return;
      }

      const codeDoc = query.docs[0];
      const codeData = codeDoc.data();
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (codeData.days || 30));

      // 1. Mark code as used
      await db.collection("activation_codes").doc(codeDoc.id).update({
        isUsed: true,
        usedBy: user.id,
        usedAt: new Date().toISOString()
      });

      // 2. Upgrade User
      await updateUserData({
        subscriptionTier: 'pro',
        subscriptionExpiry: expiry.toISOString()
      });

      setSuccess(true);
    } catch (e) {
      setError('حدث خطأ أثناء التفعيل، يرجى المحاولة لاحقاً');
    } finally {
      setIsProcessing(false);
    }
  };

  if (user?.subscriptionTier === 'pro') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-brand-card rounded-[4rem] p-12 max-w-lg w-full text-center border border-green-500/20 animate-scale-up">
            <Trophy className="text-green-500 mx-auto mb-8 animate-bounce-slow" size={64} />
            <h2 className="text-4xl font-black text-white mb-4">أنت الآن عضو PRO!</h2>
            <p className="text-brand-muted mb-8 text-lg">استمتع بالوصول الكامل لمحتوى نيرسي.</p>
            <Link to="/dashboard" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
              ابدأ المذاكرة الآن <ChevronLeft size={20}/>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 md:px-10 flex flex-col items-center">
      <div className="text-center mb-16 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">فعّل حسابك الآن</h1>
        <p className="text-brand-muted text-xl">اختر وسيلة الدفع المناسبة لك وابدأ رحلة التفوق.</p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Method Switcher */}
        <div className="flex bg-brand-card p-2 rounded-[2.5rem] border border-white/5">
          <button onClick={() => setSelectedMethod('vodafone')} className={`flex-1 py-5 rounded-[2rem] font-black transition-all ${selectedMethod === 'vodafone' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>فودافون كاش</button>
          <button onClick={() => setSelectedMethod('code')} className={`flex-1 py-5 rounded-[2rem] font-black transition-all ${selectedMethod === 'code' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>كود تفعيل</button>
        </div>

        {selectedMethod === 'code' ? (
          <div className="bg-brand-card p-10 md:p-14 rounded-[4rem] border border-brand-gold/20 shadow-2xl animate-fade-in">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-brand-gold/10 rounded-3xl flex items-center justify-center text-brand-gold mx-auto mb-6">
                   <Key size={40} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">تفعيل كود مركز نيرسي</h3>
                <p className="text-brand-muted">أدخل الكود المكون من 12 رقماً لتفعيل اشتراكك فوراً</p>
             </div>
             
             {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mb-6 font-bold">{error}</div>}
             {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center mb-6 font-bold">تم التفعيل بنجاح! جاري توجيهك...</div>}

             <div className="space-y-6">
               <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX" 
                value={activationCode}
                onChange={e => setActivationCode(e.target.value.toUpperCase())}
                className="w-full bg-brand-main border-2 border-white/10 rounded-[2rem] px-8 py-6 text-white text-3xl font-mono text-center tracking-widest focus:border-brand-gold outline-none transition-all"
               />
               <button 
                onClick={handleActivateByCode}
                disabled={isProcessing || !activationCode}
                className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow text-xl hover:scale-[1.02] transition-all disabled:opacity-50"
               >
                 {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'تحقق وتفعيل الآن'}
               </button>
             </div>
          </div>
        ) : (
          <div className="bg-brand-card p-10 rounded-[4rem] border border-white/10 animate-fade-in text-center">
             <h3 className="text-3xl font-black text-white mb-6">فودافون كاش</h3>
             <div className="bg-brand-main p-8 rounded-3xl mb-8 flex flex-col items-center">
                <span className="text-brand-muted text-xs font-bold mb-4">رقم التحويل</span>
                <span className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter mb-6">{VODAFONE_NUMBER}</span>
                <button 
                  onClick={() => {navigator.clipboard.writeText(VODAFONE_NUMBER);}}
                  className="bg-brand-gold/10 text-brand-gold px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                ><Copy size={16}/> نسخ الرقم</button>
             </div>
             <p className="text-brand-muted mb-8">بعد التحويل، أرسل الإيصال عبر واتساب لتفعيل الحساب يدوياً خلال دقائق.</p>
             <a href={`https://wa.me/201093077151`} target="_blank" className="w-full bg-[#25D366] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 text-xl shadow-glow">
                <MessageCircle fill="white" /> أرسل الإيصال للتفعيل
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
