
import React, { useState } from 'react';
import { 
  Users, 
  School, 
  BookOpen, 
  Clock, 
  Plus, 
  Search, 
  MoreVertical,
  CalendarDays,
  X,
  Eye,
  User,
  Info,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Settings,
  ShieldCheck,
  Edit2,
  Trash2,
  Camera,
  UserCheck,
  Smartphone,
  Shield,
  Cake,
  RotateCcw,
  Send,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Loader2,
  Calendar,
  AtSign,
  Hash,
  Award,
  IdCard
} from 'lucide-react';
import { EmergencyAlert, Announcement } from '../types';
import { mockAnnouncements } from '../services/mockData';

type ManagementTab = 'students' | 'classes' | 'teachers' | 'rooms' | 'schedule' | 'communications' | 'announcements';

interface StudentData {
  id: string;
  registrationNumber: string;
  name: string;
  classId: string;
  photoUrl: string;
  birthday: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  status: 'Ativo' | 'Inativo';
}

interface ClassData {
  id: string;
  name: string;
  grade: string;
  shift: string;
  students: number;
  room: string;
}

interface TeacherData {
  id: string;
  name: string;
  subject: string;
  hours: string;
  classesCount: number;
  status: 'Ativo' | 'Em Licença' | 'Inativo';
  email?: string;
  phone?: string;
  photoUrl?: string;
}

interface RoomData {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'Disponível' | 'Em Uso' | 'Manutenção';
}

interface ScheduleEntry {
  day: number; // 1-5 (Seg-Sex)
  slot: number; // 0-3 (Índice do horário)
  subject: string;
  teacherId: string;
  roomId: string;
}

const timeSlots = [
  '07:30 - 08:20',
  '08:20 - 09:10',
  '09:30 - 10:20',
  '10:20 - 11:10'
];

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

interface ManagementProps {
  onAlertTriggered?: (alert: EmergencyAlert) => void;
}

