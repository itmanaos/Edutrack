
import { Student, Classroom, Announcement, MenuDay } from '../types';

export const mockStudents: Student[] = [
  { 
    id: '101', 
    name: 'Ana Silva', 
    classId: '3A', 
    photoUrl: 'https://picsum.photos/id/1011/200', 
    status: 'IN_CLASS', 
    lastAccess: '08:05', 
    birthday: '2008-05-15',
    guardianName: 'Maria Silva',
    guardianPhone: '(11) 91234-5678',
    guardianEmail: 'maria@email.com'
  },
  { 
    id: '102', 
    name: 'Bruno Santos', 
    classId: '3A', 
    photoUrl: 'https://picsum.photos/id/1012/200', 
    status: 'IN_SCHOOL', 
    lastAccess: '07:50', 
    birthday: '2007-11-20',
    guardianName: 'José Santos',
    guardianPhone: '(11) 92345-6789',
    guardianEmail: 'jose@email.com'
  },
  { 
    id: '103', 
    name: 'Carla Oliveira', 
    classId: '2B', 
    photoUrl: 'https://picsum.photos/id/1013/200', 
    status: 'AWAY', 
    lastAccess: '-', 
    birthday: '2009-03-10',
    guardianName: 'Roberta Oliveira',
    guardianPhone: '(11) 93456-7890',
    guardianEmail: 'roberta@email.com'
  },
  { 
    id: '104', 
    name: 'Diego Lima', 
    classId: '3A', 
    photoUrl: 'https://picsum.photos/id/1014/200', 
    status: 'IN_CLASS', 
    lastAccess: '08:15', 
    birthday: '2008-01-01',
    guardianName: 'Carlos Lima',
    guardianPhone: '(11) 94567-8901',
    guardianEmail: 'carlos@email.com'
  },
];

export const mockClassrooms: Classroom[] = [
  { id: '3A', name: 'Sala 301 - Bloco A', capacity: 35, currentCount: 28, teacherId: 'prof1', subject: 'Matemática' },
  { id: '2B', name: 'Laboratório de Física', capacity: 20, currentCount: 15, teacherId: 'prof2', subject: 'Física' },
  { id: '1C', name: 'Sala 105 - Bloco B', capacity: 40, currentCount: 32, teacherId: 'prof3', subject: 'História' },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Reunião de Pais', content: 'Próxima sexta-feira às 19h no auditório principal.', scheduledFor: '2024-05-20', category: 'EVENT' },
  { id: 'a2', title: 'Simulado ENEM', content: 'Inscrições abertas até o final desta semana.', scheduledFor: '2024-05-18', category: 'GENERAL' },
];

export const mockMenu: MenuDay = {
  day: 'Segunda-feira',
  mainDish: 'Arroz com Feijão e Frango Grelhado',
  side: 'Salada de Alface e Tomate',
  dessert: 'Maçã'
};
