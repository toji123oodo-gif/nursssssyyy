
import React from 'react';
import { Trophy, ChevronLeft, TrendingUp } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

interface Props {
  xp: number;
  rank: number;
  streak: number;
}

export const LeaderboardWidget: React.FC<Props> = ({ xp, rank, streak }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
           <Trophy size={18} className="text-yellow-500" /> ترتيبي
        </h4>
        <Link to="/leaderboard" className="text-xs text-gray-400 hover:text-brand-blue flex items-center gap-1">
          عرض الكل <ChevronLeft size={12} />
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
         <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">#{rank}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">الترتيب</span>
         </div>
         <div className="w-px h-8 bg-gray-100"></div>
         <div className="text-center">
            <span className="block text-2xl font-bold text-brand-blue">{xp}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">XP نقاط</span>
         </div>
         <div className="w-px h-8 bg-gray-100"></div>
         <div className="text-center">
            <span className="block text-2xl font-bold text-orange-500">{streak}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">أيام</span>
         </div>
      </div>

      <div className="bg-gray-50 rounded-md p-2 flex items-center gap-2">
         <TrendingUp size={14} className="text-green-600" />
         <p className="text-xs text-gray-600">
            أنت في أعلى <strong>15%</strong> هذا الأسبوع!
         </p>
      </div>
    </div>
  );
};
