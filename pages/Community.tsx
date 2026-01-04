
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { 
  MessageSquare, Image as ImageIcon, FileText, 
  Mic, Heart, Share2, MoreHorizontal, Search, 
  Plus, X, Hash, Globe, Brain, Zap, HelpCircle,
  Send, User as UserIcon
} from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  isPro: boolean;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  attachments: any[];
}

const CHANNELS = [
  { id: 'general', name: 'المجلس العام', icon: Globe },
  { id: 'anatomy', name: 'قسم التشريح', icon: Brain },
  { id: 'physiology', name: 'قسم الفسيولوجي', icon: Zap },
  { id: 'exams', name: 'بنك الأسئلة', icon: HelpCircle }
];

export const Community: React.FC = () => {
  const { user } = useApp();
  const [activeChannel, setActiveChannel] = useState('general');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Mock Data Load (Replace with Firebase Listener in production)
  useEffect(() => {
    // Simulating data fetch
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: 'u1',
        userName: 'د. سارة محمود',
        userRole: 'معيد',
        isPro: true,
        content: 'يا شباب، ده ملخص لأهم نقاط محاضرة الجهاز الدوري. ركزوا على الدورة الدموية الصغرى.',
        timestamp: new Date().toISOString(),
        likes: 24,
        commentsCount: 5,
        attachments: []
      },
      {
        id: '2',
        userId: 'u2',
        userName: 'أحمد علي',
        userRole: 'طالب',
        isPro: false,
        content: 'حد معاه حل أسئلة العملي لدرس العضلات؟',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 2,
        commentsCount: 1,
        attachments: []
      }
    ];
    setPosts(mockPosts);
  }, [activeChannel]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    
    // Simulating Post Creation
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: user?.id || 'guest',
        userName: user?.name || 'مستخدم',
        userRole: 'طالب',
        isPro: user?.subscriptionTier === 'pro',
        content: newPostContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        commentsCount: 0,
        attachments: []
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsPosting(false);
      setIsCreateModalOpen(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in fade-in slide-in-from-bottom-4">
      
      {/* 
          MOBILE: Horizontal Scrollable Channels 
          Shows only on small screens (< lg)
      */}
      <div className="lg:hidden col-span-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2">
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeChannel === channel.id 
                ? 'bg-[#F38020] text-white border-[#F38020] shadow-md shadow-orange-500/20' 
                : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#333]'
              }`}
            >
              <channel.icon size={14} />
              {channel.name}
            </button>
          ))}
        </div>
      </div>

      {/* 
          DESKTOP: Sidebar (Channels) 
          Hidden on mobile, block on large screens
      */}
      <div className="hidden lg:block lg:col-span-1 space-y-6">
        <div className="cf-card overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] dark:border-white/10 bg-gray-50 dark:bg-[#1A1A1A]">
             <h3 className="font-bold text-main text-sm">المجتمعات</h3>
          </div>
          <div className="p-2">
            {CHANNELS.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-1 ${
                  activeChannel === channel.id 
                  ? 'bg-orange-50 dark:bg-brand-orange/10 text-brand-orange' 
                  : 'text-muted hover:bg-gray-50 dark:hover:bg-white/5 hover:text-main'
                }`}
              >
                <channel.icon size={18} />
                {channel.name}
              </button>
            ))}
          </div>
        </div>

        {/* Top Contributors Widget */}
        <div className="cf-card p-4">
           <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">أعلى المساهمين</h3>
           <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2C2C2C] flex items-center justify-center text-xs text-muted">U{i}</div>
                 <div className="flex-1">
                    <p className="text-sm font-medium text-main">مستخدم {i}</p>
                    <p className="text-[10px] text-muted">1.2k نقطة</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Create Post Trigger */}
        <div className="cf-card p-4 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2C2C2C] flex items-center justify-center text-muted">
              <UserIcon size={20} />
           </div>
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="flex-1 text-right bg-gray-50 dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-white/10 rounded-full px-4 py-2.5 text-sm text-muted hover:border-brand-orange/50 transition-colors"
           >
             شارك سؤالك أو معلومة جديدة...
           </button>
           <button className="text-muted hover:text-brand-orange p-2 hidden sm:block">
             <ImageIcon size={20} />
           </button>
        </div>

        {/* Create Post Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E5E5] dark:border-white/10 animate-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-[#E5E5E5] dark:border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-main">إنشاء منشور</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-muted hover:text-main"><X size={20}/></button>
               </div>
               <form onSubmit={handleCreatePost} className="p-4">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="اكتب ما يدور في ذهنك..."
                    className="w-full h-32 bg-transparent resize-none outline-none text-main placeholder:text-muted text-sm"
                    autoFocus
                  ></textarea>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E5E5] dark:border-white/10">
                     <div className="flex gap-2">
                        <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-muted"><ImageIcon size={18}/></button>
                        <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-muted"><FileText size={18}/></button>
                     </div>
                     <button 
                       type="submit" 
                       disabled={isPosting || !newPostContent.trim()}
                       className="btn-primary flex items-center gap-2"
                     >
                       {isPosting ? 'جاري النشر...' : <>نشر <Send size={16}/></>}
                     </button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
           {posts.map(post => (
             <div key={post.id} className="cf-card p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm ${post.isPro ? 'bg-brand-orange' : 'bg-gray-400'}`}>
                         {post.userName.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-main flex items-center gap-2">
                           {post.userName}
                           {post.isPro && <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded">PRO</span>}
                         </h4>
                         <p className="text-xs text-muted">{new Date(post.timestamp).toLocaleDateString('ar-EG')} • {post.userRole}</p>
                      </div>
                   </div>
                   <button className="text-muted hover:text-main"><MoreHorizontal size={18}/></button>
                </div>

                <p className="text-main text-sm leading-relaxed whitespace-pre-wrap mb-4">
                   {post.content}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-[#E5E5E5] dark:border-white/10">
                   <button className="flex items-center gap-2 text-muted hover:text-brand-orange transition-colors text-sm">
                      <Heart size={18} /> {post.likes}
                   </button>
                   <button className="flex items-center gap-2 text-muted hover:text-brand-orange transition-colors text-sm">
                      <MessageSquare size={18} /> {post.commentsCount}
                   </button>
                   <button className="flex items-center gap-2 text-muted hover:text-brand-orange transition-colors text-sm mr-auto">
                      <Share2 size={18} /> مشاركة
                   </button>
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};
