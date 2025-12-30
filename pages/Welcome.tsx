import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, Sparkles, Star, Zap } from 'lucide-react';

export const Welcome: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(oldProgress + 2, 100);
      });
    }, 50); // 50ms * 50 steps = 2.5 seconds approx duration

    // Redirect after 3.5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a192f] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          
          {/* Floating Particles (Confetti) */}
          {[...Array(20)].map((_, i) => (
             <div 
                key={i}
                className="absolute bg-white/10 rounded-full animate-float"
                style={{
                    width: Math.random() * 10 + 5 + 'px',
                    height: Math.random() * 10 + 5 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 5 + 3 + 's',
                    animationDelay: Math.random() * 2 + 's'
                }}
             />
          ))}
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 text-center px-4 max-w-lg w-full">
        
        {/* Animated Icon */}
        <div className="relative mb-10 mx-auto w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-card to-brand-main rounded-full border border-brand-gold/30 shadow-[0_0_50px_rgba(251,191,36,0.2)] flex items-center justify-center animate-scale-up">
                <GraduationCap size={64} className="text-brand-gold drop-shadow-lg" />
            </div>
            {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin-slow duration-[10s]">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-card p-2 rounded-full border border-white/10 shadow-lg">
                    <Sparkles size={16} className="text-yellow-400" />
                </div>
            </div>
            <div className="absolute inset-0 animate-spin-slow duration-[15s] direction-reverse">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-card p-2 rounded-full border border-white/10 shadow-lg">
                    <Star size={16} className="text-blue-400" />
                </div>
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl text-brand-muted font-light">أهلاً بك مجدداً</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-muted">
                    {user.name.split(' ')[0]}
                </span> 
                <span className="text-brand-gold animate-pulse">.</span>
            </h1>
            <p className="text-brand-muted/80 text-lg max-w-sm mx-auto pt-2">
                رحلتك نحو التفوق والاحتراف تبدأ الآن.
            </p>
        </div>

        {/* Loading Bar */}
        <div className="mt-12 max-w-xs mx-auto">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-brand-gold to-yellow-600 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-75 ease-out rounded-full relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-brand-muted font-mono">
                <span>جاري تجهيز مساحة العمل...</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>

      </div>

      {/* Decorative Quote */}
      <div className="absolute bottom-8 left-0 right-0 text-center animate-fade-in delay-500">
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
              Nursy Educational Platform
          </p>
      </div>

      <style>{`
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .animate-float {
            animation: float linear infinite;
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        .direction-reverse {
            animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};