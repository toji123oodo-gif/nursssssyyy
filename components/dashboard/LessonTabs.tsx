
import React from 'react';
import { BookOpen, MessageSquare, Edit3 } from 'lucide-react';

interface Props {
  activeTab: 'resources' | 'discussion' | 'notes';
  setActiveTab: (tab: 'resources' | 'discussion' | 'notes') => void;
}

export const LessonTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'resources', label: 'المصادر', icon: BookOpen },
    { id: 'discussion', label: 'النقاشات', icon: MessageSquare },
    { id: 'notes', label: 'ملاحظاتي', icon: Edit3 },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 flex items-center justify-center gap-2 pb-3 pt-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === tab.id 
            ? 'border-brand-blue text-brand-blue' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};