const Management: React.FC<ManagementProps> = ({ onAlertTriggered }) => {
  const [activeSubTab, setActiveSubTab] = useState<ManagementTab>('students');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentData | null>(null);
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassData | null>(null);
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<TeacherData | null>(null);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<RoomData | null>(null);
  const [editingScheduleSlot, setEditingScheduleSlot] = useState<{classId: string, day: number, slot: number} | null>(null);
  
  // Dynamic States
  const [students, setStudents] = useState<StudentData[]>([
    { id: '101', registrationNumber: '20240001', name: 'Ana Silva', classId: '3º Ano A', photoUrl: 'https://picsum.photos/id/1011/200', birthday: '2008-05-15', guardianName: 'Maria Silva', guardianPhone: '(11) 91234-5678', guardianEmail: 'maria@email.com', status: 'Ativo' },
    { id: '102', registrationNumber: '20240002', name: 'Bruno Santos', classId: '3º Ano A', photoUrl: 'https://picsum.photos/id/1012/200', birthday: '2007-11-20', guardianName: 'José Santos', guardianPhone: '(11) 92345-6789', guardianEmail: 'jose@email.com', status: 'Ativo' },
  ]);

  const [classes, setClasses] = useState<ClassData[]>([
    { id: '1', name: '3º Ano A', grade: '3º Ensino Médio', shift: 'Matutino', students: 35, room: 'Sala 301' },
    { id: '2', name: '2º Ano B', grade: '2º Ensino Médio', shift: 'Vespertino', students: 28, room: 'Sala 205' },
    { id: '3', name: '1º Ano C', grade: '1º Ensino Médio', shift: 'Matutino', students: 40, room: 'Laboratório A' },
  ]);

  const [teachers, setTeachers] = useState<TeacherData[]>([
    { id: '1', name: 'Ricardo Mendes', subject: 'Matemática', hours: '40h', classesCount: 4, status: 'Ativo', email: 'ricardo.mendes@escola.com', phone: '(11) 98888-7777', photoUrl: 'https://picsum.photos/id/64/200' },
    { id: '2', name: 'Lúcia Ferreira', subject: 'História', hours: '20h', classesCount: 3, status: 'Ativo', email: 'lucia.ferreira@escola.com', phone: '(11) 97777-6666', photoUrl: 'https://picsum.photos/id/65/200' },
    { id: '3', name: 'Marcos Silva', subject: 'Física', hours: '30h', classesCount: 5, status: 'Em Licença', email: 'marcos.silva@escola.com', phone: '(11) 96666-5555', photoUrl: 'https://picsum.photos/id/66/200' },
  ]);

  const [rooms, setRooms] = useState<RoomData[]>([
    { id: '301', name: 'Sala 301 - Bloco A', type: 'Teórica', capacity: 40, status: 'Disponível' },
    { id: '205', name: 'Sala 205 - Bloco A', type: 'Teórica', capacity: 35, status: 'Em Uso' },
    { id: 'LAB1', name: 'Laboratório de Química', type: 'Prática', capacity: 20, status: 'Em Uso' },
    { id: 'AUD', name: 'Auditório Principal', type: 'Eventos', capacity: 200, status: 'Disponível' },
    { id: 'BIB', name: 'Biblioteca', type: 'Estudo', capacity: 50, status: 'Manutenção' },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const [schedules, setSchedules] = useState<Record<string, ScheduleEntry[]>>({
    '1': [
      { day: 1, slot: 0, subject: 'Matemática', teacherId: '1', roomId: '301' },
      { day: 2, slot: 1, subject: 'Física', teacherId: '3', roomId: '301' }
    ]
  });

  const subTabs = [
    { id: 'students', label: 'Cadastro de Alunos', icon: UserCheck },
    { id: 'classes', label: 'Cadastro de Turmas', icon: School },
    { id: 'teachers', label: 'Cadastro de Professores', icon: Users },
    { id: 'rooms', label: 'Cadastro de Salas', icon: BookOpen },
    { id: 'schedule', label: 'Horário de Aulas', icon: Clock },
    { id: 'announcements', label: 'Mural de Avisos', icon: Megaphone },
    { id: 'communications', label: 'Alertas Push', icon: Send },
  ];

  const handleAddStudent = (newStudent: StudentData) => {
    setStudents([...students, newStudent]);
    setIsStudentModalOpen(false);
  };

  const handleAddClass = (newClass: Omit<ClassData, 'id'>) => {
    const id = (classes.length + 1).toString();
    setClasses([...classes, { ...newClass, id }]);
    setIsClassModalOpen(false);
  };

  const handleAddTeacher = (newTeacher: Omit<TeacherData, 'id' | 'classesCount'>) => {
    const id = (teachers.length + 1).toString();
    setTeachers([...teachers, { ...newTeacher, id, classesCount: 0 }]);
    setIsTeacherModalOpen(false);
  };

  const handleAddRoom = (newRoom: RoomData) => {
    setRooms([...rooms, newRoom]);
    setIsRoomModalOpen(false);
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);
    setIsAnnouncementModalOpen(false);
  };

  const handleRemoveAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleSaveSchedule = (entry: ScheduleEntry) => {
    if (!editingScheduleSlot) return;
    const { classId } = editingScheduleSlot;
    
    const currentSchedule = schedules[classId] || [];
    const filtered = currentSchedule.filter(e => !(e.day === entry.day && e.slot === entry.slot));
    
    setSchedules({
      ...schedules,
      [classId]: [...filtered, entry]
    });
    
    setIsScheduleModalOpen(false);
    setEditingScheduleSlot(null);
  };

  const handleRemoveSchedule = (classId: string, day: number, slot: number) => {
    const currentSchedule = schedules[classId] || [];
    setSchedules({
      ...schedules,
      [classId]: currentSchedule.filter(e => !(e.day === day && e.slot === slot))
    });
  };

  const handleOpenAddModal = () => {
    if (activeSubTab === 'students') setIsStudentModalOpen(true);
    if (activeSubTab === 'classes') setIsClassModalOpen(true);
    if (activeSubTab === 'teachers') setIsTeacherModalOpen(true);
    if (activeSubTab === 'rooms') setIsRoomModalOpen(true);
    if (activeSubTab === 'announcements') setIsAnnouncementModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Sub-navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-8 scrollbar-hide">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as ManagementTab)}
            className={`flex items-center gap-2 pb-4 px-1 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
              activeSubTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Action Bar */}
      {activeSubTab !== 'communications' && (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Buscar em ${subTabs.find(t => t.id === activeSubTab)?.label}...`} 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
          {(activeSubTab !== 'schedule') && (
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar {
                  activeSubTab === 'students' ? 'Aluno' :
                  activeSubTab === 'classes' ? 'Turma' : 
                  activeSubTab === 'teachers' ? 'Professor' : 
                  activeSubTab === 'announcements' ? 'Aviso' : 'Sala'
                }</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {activeSubTab === 'students' && <StudentsList data={students} onViewDetail={setSelectedStudentDetail} />}
        {activeSubTab === 'classes' && <ClassesList data={classes} onViewDetail={setSelectedClassDetail} />}
        {activeSubTab === 'teachers' && <TeachersList data={teachers} onViewDetail={setSelectedTeacherDetail} />}
        {activeSubTab === 'rooms' && <RoomsList data={rooms} onViewDetail={setSelectedRoomDetail} />}
        {activeSubTab === 'schedule' && (
          <ScheduleView 
            classes={classes} 
            teachers={teachers}
            rooms={rooms}
            schedules={schedules}
            onEditSlot={(classId, day, slot) => {
              setEditingScheduleSlot({ classId, day, slot });
              setIsScheduleModalOpen(true);
            }}
            onRemoveSlot={handleRemoveSchedule}
          />
        )}
        {activeSubTab === 'announcements' && (
          <AnnouncementsListView data={announcements} onRemove={handleRemoveAnnouncement} />
        )}
        {activeSubTab === 'communications' && <CommunicationsView onAlertTriggered={onAlertTriggered} />}
      </div>

      {/* Modals */}
      {isStudentModalOpen && (
        <StudentFormModal classes={classes} onClose={() => setIsStudentModalOpen(false)} onSubmit={handleAddStudent} />
      )}
      {isClassModalOpen && (
        <ClassFormModal onClose={() => setIsClassModalOpen(false)} onSubmit={handleAddClass} />
      )}
      {isTeacherModalOpen && (
        <TeacherFormModal onClose={() => setIsTeacherModalOpen(false)} onSubmit={handleAddTeacher} />
      )}
      {isRoomModalOpen && (
        <RoomFormModal onClose={() => setIsRoomModalOpen(false)} onSubmit={handleAddRoom} />
      )}
      {isAnnouncementModalOpen && (
        <AnnouncementFormModal onClose={() => setIsAnnouncementModalOpen(false)} onSubmit={handleAddAnnouncement} />
      )}
      {isScheduleModalOpen && editingScheduleSlot && (
        <ScheduleFormModal 
          day={editingScheduleSlot.day}
          slot={editingScheduleSlot.slot}
          existingEntry={schedules[editingScheduleSlot.classId]?.find(e => e.day === editingScheduleSlot.day && e.slot === editingScheduleSlot.slot)}
          teachers={teachers}
          rooms={rooms}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingScheduleSlot(null);
          }}
          onSubmit={handleSaveSchedule}
        />
      )}
      
      {selectedStudentDetail && (
        <StudentDetailModal student={selectedStudentDetail} onClose={() => setSelectedStudentDetail(null)} />
      )}
      {selectedClassDetail && (
        <ClassDetailModal classData={selectedClassDetail} onClose={() => setSelectedClassDetail(null)} />
      )}
      {selectedTeacherDetail && (
        <TeacherDetailModal teacher={selectedTeacherDetail} onClose={() => setSelectedTeacherDetail(null)} />
      )}
      {selectedRoomDetail && (
        <RoomDetailModal room={selectedRoomDetail} onClose={() => setSelectedRoomDetail(null)} />
      )}
    </div>
  );
};

// --- Announcements Module ---

const AnnouncementsListView = ({ data, onRemove }: { data: Announcement[], onRemove: (id: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aviso / Título</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Conteúdo</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Agendado Para</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(ann => (
          <tr key={ann.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  ann.category === 'URGENT' ? 'bg-rose-100 text-rose-600' :
                  ann.category === 'EVENT' ? 'bg-amber-100 text-amber-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {ann.category === 'URGENT' ? <AlertTriangle className="w-4 h-4" /> : 
                   ann.category === 'EVENT' ? <Calendar className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                </div>
                <span className="font-bold text-slate-800">{ann.title}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-sm text-slate-500 max-w-xs truncate">{ann.content}</p>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
              {new Date(ann.scheduledFor).toLocaleDateString('pt-BR')}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                ann.category === 'URGENT' ? 'bg-rose-100 text-rose-600' :
                ann.category === 'EVENT' ? 'bg-amber-100 text-amber-600' :
                'bg-indigo-100 text-indigo-600'
              }`}>
                {ann.category}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => onRemove(ann.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">Nenhum aviso no mural.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// --- Form Components ---

const AnnouncementFormModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: Announcement) => void }) => {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    category: 'GENERAL',
    scheduledFor: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
    } as Announcement);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Novo Aviso no Mural</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título do Aviso</label>
              <input required type="text" placeholder="Ex: Resultado do Simulado" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'GENERAL', label: 'Geral', color: 'border-indigo-200 bg-indigo-50 text-indigo-600' },
                  { id: 'EVENT', label: 'Evento', color: 'border-amber-200 bg-amber-50 text-amber-600' },
                  { id: 'URGENT', label: 'Urgente', color: 'border-rose-200 bg-rose-50 text-rose-600' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat.id as any})}
                    className={`p-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-tighter transition-all ${
                      formData.category === cat.id ? cat.color : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Conteúdo da Mensagem</label>
              <textarea required rows={3} placeholder="Descreva o aviso que aparecerá no dashboard..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data de Exibição</label>
              <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.scheduledFor} onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg">Publicar Aviso</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommunicationsView = ({ onAlertTriggered }: { onAlertTriggered?: (alert: EmergencyAlert) => void }) => {
  const [alertForm, setAlertForm] = useState<Partial<EmergencyAlert>>({
    title: '',
    message: '',
    type: 'URGENT',
    target: 'ALL'
  });
  const [sendingStatus, setSendingStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [progress, setProgress] = useState(0);

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.message) return;

    setSendingStatus('SENDING');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSendingStatus('SENT');
          
          if (onAlertTriggered) {
            onAlertTriggered({
              id: Date.now().toString(),
              title: alertForm.title!,
              message: alertForm.message!,
              type: alertForm.type as any,
              timestamp: new Date().toISOString(),
              target: alertForm.target as any
            });
          }

          setTimeout(() => {
            setSendingStatus('IDLE');
            setAlertForm({ title: '', message: '', type: 'URGENT', target: 'ALL' });
          }, 3000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-300">
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Send className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Disparo de Alertas Push</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Envie alertas críticos diretamente para os dispositivos móveis de pais e professores. Estes alertas geram notificações de tela cheia no aplicativo EduTrack Mobile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Compor Alerta Emergencial</h4>
          <form onSubmit={handleSendAlert} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Gravidade do Alerta</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'CRITICAL', label: 'Crítico', color: 'border-rose-200 text-rose-600 bg-rose-50', icon: AlertTriangle },
                  { id: 'URGENT', label: 'Urgente', color: 'border-amber-200 text-amber-600 bg-amber-50', icon: Info },
                  { id: 'INFO', label: 'Informativo', color: 'border-slate-200 text-slate-600 bg-slate-50', icon: Megaphone },
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAlertForm({ ...alertForm, type: type.id as any })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      alertForm.type === type.id ? type.color : 'border-slate-50 bg-slate-50 text-slate-400 opacity-60'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Destinatários</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                value={alertForm.target}
                onChange={(e) => setAlertForm({...alertForm, target: e.target.value as any})}
              >
                <option value="ALL">Toda a Comunidade (Alunos, Pais, Equipe)</option>
                <option value="PARENTS">Apenas Pais e Responsáveis</option>
                <option value="TEACHERS">Apenas Equipe e Professores</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Título do Alerta</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Suspensão de Aula - Fortes Chuvas"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={alertForm.title}
                onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem (Corpo da Notificação Push)</label>
              <textarea 
                required
                rows={4}
                placeholder="Descreva o motivo e as orientações para os destinatários..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                value={alertForm.message}
                onChange={(e) => setAlertForm({...alertForm, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={sendingStatus !== 'IDLE'}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-lg ${
                alertForm.type === 'CRITICAL' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 
                alertForm.type === 'URGENT' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 
                'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              } disabled:opacity-50 active:scale-95`}
            >
              {sendingStatus === 'IDLE' && (
                <>
                  <Send className="w-5 h-5" />
                  <span>Disparar Alerta Agora</span>
                </>
              )}
              {sendingStatus === 'SENDING' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando em Lote ({progress}%)</span>
                </>
              )}
              {sendingStatus === 'SENT' && (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Alertas Enviados!</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Visualização da Notificação Push</h4>
              
              <div className="max-w-xs mx-auto space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl animate-pulse">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="p-1.5 bg-indigo-600 rounded-md">
                        <BookOpen className="w-3 h-3 text-white" />
                     </div>
                     <span className="text-[10px] font-bold text-slate-300">EDUTRACK • AGORA</span>
                   </div>
                   <h5 className="text-sm font-bold">{alertForm.title || "Título do Alerta"}</h5>
                   <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{alertForm.message || "Corpo da mensagem que aparecerá na tela de bloqueio dos usuários..."}</p>
                </div>
                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">iOS / Android Lockscreen Mockup</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StudentFormModal = ({ classes, onClose, onSubmit }: { classes: ClassData[], onClose: () => void, onSubmit: (data: StudentData) => void }) => {
  const [formData, setFormData] = useState<StudentData>({
    id: '',
    registrationNumber: '',
    name: '',
    classId: '',
    photoUrl: '',
    birthday: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    status: 'Ativo'
  });
  const [isCapturing, setIsCapturing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photoUrl) {
      alert("A foto para reconhecimento facial é obrigatória.");
      return;
    }
    onSubmit({ ...formData, id: formData.id || Math.floor(Math.random() * 9000 + 1000).toString() });
  };

  const simulatePhotoCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setFormData({ ...formData, photoUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200` });
      setIsCapturing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Novo Cadastro de Aluno</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
               <label className="block text-sm font-bold text-slate-700 mb-1">Reconhecimento Facial</label>
               <div className="relative group">
                 <div className={`aspect-square w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative transition-all ${formData.photoUrl ? 'border-indigo-400' : ''}`}>
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Biometria" />
                    ) : (
                      <div className="text-center p-4">
                        <Camera className={`w-10 h-10 mx-auto mb-2 ${isCapturing ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">Capturar Biometria</p>
                      </div>
                    )}
                    {isCapturing && (
                      <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                 </div>
                 <button type="button" onClick={simulatePhotoCapture} className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                   <RotateCcw className="w-3 h-3" />
                   {formData.photoUrl ? 'Trocar Foto' : 'Capturar Agora'}
                 </button>
               </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-100 pb-2">Dados Acadêmicos</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                      <input required type="text" placeholder="Nome do estudante" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Número de Matrícula</label>
                      <input required type="text" placeholder="Ex: 20240001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nascimento</label>
                      <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Turma Destino</label>
                      <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})}>
                        <option value="">Selecione...</option>
                        {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest border-b border-emerald-100 pb-2">Dados do Responsável</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Responsável Legal</label>
                    <input required type="text" placeholder="Nome do pai/mãe/tutor" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.guardianName} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Telefone Celular</label>
                      <input required type="tel" placeholder="(11) 99999-9999" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.guardianPhone} onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email para Avisos</label>
                      <input required type="email" placeholder="responsavel@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.guardianEmail} onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">Salvar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentsList = ({ data, onViewDetail }: { data: StudentData[], onViewDetail: (item: StudentData) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aluno</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Matrícula</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Turma</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={item.photoUrl} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" alt={item.name} />
                <span className="font-bold text-slate-800">{item.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-bold">{item.registrationNumber}</td>
            <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.classId}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onViewDetail(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm border border-indigo-100"><Eye className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ClassesList = ({ data, onViewDetail }: { data: ClassData[], onViewDetail: (item: ClassData) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Nome da Turma</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Série</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Turno</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Alunos</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Sala Vinculada</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.grade}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                item.shift === 'Matutino' ? 'bg-amber-50 text-amber-600' :
                item.shift === 'Vespertino' ? 'bg-indigo-50 text-indigo-600' :
                'bg-slate-800 text-white'
              }`}>{item.shift}</span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.students}</td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.room}</td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onViewDetail(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Eye className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TeachersList = ({ data, onViewDetail }: { data: TeacherData[], onViewDetail: (t: TeacherData) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Professor</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Disciplina</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
              <img src={item.photoUrl} className="w-8 h-8 rounded-full border border-slate-200 object-cover" alt={item.name} />
              <span className="font-bold text-slate-800">{item.name}</span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.subject}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
              }`}>{item.status}</span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onViewDetail(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm border border-indigo-100"><Eye className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RoomsList = ({ data, onViewDetail }: { data: RoomData[], onViewDetail: (r: RoomData) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {data.map(room => (
      <div key={room.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 transition-colors group relative bg-white overflow-hidden shadow-sm">
        <div className="flex justify-between items-start mb-4">
           <div>
             <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Sala/Local</span>
             <h4 className="text-xl font-black text-slate-800">{room.id}</h4>
           </div>
           <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
             room.status === 'Disponível' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
           }`}>{room.status}</span>
        </div>
        <p className="text-sm text-slate-500 mb-6 min-h-[40px] leading-tight">{room.name}</p>
        <button onClick={() => onViewDetail(room)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Eye className="w-4 h-4" /></button>
      </div>
    ))}
  </div>
);

const ScheduleView = ({ classes, teachers, rooms, schedules, onEditSlot, onRemoveSlot }: { 
  classes: ClassData[], 
  teachers: TeacherData[],
  rooms: RoomData[],
  schedules: Record<string, ScheduleEntry[]>,
  onEditSlot: (classId: string, day: number, slot: number) => void,
  onRemoveSlot: (classId: string, day: number, slot: number) => void
}) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const currentSchedule = schedules[selectedClassId] || [];
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <CalendarDays className="w-8 h-8 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800">Grade Horária</h3>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-6 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
        <div className="border-r border-b border-slate-200 p-4 font-bold text-[10px] text-slate-400 uppercase text-center">Horário</div>
        {daysOfWeek.map(day => <div key={day} className="border-r border-b border-slate-200 p-4 font-bold text-[10px] text-slate-400 uppercase text-center">{day}</div>)}
        {timeSlots.map((time, slotIdx) => (
          <React.Fragment key={time}>
            <div className="border-r border-b border-slate-200 p-4 text-center text-[11px] font-black text-slate-500 bg-white">{time}</div>
            {[1, 2, 3, 4, 5].map(dayIdx => {
              const entry = currentSchedule.find(e => e.day === dayIdx && e.slot === slotIdx);
              const teacher = teachers.find(t => t.id === entry?.teacherId);
              return (
                <div key={`${dayIdx}-${slotIdx}`} className="group relative border-r border-b border-slate-200 p-2 bg-white hover:bg-indigo-50/30 cursor-pointer min-h-[100px]" onClick={() => onEditSlot(selectedClassId, dayIdx, slotIdx)}>
                  {entry ? (
                    <div className="h-full flex flex-col justify-center">
                      <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{entry.subject}</p>
                      <p className="text-[9px] text-slate-500 font-bold truncate">Prof. {teacher?.name}</p>
                    </div>
                  ) : <Plus className="w-4 h-4 text-slate-200 mx-auto" />}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// --- Modals ---

const StudentDetailModal = ({ student, onClose }: { student: StudentData, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
      <div className="h-32 bg-indigo-600 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-10 pb-10 -mt-16">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-10">
          <img src={student.photoUrl} className="w-40 h-40 rounded-3xl object-cover border-8 border-white shadow-xl bg-white" alt={student.name} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{student.name}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {student.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-sm tracking-tight">{student.classId}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-slate-300" />
                <span className="font-mono text-xs">{student.registrationNumber}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-3">Informações Acadêmicas</h4>
            <div className="space-y-4">
              <DetailField icon={Cake} label="Data de Nascimento" value={new Date(student.birthday).toLocaleDateString('pt-BR')} />
              <DetailField icon={MapPin} label="Localização Institucional" value="Unidade Principal - Bloco A" />
              <DetailField icon={Clock} label="Último Acesso Registrado" value="Hoje às 07:45" />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest border-b border-slate-100 pb-3">Contato dos Responsáveis</h4>
            <div className="space-y-4">
              <DetailField icon={User} label="Responsável" value={student.guardianName} />
              <DetailField icon={Phone} label="Telefone de Emergência" value={student.guardianPhone} />
              <DetailField icon={Mail} label="E-mail Institucional" value={student.guardianEmail} />
            </div>
          </div>
        </div>
        <div className="mt-12 flex gap-4">
          <button className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3"><Edit2 className="w-5 h-5" />Editar Cadastro</button>
          <button onClick={onClose} className="px-10 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">Fechar</button>
        </div>
      </div>
    </div>
  </div>
);

const TeacherDetailModal = ({ teacher, onClose }: { teacher: TeacherData, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
      <div className="h-32 bg-slate-800 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-10 pb-10 -mt-16">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-10">
          {teacher.photoUrl ? (
            <img src={teacher.photoUrl} className="w-40 h-40 rounded-3xl object-cover border-8 border-white shadow-xl bg-white" alt={teacher.name} />
          ) : (
            <div className="w-40 h-40 rounded-3xl bg-indigo-50 border-8 border-white shadow-xl flex items-center justify-center text-indigo-500 font-black text-5xl">{teacher.name.charAt(0)}</div>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{teacher.name}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${teacher.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {teacher.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-slate-500">
              <div className="flex items-center gap-2 font-bold text-sm tracking-tight"><Briefcase className="w-4 h-4 text-indigo-500" />{teacher.subject}</div>
              <div className="flex items-center gap-2"><Hash className="w-4 h-4 text-slate-300" /><span className="font-mono text-xs">ID: {teacher.id}</span></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-3">Perfil Profissional</h4>
            <div className="space-y-4">
              <DetailField icon={Clock} label="Carga Horária Semanal" value={teacher.hours} />
              <DetailField icon={School} label="Turmas Ativas" value={`${teacher.classesCount} turmas vinculadas`} />
              <DetailField icon={Award} label="Titularidade" value="Especialista Senior" />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest border-b border-slate-100 pb-3">Canais de Contato</h4>
            <div className="space-y-4">
              <DetailField icon={Mail} label="E-mail Corporativo" value={teacher.email || 'Não informado'} />
              <DetailField icon={Phone} label="Celular Direto" value={teacher.phone || 'Não informado'} />
              <DetailField icon={Smartphone} label="EduTrack App Token" value="Gerado • Ativo" />
            </div>
          </div>
        </div>
        <div className="mt-12 flex gap-4">
          <button className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-3"><Edit2 className="w-5 h-5" />Atualizar Prontuário</button>
          <button onClick={onClose} className="px-10 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">Fechar</button>
        </div>
      </div>
    </div>
  </div>
);

const DetailField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex gap-4 items-center">
    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0"><Icon className="w-4 h-4" /></div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

const ClassDetailModal = ({ classData, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-10 border border-slate-100 animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-start mb-8">
        <div><span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">Configuração de Turma</span><h3 className="text-3xl font-black text-slate-800 tracking-tighter">{classData.name}</h3></div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
      </div>
      <div className="space-y-6">
        <DetailField icon={Hash} label="ID da Turma" value={classData.id} />
        <DetailField icon={BookOpen} label="Série Acadêmica" value={classData.grade} />
        <DetailField icon={Clock} label="Turno" value={classData.shift} />
        <DetailField icon={MapPin} label="Sala Alocada" value={classData.room} />
        <DetailField icon={Users} label="Total de Alunos" value={`${classData.students} matriculados`} />
      </div>
      <button onClick={onClose} className="w-full mt-10 py-4 bg-slate-100 font-black text-slate-600 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Fechar Detalhes</button>
    </div>
  </div>
);

const RoomDetailModal = ({ room, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-10 border border-slate-100 animate-in zoom-in-95 duration-200">
       <div className="flex justify-between items-start mb-8">
        <div><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 block">Gestão de Espaços</span><h3 className="text-3xl font-black text-slate-800 tracking-tighter">{room.id}</h3></div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
      </div>
      <div className="space-y-6">
        <DetailField icon={Info} label="Descrição" value={room.name} />
        <DetailField icon={Settings} label="Tipo de Ambiente" value={room.type} />
        <DetailField icon={Users} label="Lotação Máxima" value={`${room.capacity} personas`} />
        <DetailField icon={ShieldCheck} label="Status de Disponibilidade" value={room.status} />
      </div>
      <button onClick={onClose} className="w-full mt-10 py-4 bg-slate-100 font-black text-slate-600 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Fechar Detalhes</button>
    </div>
  </div>
);

const ClassFormModal = ({ onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState({ name: '', grade: '', shift: 'Matutino', students: 0, room: '' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white rounded-3xl w-full max-w-md p-8"><h3 className="text-xl font-bold mb-6">Nova Turma</h3><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Série" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} /><button onClick={() => onSubmit(formData)} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Salvar</button></div>
    </div>
  );
};

const TeacherFormModal = ({ onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState({ name: '', subject: '', email: '', hours: '40h', status: 'Ativo' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white rounded-3xl w-full max-w-md p-8"><h3 className="text-xl font-bold mb-6">Novo Professor</h3><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Disciplina" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /><button onClick={() => onSubmit(formData)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Salvar Professor</button></div>
    </div>
  );
};

const RoomFormModal = ({ onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState({ id: '', name: '', type: 'Teórica', capacity: 30, status: 'Disponível' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white rounded-3xl w-full max-w-md p-8"><h3 className="text-xl font-bold mb-6">Nova Sala</h3><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Código" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} /><input className="w-full mb-4 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Descrição" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /><button onClick={() => onSubmit(formData)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Salvar Sala</button></div>
    </div>
  );
};

const ScheduleFormModal = ({ day, slot, existingEntry, teachers, rooms, onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState<ScheduleEntry>(existingEntry || { day, slot, subject: '', teacherId: '', roomId: '' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"><div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-8"><h3 className="text-xl font-black mb-6 tracking-tight">Agendar Aula</h3><div className="space-y-4"><input required type="text" placeholder="Disciplina" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} /><select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})}><option value="">Professor...</option>{teachers.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}</select><select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.roomId} onChange={(e) => setFormData({...formData, roomId: e.target.value})}><option value="">Sala...</option>{rooms.map((r:any) => <option key={r.id} value={r.id}>{r.id}</option>)}</select></div><div className="flex gap-4 mt-8"><button onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500">Cancelar</button><button onClick={() => onSubmit(formData)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">Salvar</button></div></div></div>
  );
};

export default Management;
