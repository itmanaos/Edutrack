
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  SECURITY = 'SECURITY',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EARLY_EXIT = 'EARLY_EXIT'
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  photoUrl: string;
  status: 'IN_SCHOOL' | 'IN_CLASS' | 'AWAY';
  lastAccess: string;
  birthday?: string; // Format: MM-DD
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
  teacherId: string;
  subject: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  scheduledFor: string;
  category: 'EVENT' | 'URGENT' | 'GENERAL';
}

export interface MenuDay {
  day: string;
  mainDish: string;
  side: string;
  dessert: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  forecast: { day: string; temp: number; condition: string }[];
}
