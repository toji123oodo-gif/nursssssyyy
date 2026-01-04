
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, ContentItem, Question } from '../../types';
import { Plus, Edit2, Trash, X, Save, FileText, Mic, BookOpen } from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  const handleSave = async () => {
    if (!editingCourse?.title) return;
    const courseData = {
        ...editingCourse,
        id: editingCourse.id || 'c' + Date.now(),
        lessons: editingCourse.lessons || []
    } as Course;

    if (editingCourse.id) await updateCourse(courseData);
    else await addCourse(courseData);
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-bold text-gray-900">المحتوى التعليمي</h2>
         <button 
           onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: '', instructor: ''}); setIsModalOpen(true);}} 
           className="btn-primary flex items-center gap-2 text-sm"
         >
           <Plus size={16}/> كورس جديد
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="h-32 bg-gray-100 relative">
               <img src={course.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="p-5 flex-1">
              <h4 className="text-gray-900 font-bold mb-1">{course.title}</h4>
              <p className="text-xs text-gray-500 mb-4">{course.instructor} • {course.lessons.length} درس</p>
              
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} 
                  className="flex-1 btn-secondary text-xs py-1.5 flex justify-center items-center gap-2"
                >
                  <Edit2 size={14}/> تعديل
                </button>
                <button 
                  onClick={() => deleteCourse(course.id)} 
                  className="px-3 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash size={14}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Standard White Modal */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
             <div className="p-5 border-b border-gray-200 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">
                 {editingCourse.id ? 'تعديل الكورس' : 'إنشاء كورس جديد'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>

             <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">عنوان الكورس</label>
                      <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-blue outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">المحاضر</label>
                      <input type="text" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-blue outline-none" />
                   </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-sm text-gray-900">قائمة الدروس</h4>
                      <button 
                        onClick={() => setEditingCourse({...editingCourse, lessons: [...(editingCourse.lessons || []), {id: 'l'+Date.now(), title: 'درس جديد', isLocked: false, contents: []}]})}
                        className="text-brand-blue text-xs font-medium hover:underline flex items-center gap-1"
                      >
                        <Plus size={14}/> إضافة درس
                      </button>
                   </div>
                   
                   <div className="space-y-3">
                      {editingCourse.lessons?.map((lesson, idx) => (
                        <div key={lesson.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                           <div className="flex gap-3 mb-3">
                              <span className="text-gray-400 font-mono text-sm">#{idx+1}</span>
                              <input 
                                type="text" 
                                value={lesson.title} 
                                onChange={e => {
                                  const newLessons = [...editingCourse.lessons!];
                                  newLessons[idx].title = e.target.value;
                                  setEditingCourse({...editingCourse, lessons: newLessons});
                                }}
                                className="flex-1 bg-transparent border-b border-gray-300 text-sm font-medium focus:border-brand-blue outline-none pb-1" 
                                placeholder="عنوان الدرس"
                              />
                              <button 
                                onClick={() => {
                                  const newLessons = [...editingCourse.lessons!];
                                  newLessons.splice(idx, 1);
                                  setEditingCourse({...editingCourse, lessons: newLessons});
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash size={16}/>
                              </button>
                           </div>
                           
                           {/* Simple Content Inputs */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                              <div className="relative">
                                 <Mic className="absolute right-3 top-2.5 text-gray-400" size={14} />
                                 <input 
                                   type="text" 
                                   placeholder="رابط الصوت (MP3)" 
                                   value={lesson.contents.find(c => c.type === 'audio')?.url || ''}
                                   onChange={e => {
                                      // Simple update logic for demo
                                      const newLessons = [...editingCourse.lessons!];
                                      const content = newLessons[idx].contents;
                                      const audioIdx = content.findIndex(c => c.type === 'audio');
                                      if (audioIdx > -1) content[audioIdx].url = e.target.value;
                                      else content.push({id: 'a'+Date.now(), type: 'audio', title: 'Audio', url: e.target.value});
                                      setEditingCourse({...editingCourse, lessons: newLessons});
                                   }}
                                   className="w-full bg-white border border-gray-200 rounded text-xs py-2 pr-9 pl-2 outline-none focus:border-brand-blue"
                                 />
                              </div>
                              <div className="relative">
                                 <FileText className="absolute right-3 top-2.5 text-gray-400" size={14} />
                                 <input 
                                   type="text" 
                                   placeholder="رابط المذكرة (PDF)"
                                   value={lesson.contents.find(c => c.type === 'pdf')?.url || ''}
                                   onChange={e => {
                                      const newLessons = [...editingCourse.lessons!];
                                      const content = newLessons[idx].contents;
                                      const pdfIdx = content.findIndex(c => c.type === 'pdf');
                                      if (pdfIdx > -1) content[pdfIdx].url = e.target.value;
                                      else content.push({id: 'p'+Date.now(), type: 'pdf', title: 'PDF', url: e.target.value});
                                      setEditingCourse({...editingCourse, lessons: newLessons});
                                   }} 
                                   className="w-full bg-white border border-gray-200 rounded text-xs py-2 pr-9 pl-2 outline-none focus:border-brand-blue"
                                 />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-sm">إلغاء</button>
                <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2"><Save size={16}/> حفظ التغييرات</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
