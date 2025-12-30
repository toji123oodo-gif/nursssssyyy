import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Menu, X, User as UserIcon, LogOut, GraduationCap, LayoutDashboard, LogIn, UserPlus, ShieldAlert, Search, LifeBuoy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label, mobileOnly = false }: { to: string; icon: any; label: string; mobileOnly?: boolean }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-bold whitespace-nowrap
        ${mobileOnly ? 'md:hidden w-full py-3' : ''}
        ${isActive(to)
          ? 'bg-brand-gold text-brand-main shadow-glow'
          : 'text-brand-text hover:text-brand-gold hover:bg-white/5'
        }`}
    >
      <Icon size={mobileOnly ? 20 : 18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-brand-main/80 backdrop-blur-md border-b border-white/5 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="bg-gradient-to-br from-brand-gold to-yellow-600 p-2 rounded-xl shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="text-brand-main h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                  <h1 className="font-black text-2xl tracking-wide text-white leading-none">Nursy</h1>
                  <p className="text-[10px] text-brand-gold font-bold tracking-widest mt-0.5">نيرسي للتعليم</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 mx-4 overflow-x-auto no-scrollbar">
              <NavLink to="/" icon={Home} label="الرئيسية" />
              {user && (
                <>
                  <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" />
                  <NavLink to="/wallet" icon={Wallet} label="المحفظة" />
                  <NavLink to="/help" icon={LifeBuoy} label="المساعدة" />
                  {/* Secret Admin Link */}
                  {searchTerm === '1221' && (
                    <NavLink to="/admin" icon={ShieldAlert} label="الأدمن" />
                  )}
                </>
              )}
            </nav>

            {/* Right Side Actions (Search + Profile/Auth) */}
            <div className="hidden md:flex items-center gap-4">
               {/* Search Bar (Secret Trigger) */}
               <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-brand-muted group-focus-within:text-brand-gold transition-colors mr-3" />
                  </div>
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-brand-card/50 border border-white/10 text-white text-sm rounded-full focus:ring-brand-gold focus:border-brand-gold block w-40 pl-10 pr-10 p-2 transition-all focus:w-64 outline-none placeholder:text-brand-muted/50"
                  />
               </div>

               <div className="w-px h-8 bg-white/10 mx-2"></div>

               {user ? (
                 <div className="flex items-center gap-3">
                    <Link to="/profile" className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition-colors group">
                       <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30 group-hover:border-brand-gold">
                          <UserIcon size={16} className="text-brand-gold" />
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                          <p className="text-[10px] text-brand-muted">{user.subscriptionTier === 'pro' ? 'مشترك PRO' : 'طالب مجاني'}</p>
                       </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      title="تسجيل الخروج"
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                 </div>
               ) : (
                 <div className="flex items-center gap-3">
                    <Link to="/login" className="text-white hover:text-brand-gold font-bold text-sm transition-colors">
                      دخول
                    </Link>
                    <Link to="/signup" className="bg-brand-gold hover:bg-brand-goldHover text-brand-main px-5 py-2 rounded-full font-bold text-sm transition-all shadow-glow hover:shadow-glow-hover flex items-center gap-2">
                       <UserPlus size={16} />
                       <span>حساب جديد</span>
                    </Link>
                 </div>
               )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <Link to="/profile" className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
                        <UserIcon size={16} className="text-brand-gold" />
                    </Link>
                )}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-brand-gold transition-colors p-1"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden bg-brand-card/95 backdrop-blur-xl border-t border-white/5 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0'}`}>
           <div className="container mx-auto px-4 space-y-2">
              <div className="mb-4 px-2">
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold"
                  />
              </div>

              <NavLink to="/" icon={Home} label="الرئيسية" mobileOnly />
              {user ? (
                <>
                  <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" mobileOnly />
                  <NavLink to="/wallet" icon={Wallet} label="المحفظة" mobileOnly />
                  <NavLink to="/help" icon={LifeBuoy} label="المساعدة والدعم" mobileOnly />
                  {searchTerm === '1221' && (
                    <NavLink to="/admin" icon={ShieldAlert} label="لوحة الأدمن" mobileOnly />
                  )}
                  <div className="border-t border-white/5 my-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-bold"
                    >
                      <LogOut size={20} />
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-4">
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-brand-main border border-white/10 text-white py-3 rounded-xl font-bold">
                     <LogIn size={18} />
                     دخول
                   </Link>
                   <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-brand-gold text-brand-main py-3 rounded-xl font-bold">
                     <UserPlus size={18} />
                     انشاء حساب
                   </Link>
                </div>
              )}
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full max-w-full overflow-x-hidden">
         {children}
      </main>

    </div>
  );
};