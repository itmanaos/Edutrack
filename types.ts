
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

export type StudentStatus = 'IN_SCHOOL' | 'IN_CLASS' | 'AWAY' | 'ACTIVE' | 'INACTIVE' | 'LATE' | 'ABSENT';

export interface Student {
  id: string;
  name: string;
  classId: string;
  photoUrl: string;
  status: StudentStatus;
  lastAccess: string;
  birthday?: string; // Format: YYYY-MM-DD
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
  teacherId: string;
  subject: string;
  startTime?: string; // e.g., "08:00"
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  scheduledFor: string;
  category: 'EVENT' | 'URGENT' | 'GENERAL';
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  type: 'CRITICAL' | 'URGENT' | 'INFO';
  timestamp: string;
  target: 'ALL' | 'TEACHERS' | 'PARENTS';
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
