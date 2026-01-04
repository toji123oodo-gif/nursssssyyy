
import React, { useState } from 'react';
import { 
  Users, MessageCircle, UploadCloud, CheckCircle, XCircle, 
  Trash2, Plus, Settings, ShieldAlert, FileText
} from 'lucide-react';
import { UploadRequest, CommunityGroup } from '../../types';

export const CommunitiesTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'groups' | 'posts'>('requests');

  // -- Mock Data --
  const [requests, setRequests] = useState<UploadRequest[]>([
    { id: 'r1', userId: 'u5', userName: 'Karim Ahmed', type: 'pdf', title: 'Microbiology Notes', description: 'Handwritten notes for chapter 3. Drive Link: ...', status: 'pending', timestamp: new Date().toISOString() },
    { id: 'r2', userId: 'u8', userName: 'Mona Zaki', type: 'video', title: 'Practical Exam Tips', description: 'A short video recording.', status: 'pending', timestamp: new Date().toISOString() }
  ]);

  const [groups, setGroups] = useState<CommunityGroup[]>([
    { id: 'g1', name: 'General Nursing', description: 'General discussion', memberCount: 1240 },
    { id: 'g2', name: 'Anatomy Dept', description: 'Skeletal systems', memberCount: 850 },
  ]);

  const [posts, setPosts] = useState([
    { id: 'p1', user: 'User 123', content: 'Is the exam tomorrow?', date: '10 mins ago' },
    { id: 'p2', user: 'Spammer', content: 'Buy cheap crypto now!', date: '1 hour ago' },
  ]);

  // -- Handlers --
  const handleRequestAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  const deletePost = (id: string) => {
    if(confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const deleteGroup = (id: string) => {
    if(confirm('Delete this group? This cannot be undone.')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const addGroup = () => {
    const name = prompt("Group Name:");
    if(name) {
      setGroups([...groups, { id: 'g-'+Date.now(), name, description: 'New Group', memberCount: 0 }]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Sub Navigation */}
      <div className="flex gap-2 bg-white dark:bg-[#1E1E1E] p-2 rounded-lg border border-gray-200 dark:border-[#333] w-fit">
         <button 
           onClick={() => setActiveSubTab('requests')}
           className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeSubTab === 'requests' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
         >
           <UploadCloud size={16}/> Upload Requests <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full">{requests.filter(r => r.status === 'pending').length}</span>
         </button>
         <button 
           onClick={() => setActiveSubTab('groups')}
           className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeSubTab === 'groups' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
         >
           <Users size={16}/> Manage Groups
         </button>
         <button 
           onClick={() => setActiveSubTab('posts')}
           className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeSubTab === 'posts' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
         >
           <ShieldAlert size={16}/> Moderation
         </button>
      </div>

      {/* --- UPLOAD REQUESTS --- */}
      {activeSubTab === 'requests' && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-[#333]">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Content</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                 {requests.filter(r => r.status === 'pending').map(req => (
                    <tr key={req.id}>
                       <td className="px-6 py-4">
                          <p className="text-sm font-bold text-main">{req.userName}</p>
                          <p className="text-xs text-muted">ID: {req.userId}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-sm font-medium text-main">
                             <FileText size={14} className="text-blue-500"/> {req.title}
                          </span>
                          <span className="text-[10px] text-muted uppercase bg-gray-100 dark:bg-[#333] px-1.5 rounded">{req.type}</span>
                       </td>
                       <td className="px-6 py-4 text-sm text-muted max-w-xs truncate">
                          {req.description}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleRequestAction(req.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve & Upload">
                                <CheckCircle size={18}/>
                             </button>
                             <button onClick={() => handleRequestAction(req.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                                <XCircle size={18}/>
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {requests.filter(r => r.status === 'pending').length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-muted">No pending requests.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {/* --- GROUPS --- */}
      {activeSubTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Add New */}
           <button onClick={addGroup} className="border-2 border-dashed border-gray-300 dark:border-[#444] rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Plus size={32} className="mb-2"/>
              <span className="font-bold">Create New Group</span>
           </button>

           {groups.map(group => (
              <div key={group.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl p-6 flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-main">{group.name}</h3>
                    <p className="text-sm text-muted mb-2">{group.description}</p>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">{group.memberCount} Members</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600"><Settings size={18}/></button>
                    <button onClick={() => deleteGroup(group.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* --- MODERATION --- */}
      {activeSubTab === 'posts' && (
         <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl p-6">
            <h3 className="font-bold text-main mb-4">Recent Community Posts</h3>
            <div className="space-y-4">
               {posts.map(post => (
                  <div key={post.id} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-[#252525] rounded-lg">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-sm text-main">{post.user}</span>
                           <span className="text-xs text-muted">{post.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{post.content}</p>
                     </div>
                     <button onClick={() => deletePost(post.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={16}/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}

    </div>
  );
};
