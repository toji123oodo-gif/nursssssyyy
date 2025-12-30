import React from 'react';
import { GraduationCap, Activity } from 'lucide-react';

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a192f] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-xl animate-heartbeat"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-brand-card to-[#0a192f] border border-brand-gold/30 rounded-full flex items-center justify-center shadow-2xl relative z-10 animate-heartbeat">
             <GraduationCap className="text-brand-gold w-12 h-12" strokeWidth={1.5} />
          </div>
          
          {/* Orbiting Activity Icon */}
          <div className="absolute top-0 left-0 w-full h-full animate-spin duration-[3000ms]">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-brand-main p-1 rounded-full border border-brand-gold/50 shadow-lg">
                <Activity size={14} className="text-green-400" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black text-white tracking-wider mb-2 animate-fade-in-up">
          Nursy
          <span className="text-brand-gold">.</span>
        </h1>
        <p className="text-brand-muted text-sm tracking-[0.2em] font-bold uppercase animate-fade-in-up delay-100">
          Educational Platform
        </p>

        {/* Custom Progress Bar */}
        <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold to-transparent w-1/2 animate-[shimmer_1.5s_infinite_linear]"></div>
            <div className="h-full bg-brand-gold/80 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>

        {/* Loading Text */}
        <div className="mt-4 text-xs text-brand-muted/50 font-mono animate-pulse">
            جاري تجهيز المنصة...
        </div>
      </div>
    </div>
  );
};