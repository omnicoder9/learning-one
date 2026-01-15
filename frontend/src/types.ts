export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: QuizOption[];
  hint?: string;
}

export interface LessonContentBlock {
  type: 'text' | 'code' | 'image' | 'quiz';
  content: string;
  language?: string;
  alt_text?: string;
  quiz?: Quiz;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: LessonContentBlock[];
  next_lesson_id?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  total_lessons: number;
  image_url?: string;
  progress?: number;
  current_lesson_id?: string;
}

export interface DashboardData {
  stats: {
    streak: number;
    points: number;
    completed_lessons: number;
  };
  current_course: Course;
  all_courses: Course[];
}
