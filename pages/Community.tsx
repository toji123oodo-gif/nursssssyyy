
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { ChatMessage, ChatAttachment } from '../types';
import { 
  Send, Users, MessageSquare, Sparkles, Zap, 
  ShieldCheck, Hash, Info, FileText, Mic, 
  Download, Brain, HelpCircle, X, ChevronRight, 
  BookOpen, Plus, Search, Activity, Volume2,
  Lock, Globe, Star, Command, MoreVertical
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SUBJECT_CHANNELS = [
  { id: 'general', name: 'المجلس العام', icon: <Globe size={18}/>, desc: 'نقاشات طلابية عامة' },
  { id: 'anatomy', name: 'تشريح (Anatomy)', icon: <Brain size={18}/>, desc: 'كل ما يخص الهيكل والعضلات' },
  { id: 'physiology', name: 'فسيولوجي (Physiology)', icon: <Zap size={18}/>, desc: 'وظائف الأعضاء الحيوية' },
  { id: 'adult_health', name: 'تمريض بالغين', icon: <BookOpen size={18}/>, desc: 'التمريض الباطني والجراحي' },
  { id: 'exams', name: 'بنك الأسئلة', icon: <HelpCircle size={18}/>, desc: 'مناقشة اختبارات الأعوام السابقة' }
];

export const Community: React.FC = () => {
  const { user } = useApp();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("community_channels")
      .doc(activeChannel)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .limitToLast(100)
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(msgs);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 200);
      });
    return () => unsubscribe();
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !user || isSending) return;

    setIsSending(true);
    const msgData = {
      userId: user.id,
      userName: user.name,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isPro: user.subscriptionTier === 'pro',
      userRole: user.role || 'student',
      attachment: attachment || null
    };

    try {
      await db.collection("community_channels")
        .doc(activeChannel)
        .collection("messages")
        .add(msgData);
      
      setNewMessage('');
      setAttachment(null);
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const askNursyAI = async (questionText: string) => {
    if (!questionText.trim() || aiThinking) return;
    setAiThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `سؤال من طالب تمريض في قناة ${activeChannel}: ${questionText}. قدم إجابة أكاديمية مختصرة ومبسطة باللهجة المصرية.`
      });
      
      // Post AI response to chat
      await db.collection("community_channels").doc(activeChannel).collection("messages").add({
        userId: 'nursy-ai',
        userName: 'نيرسي AI',
        text: response.text,
        timestamp: new Date().toISOString(),
        userRole: 'admin',
        isPro: true
      });
    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setAiThinking(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const isAudio = file.type.startsWith('audio/');

    if (isPdf || isAudio) {
      setAttachment({
        type: isPdf ? 'pdf' : 'audio',
        name: file.name,
        url: URL.createObjectURL(file), // Real apps would use Firebase Storage
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
    } else {
      alert('يرجى رفع ملفات PDF أو ملفات صوتية فقط.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-main relative overflow-hidden flex flex-col p-4 md:p-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full"></div>

      <div className="flex-1 container mx-auto max-w-7xl flex flex-col lg:flex-row gap-6 relative z-10 h-[calc(100vh-140px)]">
        
        {/* Modern Subjects Sidebar */}
        <aside className="lg:w-80 shrink-0 flex flex-col gap-6 h-full overflow-hidden hidden lg:flex">
          <div className="ns-card flex-1 bg-brand-card/40 backdrop-blur-3xl border-white/5 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-white font-black text-xl flex items-center gap-3">
                 <Command size={20} className="text-brand-gold" /> المجتمعات
               </h3>
               <button className="p-2 bg-white/5 rounded-xl text-brand-muted hover:text-white transition-all">
                  <Plus size={18} />
               </button>
            </div>
            
            <div className="space-y-2 overflow-y-auto no-scrollbar pr-1">
              {SUBJECT_CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full group flex flex-col p-4 rounded-2xl transition-all duration-500 border-2 ${
                    activeChannel === ch.id 
                    ? 'bg-brand-gold/10 border-brand-gold shadow-glow' 
                    : 'bg-white/2 border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      activeChannel === ch.id ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-brand-main text-brand-muted group-hover:text-white'
                    }`}>
                      {ch.icon}
                    </div>
                    <span className={`text-sm font-black ${activeChannel === ch.id ? 'text-white' : 'text-brand-muted'}`}>{ch.name}</span>
                  </div>
                  <p className="text-[10px] text-brand-muted/60 pr-14 font-medium text-right line-clamp-1">{ch.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="p-5 bg-gradient-to-br from-brand-gold to-brand-goldHover rounded-3xl text-brand-main shadow-glow relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform">
                    <Sparkles size={64} />
                 </div>
                 <h4 className="font-black text-xs mb-1">فرسان نيرسي PRO</h4>
                 <p className="text-[9px] font-bold opacity-80 mb-3">افتح ميزة الرفع اللامحدود للملفات</p>
                 <button className="w-full py-2 bg-brand-main text-brand-gold rounded-xl font-black text-[10px] uppercase tracking-widest">ترقية الآن</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Futuristic Chat Hub */}
        <main className="flex-1 ns-card bg-brand-card/30 backdrop-blur-3xl border-white/5 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Active Channel Header */}
          <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-brand-main border border-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold shadow-glow">
                   {SUBJECT_CHANNELS.find(c => c.id === activeChannel)?.icon}
                </div>
                <div>
                   <h2 className="text-xl md:text-2xl font-black text-white leading-none mb-2">
                     {SUBJECT_CHANNELS.find(c => c.id === activeChannel)?.name}
                   </h2>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">مجتمع دراسي نشط</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-left px-4 border-l border-white/5">
                   <span className="text-white font-black text-sm">2.4k</span>
                   <span className="text-[8px] text-brand-muted uppercase font-black">طالب متواجد</span>
                </div>
                <button className="p-3 bg-white/5 rounded-xl text-brand-muted hover:text-brand-gold transition-all">
                   <MoreVertical size={20} />
                </button>
             </div>
          </div>

          {/* Chat Stream */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar scroll-smooth"
          >
            {messages.map((msg, idx) => {
              const isOwn = msg.userId === user?.id;
              const isAI = msg.userId === 'nursy-ai';
              
              return (
                <div key={msg.id || idx} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                  <div className={`flex items-start gap-4 max-w-[90%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Futuristic Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xl border-2 transition-all group ${
                      isAI 
                      ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow animate-float' 
                      : (msg.userRole === 'admin' 
                         ? 'bg-red-500 text-white border-red-500/30' 
                         : (msg.isPro 
                            ? 'bg-brand-card text-brand-gold border-brand-gold/30' 
                            : 'bg-brand-card text-brand-muted border-white/5'))
                    }`}>
                      {isAI ? <Sparkles size={20} /> : (msg.userName?.charAt(0) || 'U')}
                    </div>

                    <div className={`space-y-1 ${isOwn ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-2 px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[11px] font-black text-white">{msg.userName}</span>
                        {msg.isPro && <Zap size={10} className="text-brand-gold fill-brand-gold" />}
                        {isAI && <span className="text-[8px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-black uppercase">Official AI</span>}
                      </div>

                      {/* Bubble Design */}
                      <div className={`p-6 rounded-[2.5rem] shadow-2xl relative ${
                        isOwn 
                        ? 'bg-brand-gold text-brand-main rounded-tr-none ns-shadow--premium' 
                        : (isAI 
                           ? 'bg-brand-main border-2 border-brand-gold/40 text-brand-gold rounded-tl-none shadow-glow' 
                           : 'bg-brand-card/50 border border-white/5 text-brand-text rounded-tl-none backdrop-blur-md')
                      }`}>
                        {msg.text && <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                        {/* File Attachment Card */}
                        {msg.attachment && (
                          <div className={`mt-4 p-5 rounded-[1.8rem] flex items-center gap-5 border-2 transition-all ${
                            isOwn 
                            ? 'bg-brand-main/20 border-brand-main/10' 
                            : 'bg-brand-main border-white/10 hover:border-brand-gold/40'
                          }`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                              msg.attachment.type === 'pdf' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                            }`}>
                              {msg.attachment.type === 'pdf' ? <FileText size={28}/> : <Volume2 size={28}/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <p className="text-xs font-black truncate mb-1">{msg.attachment.name}</p>
                               <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">
                                  {msg.attachment.size} • {msg.attachment.type === 'pdf' ? 'Document' : 'Voice Note'}
                               </p>
                            </div>
                            <button className="p-3 bg-brand-main/30 rounded-xl hover:bg-brand-gold hover:text-brand-main transition-all">
                               <Download size={20} />
                            </button>
                          </div>
                        )}

                        {/* Smart AI Action on student messages */}
                        {!isOwn && !isAI && msg.text && msg.text.includes('؟') && (
                          <button 
                            onClick={() => askNursyAI(msg.text)}
                            className="absolute -bottom-3 left-6 bg-brand-main border border-brand-gold text-brand-gold px-4 py-1.5 rounded-full text-[9px] font-black flex items-center gap-2 hover:bg-brand-gold hover:text-brand-main transition-all shadow-glow"
                          >
                            <Brain size={12} /> إسأل نيرسي AI
                          </button>
                        )}
                      </div>
                      
                      <p className={`text-[8px] font-black text-brand-muted uppercase tracking-[0.2em] px-4 mt-2 ${isOwn ? 'text-left' : 'text-right'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {aiThinking && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-brand-gold/10 p-5 rounded-[2.5rem] flex items-center gap-4 border border-brand-gold/20">
                   <div className="flex gap-1">
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                   <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">نيرسي AI يكتب الرد...</span>
                </div>
              </div>
            )}
          </div>

          {/* Attachment Preview (Floating) */}
          {attachment && (
            <div className="mx-10 mb-4 p-5 bg-brand-gold/10 border-2 border-brand-gold/30 rounded-3xl flex items-center justify-between animate-fade-in-up backdrop-blur-3xl">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attachment.type === 'pdf' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>
                    {attachment.type === 'pdf' ? <FileText size={24}/> : <Mic size={24}/>}
                  </div>
                  <div>
                    <p className="text-white text-xs font-black truncate max-w-xs">{attachment.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></span>
                      <p className="text-brand-gold text-[9px] font-black uppercase">جاهز لمشاركة زملائك</p>
                    </div>
                  </div>
               </div>
               <button onClick={() => setAttachment(null)} className="p-3 text-brand-muted hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>
          )}

          {/* Futuristic Control Bar */}
          <div className="p-6 md:p-10 bg-brand-card border-t border-white/5 shrink-0 relative">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-5xl mx-auto">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,audio/*"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 bg-white/5 text-brand-muted rounded-[1.8rem] flex items-center justify-center hover:bg-brand-gold hover:text-brand-main transition-all border border-white/5 shrink-0 group"
              >
                <Plus size={28} className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="أكتب رسالتك الدراسية أو ارفع ملفك..."
                  className="w-full bg-brand-main border-2 border-white/5 rounded-[2.2rem] pr-8 pl-12 py-6 text-white text-sm md:text-base font-bold focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/20 shadow-inner"
                  disabled={isSending}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                   <Activity size={20} className="text-brand-gold" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={(!newMessage.trim() && !attachment) || isSending}
                className="w-16 h-16 bg-brand-gold text-brand-main rounded-[1.8rem] flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
              >
                <Send size={28} className="rotate-180" />
              </button>
            </form>
            <div className="mt-6 flex justify-center gap-8 text-brand-muted text-[8px] font-black uppercase tracking-[0.5em] opacity-30">
               <span>Encrypted Education Network</span>
               <span>Nursy Community v3.0</span>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Subject Button for Mobile */}
      <div className="lg:hidden fixed bottom-28 right-8 z-[200]">
         <button className="w-16 h-16 bg-brand-gold text-brand-main rounded-2xl shadow-glow flex items-center justify-center transform active:scale-90 transition-all">
            <Hash size={32} />
         </button>
      </div>
    </div>
  );
};
