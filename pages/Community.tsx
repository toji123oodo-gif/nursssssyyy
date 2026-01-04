
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, Image as ImageIcon, FileText, 
  Heart, Share2, MoreHorizontal, Search, 
  Plus, X, Globe, Brain, Zap, HelpCircle,
  Send, User as UserIcon, Users, UploadCloud, MessageCircle
} from 'lucide-react';
import { CommunityGroup, ChatMessage } from '../types';

// Mock Initial Groups
const INITIAL_GROUPS: CommunityGroup[] = [
  { id: 'g1', name: 'General Nursing', description: 'General discussion for all students.', memberCount: 1240, icon: 'Globe' },
  { id: 'g2', name: 'Anatomy Dept', description: 'Deep dives into skeletal and muscular systems.', memberCount: 850, icon: 'Brain' },
  { id: 'g3', name: 'Physiology', description: 'Understanding body functions.', memberCount: 600, icon: 'Zap' },
  { id: 'g4', name: 'Exam Prep', description: 'Past papers and Q&A.', memberCount: 2000, icon: 'HelpCircle' },
  { id: 'g5', name: 'Clinical Practice', description: 'Tips for hospital rotations.', memberCount: 500, icon: 'Activity' },
  { id: 'g6', name: 'Pediatrics', description: 'Child health nursing resources.', memberCount: 320, icon: 'Baby' },
];

