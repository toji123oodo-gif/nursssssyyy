
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Star, Clock, AlertCircle, CheckCircle, XCircle, FileText, HelpCircle, Download, File, Activity, Unlock, Brain, RotateCw, Bot, Send, Sparkles, X, Headphones, Image as ImageIcon, FileType, Music, Pause, Volume2, VolumeX, Maximize2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ContentItem } from '../types';
import { GoogleGenAI } from "@google/genai";

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
      setOpacity(0.2 + Math.random() * 0.3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-50 text-white/20 font-mono text-sm md:text-lg select-none whitespace-nowrap"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        opacity: opacity,
        transform: 'translate(-50%, -50%) rotate(-15deg)',
      }}
    >
      {userPhone}
    </div>
  );
};

const CustomAudioPlayer: React.FC<{ url: string, title: string, userPhone: string }> = ({ url, title, userPhone }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="bg-brand-card p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
            <audio 
                ref={audioRef} 
                src={url} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-brand-main border-4 border-brand-gold/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                    <Music size={40} className={`text-brand-gold ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
                
                <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                </div>

                <div className="w-full flex items-center gap-3">
                    <span className="text-xs text-brand-muted font-mono">{formatTime(currentTime)}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        value={currentTime} 
                        onChange={handleSeek}
                        className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                    <span className="text-xs text-brand-muted font-mono">{formatTime(duration)}</span>
                </div>

                <button 
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-brand-gold text-brand-main flex items-center justify-center hover:scale-105 transition-transform shadow-glow"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
            </div>
            <Watermark userPhone={userPhone} />
        </div>
    );
};

const DocumentViewer: React.FC<{ url: string, type: 'pdf' | 'document', userPhone: string }> = ({ url, type, userPhone }) => {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    return (
        <div className="relative w-full h-[600px] bg-white rounded-2xl overflow-hidden border border-white/10 shadow-xl">
             <iframe src={viewerUrl} className="w-full h-full" frameBorder="0"></iframe>
             <Watermark userPhone={userPhone} />
        </div>
    );
};

const AiChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
        { sender: 'bot', text: 'مرحباً بك! أنا مساعدك الذكي في Nursy. كيف يمكنني مساعدتك اليوم؟' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        const userQuery = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
        setInput('');
        setIsThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userQuery,
                config: {
                    systemInstruction: "أنت مساعد ذكي لمنصة Nursy التعليمية لطلاب التمريض.",
                    temperature: 0.7,
                }
            });
            setMessages(prev => [...prev, { sender: 'bot', text: response.text || "عذراً، حدث خطأ." }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: "خطأ في الاتصال بالذكاء الاصطناعي." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-4 md:left-8 w-[90%] md:w-96 bg-brand-card border border-brand-gold/50 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col h-[450px]">
             <div className="bg-brand-gold p-3 flex justify-between items-center text-brand-main">
                <span className="font-bold flex items-center gap-2"><Bot size={18} /> Nursy AI</span>
                <button onClick={onClose}><X size={16} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-brand-main">
                {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] ${m.sender === 'user' ? 'bg-brand-gold/20 text-brand-gold mr-auto' : 'bg-white/5 text-white ml-auto'}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="p-3 bg-brand-card border-t border-white/5 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-brand-main rounded-full px-4 py-2 text-sm text-white border border-white/10 outline-none" placeholder="اسألني أي شيء..." />
                <button onClick={handleSend} disabled={isThinking} className="w-10 h-10 rounded-full bg-brand-gold text-brand-main flex items-center justify-center"><Send size={18} /></button>
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { user, courses, upgradeToPro } = useApp();
  const [activeCourse, setActiveCourse] = useState(courses[0]); 
  const [activeLesson, setActiveLesson] = useState(activeCourse.lessons[0]);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(activeLesson.contents?.[0] || null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'flashcards'>('content');
  const [showAiChat, setShowAiChat] = useState(false);

  useEffect(() => {
    if (activeLesson.contents?.length > 0) {
        setActiveContent(activeLesson.contents[0]);
    } else {
        setActiveContent(null);
    }
  }, [activeLesson]);

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative min-h-screen">
      {user.subscriptionTier === 'pro' && !showAiChat && (
          <button onClick={() => setShowAiChat(true)} className="fixed bottom-6 left-6 z-40 bg-brand-gold text-brand-main p-4 rounded-full shadow-glow">
              <Bot size={28} />
          </button>
      )}
      {showAiChat && <AiChatWidget onClose={() => setShowAiChat(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex bg-brand-card p-1 rounded-xl border border-white/5 w-fit">
                <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-brand-gold text-brand-main' : 'text-brand-muted'}`}>المحتوى</button>
            </div>
            
            {activeTab === 'content' && activeContent ? (
                <div className="animate-fade-in">
                    {activeContent.type === 'video' && (
                        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                            <iframe className="w-full h-full" src={activeContent.url} frameBorder="0" allowFullScreen></iframe>
                            <Watermark userPhone={user.email} />
                        </div>
                    )}
                    {activeContent.type === 'audio' && <CustomAudioPlayer url={activeContent.url} title={activeContent.title} userPhone={user.email} />}
                    {(activeContent.type === 'pdf' || activeContent.type === 'document') && <DocumentViewer url={activeContent.url} type={activeContent.type} userPhone={user.email} />}
                </div>
            ) : <div className="p-20 text-center text-brand-muted">اختر درساً للبدء</div>}
        </div>

        <div className="space-y-4">
            <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="p-4 bg-black/20 border-b border-white/5">
                    <h3 className="font-bold text-white text-sm">فهرس الكورس</h3>
                </div>
                {activeCourse.lessons.map((lesson, idx) => (
                    <button
                        key={lesson.id}
                        onClick={() => isLessonAccessible(idx) ? setActiveLesson(lesson) : setShowUpgradeModal(true)}
                        className={`w-full flex items-center gap-3 p-4 border-b border-white/5 last:border-0 text-right ${activeLesson.id === lesson.id ? 'bg-brand-gold/5' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold bg-brand-main text-brand-gold">
                            {isLessonAccessible(idx) ? (idx + 1) : <Lock size={14} />}
                        </div>
                        <p className={`text-sm font-bold ${activeLesson.id === lesson.id ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
