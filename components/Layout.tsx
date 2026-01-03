
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Wallet, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, LogIn, 
  ShieldAlert, LifeBuoy, ChevronDown, 
  CreditCard, Calendar, Bell, Languages, ShieldCheck, Zap,
  Settings, UserCircle, ArrowLeft, Sparkles, Search, 
  Menu, X, Bookmark, Flame, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setExamHubOpen, language, toggleLanguage } = useApp();

  const isActive = (path: string) => location.pathname === path;
  
  const adminEmails = ['admin@nursy.com', 'toji123oodo@gmail.com'];
  const isAdmin = user && user.email && adminEmails.includes(user.email);

  const t = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    dashboard: language === 'ar' ? 'مساحة العمل' : 'Dashboard',
    wallet: language === 'ar' ? 'المحفظة' : 'Wallet',
    help: language === 'ar' ? 'المساعدة' : 'Help',
    login: language === 'ar' ? 'دخول' : 'Login',
    admin: language === 'ar' ? 'الإدارة' : 'Admin',
    profile: language === 'ar' ? 'حسابي' : 'Profile',
    search: language === 'ar' ? 'ابحث عن درس أو مذكرة...' : 'Search for lessons...'
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main">
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-8'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`mx-auto max-w-7xl px-4 md:px-8 py-2.5 rounded-[2rem] border transition-all duration-500 flex items-center justify-between gap-4 ${
            isScrolled 
            ? 'bg-brand-main/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[0.99]' 
            : 'bg-brand-main/40 backdrop-blur-md border-white/5'
          }`}>
            
            {/* 1. Logo Section */}
            <Link to="/" className={`flex items-center gap-3 group shrink-0 ${language === 'ar' ? 'order-last' : 'order-first'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-brand-gold blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-brand-gold p-2 rounded-2xl shadow-glow group-hover:rotate-12 transition-all duration-500">
                    <GraduationCap className="text-brand-main h-5 w-5 md:h-7 md:w-7" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="font-black text-xl md:text-3xl text-white tracking-tighter">Nursy<span className="text-brand-gold">.</span></h1>
            </Link>

            {/* 2. Global Search (Desktop Only) */}
            <div className={`hidden lg:flex items-center flex-1 max-w-md mx-6 transition-all duration-500 ${searchFocused ? 'max-w-xl' : 'max-w-md'}`}>
               <div className="relative w-full group">
                  <Search className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${searchFocused ? 'text-brand-gold' : 'text-brand-muted'}`} size={18} />
                  <input 
                    type="text" 
                    placeholder={t.search}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-14 pl-6 text-white text-sm font-bold focus:bg-white/10 focus:border-brand-gold/40 focus:ring-4 focus:ring-brand-gold/5 outline-none transition-all placeholder:text-brand-muted/40"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-[9px] text-brand-muted font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    CTRL + K
                  </div>
               </div>
            </div>

            {/* 3. Action Section */}
            <div className={`flex items-center gap-2 md:gap-5 shrink-0 ${language === 'ar' ? 'order-first' : 'order-last'}`}>
               
               {/* Language Switcher */}
               <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 text-brand-muted hover:text-brand-gold transition-all group">
                 <Languages size={18} className="group-hover:rotate-12 transition-transform" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'EN' : 'AR'}</span>
               </button>

               {user ? (
                 <div className="flex items-center gap-2 md:gap-4">
                    
                    {/* Notification Icon */}
                    <div className="relative" ref={notifRef}>
                      <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-3 rounded-2xl transition-all relative ${isNotificationsOpen ? 'bg-brand-gold/10 text-brand-gold' : 'bg-white/5 text-brand-muted hover:text-white'}`}
                      >
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-gold rounded-full ring-4 ring-brand-main animate-pulse"></span>
                      </button>
                      
                      {isNotificationsOpen && (
                        <div className="absolute top-full mt-6 left-0 md:left-auto md:right-0 w-80 bg-brand-card/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 animate-scale-up z-[200]">
                           <div className="flex justify-between items-center mb-6">
                              <h4 className="text-white font-black text-sm">التنبيهات</h4>
                              <span className="text-[9px] text-brand-gold font-black bg-brand-gold/10 px-2 py-1 rounded-lg">2 جديد</span>
                           </div>
                           <div className="space-y-4">
                              <div className="flex gap-4 items-start p-3 bg-white/5 rounded-2xl border border-white/5">
                                 <div className="w-8 h-8 bg-brand-gold text-brand-main rounded-xl flex items-center justify-center shrink-0"><Zap size={14} fill="currentColor" /></div>
                                 <div>
                                    <p className="text-white text-xs font-bold leading-tight">تفعيل اشتراك PRO</p>
                                    <p className="text-[9px] text-brand-muted mt-1">تم تفعيل حسابك بنجاح، استمتع بالمشاهدة!</p>
                                 </div>
                              </div>
                              <div className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-2xl transition-all">
                                 <div className="w-8 h-8 bg-brand-main text-brand-gold rounded-xl border border-white/10 flex items-center justify-center shrink-0"><Flame size={14} /></div>
                                 <div>
                                    <p className="text-white text-xs font-bold leading-tight">محاضرة جديدة متاحة</p>
                                    <p className="text-[9px] text-brand-muted mt-1">تمت إضافة "علم التشريح 3" في الكورس الخاص بك.</p>
                                 </div>
                              </div>
                           </div>
                           <button className="w-full mt-6 py-3 text-[10px] text-brand-muted font-black uppercase tracking-widest hover:text-white transition-colors">مشاهدة الكل</button>
                        </div>
                      )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`group flex items-center gap-3 p-1 rounded-full border transition-all duration-300 ${
                          isProfileOpen ? 'bg-brand-gold/10 border-brand-gold/40 ring-4 ring-brand-gold/10' : 'bg-white/5 border-white/5'
                        }`}
                      >
                         <div className="hidden md:block pr-3 text-right">
                            <p className="text-xs font-black text-white leading-tight">{user.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-brand-gold font-black uppercase tracking-widest mt-0.5">{isAdmin ? 'ADMIN ACCESS' : `${user.subscriptionTier} STUDENT`}</p>
                         </div>
                         <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-brand-main shadow-lg transition-all duration-500 overflow-hidden relative ${isAdmin ? 'bg-gradient-to-tr from-orange-500 to-brand-gold' : 'bg-brand-gold'}`}>
                            {isAdmin ? <ShieldCheck size={20} fill="currentColor" /> : <span className="text-xl font-black">{user.name.charAt(0)}</span>}
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                      </button>

                      {isProfileOpen && (
                        <div className="absolute top-full mt-6 left-0 md:left-auto md:right-0 w-80 bg-brand-card/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_25px_80px_rgba(0,0,0,0.8)] p-4 animate-scale-up z-[200] overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold to-brand-gold/0"></div>
                          
                          <div className="p-6 border-b border-white/5 mb-2 bg-white/5 rounded-t-[2rem]">
                             <p className="text-white font-black text-sm truncate mb-1">{user.name}</p>
                             <p className="text-[10px] text-brand-muted truncate font-bold">{user.email}</p>
                             <div className="mt-4 flex items-center justify-between bg-brand-main/60 p-3 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2">
                                   <Star size={14} className="text-brand-gold" fill="currentColor" />
                                   <span className="text-[10px] text-white font-black">{user.subscriptionTier.toUpperCase()}</span>
                                </div>
                                <Link to="/wallet" onClick={() => setIsProfileOpen(false)} className="text-[9px] text-brand-gold font-black hover:underline">تطوير</Link>
                             </div>
                          </div>
                          
                          <div className="p-2 space-y-1">
                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between p-4 rounded-[1.5rem] text-brand-muted hover:text-white hover:bg-brand-gold/10 group/item transition-all font-black text-xs">
                               <div className="flex items-center gap-3">
                                  <UserCircle size={20} className="text-brand-gold group-hover/item:scale-110 transition-transform" /> 
                                  <span>{t.profile}</span>
                               </div>
                               <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                            </Link>
                            <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between p-4 rounded-[1.5rem] text-brand-muted hover:text-white hover:bg-brand-gold/10 group/item transition-all font-black text-xs">
                               <div className="flex items-center gap-3">
                                  <LayoutDashboard size={20} className="text-brand-gold group-hover/item:scale-110 transition-transform" /> 
                                  <span>{t.dashboard}</span>
                               </div>
                               <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                            </Link>
                            {isAdmin && (
                              <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between p-4 rounded-[1.5rem] text-brand-muted hover:text-white hover:bg-brand-gold/10 group/item transition-all font-black text-xs">
                                 <div className="flex items-center gap-3">
                                    <Settings size={20} className="text-orange-500 group-hover/item:scale-110 transition-transform" /> 
                                    <span>لوحة الإدارة</span>
                                 </div>
                                 <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                              </Link>
                            )}
                          </div>

                          <div className="mt-4 pt-2 border-t border-white/5 px-2 pb-2">
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center justify-between p-4 rounded-[1.5rem] text-red-400 hover:bg-red-500/10 transition-all font-black text-xs"
                            >
                               <span>تسجيل خروج آمن</span>
                               <LogOut size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exams Quick Access */}
                    <button onClick={() => setExamHubOpen(true)} className="hidden md:flex p-3 bg-white/5 border border-white/5 hover:border-brand-gold/30 rounded-2xl text-brand-muted hover:text-brand-gold transition-all shadow-inner">
                      <Calendar size={20} />
                    </button>
                 </div>
               ) : (
                 <div className="flex items-center gap-3">
                    <Link to="/login" className="px-6 md:px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-gold/50 text-brand-muted hover:text-white font-black text-xs md:text-sm transition-all shadow-inner">
                      {t.login}
                    </Link>
                    <Link to="/signup" className="hidden md:flex px-8 py-3 rounded-2xl bg-brand-gold text-brand-main font-black text-sm shadow-glow hover:scale-105 transition-all">
                      اشترك الآن
                    </Link>
                 </div>
               )}

               {/* Mobile Menu Button (Optional integration) */}
               <button className="lg:hidden p-3 bg-white/5 rounded-2xl text-brand-muted">
                  <Menu size={24} />
               </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col pt-24 md:pt-36">
         {children}
      </main>
    </div>
  );
};
