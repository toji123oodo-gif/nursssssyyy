
import React from 'react';
import { TrendingUp, ShieldCheck, Target } from 'lucide-react';
import { ProgressRing } from '../ProgressRing';

interface Props {
  progress: number;
}

export const StatsGrid: React.FC<Props> = ({ progress }) => {
  const activityData = [45, 80, 55, 95, 70, 90, 100];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Activity Chart */}
      <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
           <TrendingUp size={20} className="text-brand-blue" /> النشاط الأسبوعي
        </h3>
        <div className="flex items-end justify-between gap-4 h-48">
          {activityData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-blue-50 rounded-t-sm relative overflow-hidden transition-all hover:bg-blue-100" style={{ height: `${val}%` }}></div>
              <span className="text-xs text-gray-400 font-medium">{['S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Circle Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center">
         <ProgressRing progress={progress} size={140} />
         <div className="mt-6 text-center">
            <h4 className="font-bold text-gray-900">مستوى الإنجاز العام</h4>
            <p className="text-xs text-gray-500 mt-1">ممتاز! استمر في التقدم</p>
         </div>
      </div>
    </div>
  );
};
