
import React from 'react';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Lesson } from '../../types';

interface Props {
  lessons: Lesson[];
  activeLessonId: string;
  completedLessons: string[];
  onLessonClick: (id: string) => void;
}

export const LessonSidebar: React.FC<Props> = ({ lessons, activeLessonId, completedLessons, onLessonClick }) => {
  const isCompleted = (id: string) => completedLessons.includes(id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-24">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-900 text-sm">محتويات الكورس</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {lessons.map((lesson, idx) => {
          const isActive = activeLessonId === lesson.id;
          return (
            <button 
              key={lesson.id} 
              onClick={() => onLessonClick(lesson.id)} 
              className={`w-full flex items-start gap-3 p-4 text-right transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50/50 border-r-4 border-brand-blue' : 'border-r-4 border-transparent'}`}
            >
              <div className={`mt-0.5 ${isCompleted(lesson.id) ? 'text-green-500' : (isActive ? 'text-brand-blue' : 'text-gray-300')}`}>
                {isCompleted(lesson.id) ? <CheckCircle size={16} /> : (isActive ? <PlayCircle size={16} /> : <Circle size={16} />)}
              </div>
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-gray-700'}`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{lesson.duration || '45m'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