export const Community: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'chat' | 'upload'>('feed');
  
  // -- Feed State --
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  
  // -- Chat State --
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', userId: 'u2', userName: 'Dr. Sarah', text: 'Welcome everyone to the general chat!', timestamp: new Date().toISOString(), isAdmin: true },
    { id: 'm2', userId: 'u3', userName: 'Ahmed Ali', text: 'When is the next Anatomy quiz?', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');

  // -- Upload Request State --
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'pdf', description: '' });
  const [requestSent, setRequestSent] = useState(false);

  // Mock Data Load
  useEffect(() => {
    const mockPosts = [
      {
        id: '1',
        userId: 'u1',
        userName: 'Dr. Sarah Mahmoud',
        userRole: 'Tutor',
        isPro: true,
        content: 'Hey everyone, here is a summary of the Circulatory System lecture. Focus on the pulmonary loop.',
        timestamp: new Date().toISOString(),
        likes: 24,
        commentsCount: 5,
      },
      {
        id: '2',
        userId: 'u2',
        userName: 'Ahmed Ali',
        userRole: 'Student',
        isPro: false,
        content: 'Does anyone have the solution for the muscle lab questions?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 2,
        commentsCount: 1,
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      userName: user?.name || 'User',
      userRole: 'Student',
      isPro: user?.subscriptionTier === 'pro',
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      commentsCount: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      userName: user?.name || 'User',
      text: chatInput,
      timestamp: new Date().toISOString()
    };
    setChatMessages([...chatMessages, msg]);
    setChatInput('');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    // In a real app, this would write to Firebase 'upload_requests' collection
    setTimeout(() => {
      setRequestSent(false);
      setUploadForm({ title: '', type: 'pdf', description: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Mobile-Friendly Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide border-b border-gray-200 dark:border-[#333] sticky top-0 bg-[#F9FAFB] dark:bg-[#101010] z-20 pt-2">
        {[
          { id: 'feed', label: 'News Feed', icon: Globe },
          { id: 'groups', label: 'Groups', icon: Users },
          { id: 'chat', label: 'General Chat', icon: MessageCircle },
          { id: 'upload', label: 'Upload Request', icon: UploadCloud },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id 
              ? 'border-[#F38020] text-[#F38020] bg-orange-50/50 dark:bg-[#252525]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB: FEED --- */}
      {activeTab === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post */}
          <div className="cf-card p-4">
             <div className="flex gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2C2C2C] flex items-center justify-center text-muted">
                  <UserIcon size={20} />
               </div>
               <form onSubmit={handleCreatePost} className="flex-1">
                 <textarea 
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder="Share a question or information..."
                   className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#F38020] resize-none h-20"
                 ></textarea>
                 <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                       <button type="button" className="text-muted hover:text-[#F38020]"><ImageIcon size={18}/></button>
                       <button type="button" className="text-muted hover:text-[#F38020]"><FileText size={18}/></button>
                    </div>
                    <button type="submit" disabled={!newPostContent.trim()} className="btn-primary py-1.5 px-4 text-xs rounded-full">Post</button>
                 </div>
               </form>
             </div>
          </div>

          {/* Posts Feed */}
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
                           <p className="text-xs text-muted">{new Date(post.timestamp).toLocaleDateString('en-US')} • {post.userRole}</p>
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
                        <Share2 size={18} /> Share
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* --- TAB: GROUPS --- */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {INITIAL_GROUPS.map(group => (
             <div key={group.id} className="cf-card p-6 flex flex-col items-center text-center hover:border-[#F38020] transition-all group">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center text-[#F38020] mb-4 group-hover:scale-110 transition-transform">
                   {group.icon === 'Brain' ? <Brain size={32}/> : group.icon === 'Zap' ? <Zap size={32}/> : <Globe size={32}/>}
                </div>
                <h3 className="font-bold text-lg text-main mb-2">{group.name}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{group.description}</p>
                <div className="mt-auto w-full">
                   <div className="text-xs text-muted mb-3">{group.memberCount} Members</div>
                   <button className="w-full btn-secondary text-sm">Join Group</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* --- TAB: CHAT --- */}
      {activeTab === 'chat' && (
        <div className="cf-card h-[600px] flex flex-col overflow-hidden">
           <div className="p-4 border-b border-[#E5E5E5] dark:border-[#333] bg-gray-50 dark:bg-[#1A1A1A]">
              <h3 className="font-bold text-main flex items-center gap-2">
                 <MessageCircle size={18} className="text-green-500"/> General Chat
              </h3>
              <p className="text-xs text-muted">Real-time discussions with everyone.</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100/50 dark:bg-[#121212]">
              {chatMessages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-xs font-bold text-main">{msg.userName}</span>
                       {msg.isAdmin && <span className="bg-red-100 text-red-600 text-[10px] px-1 rounded font-bold">ADMIN</span>}
                       <span className="text-[10px] text-muted">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.userId === user?.id ? 'bg-[#F38020] text-white rounded-br-none' : 'bg-white dark:bg-[#2C2C2C] text-main rounded-bl-none shadow-sm'}`}>
                       {msg.text}
                    </div>
                 </div>
              ))}
           </div>

           <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#1E1E1E] flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 cf-input rounded-full"
              />
              <button type="submit" className="p-3 bg-[#F38020] text-white rounded-full hover:bg-orange-600 transition-colors">
                 <Send size={18} />
              </button>
           </form>
        </div>
      )}

      {/* --- TAB: UPLOAD REQUEST --- */}
      {activeTab === 'upload' && (
        <div className="max-w-xl mx-auto">
           {requestSent ? (
              <div className="cf-card p-12 text-center flex flex-col items-center animate-in zoom-in">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-main mb-2">Request Sent!</h3>
                 <p className="text-muted text-sm">Thank you. An administrator will review your file shortly.</p>
                 <button onClick={() => setRequestSent(false)} className="mt-6 text-[#F38020] hover:underline text-sm">Submit another</button>
              </div>
           ) : (
              <div className="cf-card p-6">
                 <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E5E5E5] dark:border-[#333]">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-lg flex items-center justify-center">
                       <UploadCloud size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-main">Submit Content</h3>
                       <p className="text-xs text-muted">Share summaries, videos, or notes with the community.</p>
                    </div>
                 </div>

                 <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-muted uppercase mb-1 block">Title</label>
                       <input 
                         required
                         type="text" 
                         value={uploadForm.title}
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                         className="cf-input" 
                         placeholder="e.g. Anatomy Summary Chapter 1"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-muted uppercase mb-1 block">Type</label>
                       <select 
                         value={uploadForm.type}
                         onChange={e => setUploadForm({...uploadForm, type: e.target.value})}
                         className="cf-input"
                       >
                          <option value="pdf">PDF Document</option>
                          <option value="video">Video Lecture</option>
                          <option value="summary">Written Summary</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-muted uppercase mb-1 block">Description / Link</label>
                       <textarea 
                         required
                         value={uploadForm.description}
                         onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
                         className="cf-input resize-none h-32" 
                         placeholder="Provide a Google Drive link or describe the content..."
                       ></textarea>
                    </div>
                    <div className="pt-2">
                       <button type="submit" className="w-full btn-primary py-3">Submit for Review</button>
                    </div>
                 </form>
              </div>
           )}
        </div>
      )}

    </div>
  );
};
