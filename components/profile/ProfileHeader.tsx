
import React from 'react';
import { Award, Star, Edit2, LogOut, X } from 'lucide-react';
import { User } from '../../types';

interface Props {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onLogout: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ user, isEditing, onEditToggle, onLogout }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
          {(user.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
          <Award size={16} />
        </div>
      </div>

      <div className="flex-1 text-center md:text-right space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-500">
          <span>{user.email}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${user.subscriptionTier === 'pro' ? 'bg-blue-100 text-brand-blue' : 'bg-gray-100 text-gray-600'}`}>
            {user.subscriptionTier === 'pro' ? 'PRO Plan' : 'Free Plan'}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onEditToggle} 
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-all ${isEditing ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          {isEditing ? <X size={16}/> : <Edit2 size={16}/>}
          {isEditing ? 'إلغاء' : 'تعديل'}
        </button>
        <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-100 transition-all">
          <LogOut size={16}/> خروج
        </button>
      </div>
    </div>
  );
};
