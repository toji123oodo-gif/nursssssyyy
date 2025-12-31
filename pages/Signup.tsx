
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
        await signup(formData.email, formData.password, formData.name, formData.phone, selectedPlan);
        navigate('/dashboard'); // Direct to dashboard
    } catch (err: any) {
        setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-black text-white mb-2">إنشاء حساب جديد</h1>
           <p className="text-brand-muted">ابدأ رحلتك التعليمية مع Nursy</p>
        </div>
        <div className="bg-brand-card border border-white/5 p-10 rounded-3xl shadow-2xl">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">{error}</div>}
            <form onSubmit={handleSignup}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="الاسم بالكامل" />
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="رقم الهاتف" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="البريد الإلكتروني" />
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="كلمة المرور" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl shadow-glow">إنشاء الحساب</button>
            </form>
        </div>
      </div>
    </div>
  );
};
