
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, ActivationCode } from '../types';
import { db } from '../firebase';
import { 
  Users, BookOpen, Layout, Brain, Ticket, ChevronRight, Search
} from 'lucide-react';

// Import Sub-Components
import { OverviewTab } from '../components/admin/OverviewTab';
import { UsersTab } from '../components/admin/UsersTab';
import { CoursesTab } from '../components/admin/CoursesTab';
import { ExamsTab } from '../components/admin/ExamsTab';
import { CodesTab } from '../components/admin/CodesTab';

export const Admin: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes' | 'exams'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Real-time Data Sync for Shared Data
  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").orderBy("lastSeen", "desc").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    const unsubActivity = db.collection("admin_notifications").orderBy("timestamp", "desc").limit(10).onSnapshot(s => {
      setRecentActivities(s.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => { unsubUsers(); unsubCodes(); unsubActivity(); };
  }, []);

  const SidebarItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow scale-[1.02]' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="text-sm">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="mr-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-main flex">
      {/* 1. Sidebar Navigation */}
      <aside className="w-72 bg-brand-card/30 border-l border-white/5 p-6 flex flex-col hidden lg:flex">
        <div className="mb-12 px-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Nursy <span className="text-brand-gold">Admin</span>
          </h2>
          <p className="text-[10px] text-brand-muted font-bold tracking-[0.2em] mt-1 uppercase">Management System</p>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem id="overview" label="نظرة عامة" icon={Layout} />
          <SidebarItem id="users" label="إدارة الطلاب" icon={Users} />
          <SidebarItem id="courses" label="إدارة المحتوى" icon={BookOpen} />
          <SidebarItem id="exams" label="نتائج الاختبارات" icon={Brain} />
          <SidebarItem id="codes" label="أكواد التفعيل" icon={Ticket} />
        </nav>
      </aside>

      {/* 2. Content Display */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen no-scrollbar">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {activeTab === 'overview' && 'لوحة التحكم'}
                {activeTab === 'users' && 'الطلاب'}
                {activeTab === 'courses' && 'المحتوى'}
                {activeTab === 'exams' && 'الاختبارات'}
                {activeTab === 'codes' && 'الاشتراكات'}
            </h1>
            <div className="relative group hidden sm:block">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
              <input type="text" placeholder="بحث سريع..." className="bg-brand-card border border-white/5 rounded-2xl pr-12 pl-6 py-3 text-white outline-none focus:border-brand-gold/50 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'overview' && <OverviewTab users={allUsers} courses={courses} activities={recentActivities} />}
        {activeTab === 'users' && <UsersTab users={allUsers} searchTerm={searchTerm} />}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'exams' && <ExamsTab users={allUsers} />}
        {activeTab === 'codes' && <CodesTab initialCodes={activationCodes} />}
      </main>
    </div>
  );
};
