
import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  subject: string;
  title: string;
  progress: number;
}

export const DashboardHeader: React.FC<Props> = ({ subject, title, progress }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <BookOpen size={16} />
        <span>{subject}</span>
      </div>
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <div className="text-right">
           <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">مستوى الإنجاز</span>
           <span className="text-2xl font-bold text-brand-blue">{progress}%</span>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
         <div className="h-full bg-brand-blue" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};
