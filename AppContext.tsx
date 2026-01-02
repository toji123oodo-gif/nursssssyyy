// Import necessary types and the Firestore database instance
import { Course } from './types';
import { db } from './firebase';

const updateCourse = async (course: Course) => {
  // نقوم بإرسال الكائن بالكامل واستبدال الوثيقة في Firestore لضمان تحديث المصفوفات بشكل صحيح
  await db.collection("courses").doc(course.id).set(course);
};

export default updateCourse;