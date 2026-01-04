
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../firebase';
import { 
  Search, Filter, Trash2, Shield, Zap, Mail, Smartphone, MoreHorizontal 
} from 'lucide-react';

interface Props {
  users: User[];
  searchTerm: string;
}

export const UsersTab: React.FC<Props> = ({ users, searchTerm }) => {
  const [filter, setFilter] = useState<'all' | 'pro' | 'free'>('all');

  const toggleTier = async (u: User) => {
    const newTier = u.subscriptionTier === 'pro' ? 'free' : 'pro';
    try {
      await db.collection("users").doc(u.id).update({ 
        subscriptionTier: newTier
      });
    } catch (e) { console.error(e); }
  };

  const filtered = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || u.subscriptionTier === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
       {/* Filters Toolbar */}
       <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200">
         <div className="flex gap-1">
           {['all', 'pro', 'free'].map(f => (
             <button 
                key={f} 
                onClick={() => setFilter(f as any)} 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
             >
               {f === 'all' ? 'الكل' : f.toUpperCase()}
             </button>
           ))}
         </div>
         <div className="h-4 w-px bg-gray-200"></div>
         <div className="text-xs text-gray-500">
            {filtered.length} مستخدم
         </div>
       </div>

       {/* Data Table */}
       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">المستخدم</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">معلومات الاتصال</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs">
                        {(u.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {u.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                       <span className="flex items-center gap-2"><Mail size={12}/> {u.email}</span>
                       <span className="flex items-center gap-2"><Smartphone size={12}/> {u.phone || '-'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.subscriptionTier === 'pro' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.subscriptionTier.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => toggleTier(u)} 
                        className="text-brand-blue hover:text-blue-700 text-xs border border-brand-blue px-2 py-1 rounded"
                       >
                         {u.subscriptionTier === 'pro' ? 'إلغاء Pro' : 'ترقية Pro'}
                       </button>
                       <button className="text-gray-400 hover:text-red-600">
                         <Trash2 size={16}/>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
};
