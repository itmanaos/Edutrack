
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
  RotateCcw
} from 'lucide-react';

type ManagementTab = 'students' | 'classes' | 'teachers' | 'rooms' | 'schedule';

interface StudentData {
  id: string;
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

const Management: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ManagementTab>('students');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentData | null>(null);
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassData | null>(null);
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<TeacherData | null>(null);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<RoomData | null>(null);
  const [editingScheduleSlot, setEditingScheduleSlot] = useState<{classId: string, day: number, slot: number} | null>(null);
  
  // Dynamic States
  const [students, setStudents] = useState<StudentData[]>([
    { id: '101', name: 'Ana Silva', classId: '3º Ano A', photoUrl: 'https://picsum.photos/id/1011/200', birthday: '2008-05-15', guardianName: 'Maria Silva', guardianPhone: '(11) 91234-5678', guardianEmail: 'maria@email.com', status: 'Ativo' },
    { id: '102', name: 'Bruno Santos', classId: '3º Ano A', photoUrl: 'https://picsum.photos/id/1012/200', birthday: '2007-11-20', guardianName: 'José Santos', guardianPhone: '(11) 92345-6789', guardianEmail: 'jose@email.com', status: 'Ativo' },
  ]);

  const [classes, setClasses] = useState<ClassData[]>([
    { id: '1', name: '3º Ano A', grade: '3º Ensino Médio', shift: 'Matutino', students: 35, room: 'Sala 301' },
    { id: '2', name: '2º Ano B', grade: '2º Ensino Médio', shift: 'Vespertino', students: 28, room: 'Sala 205' },
    { id: '3', name: '1º Ano C', grade: '1º Ensino Médio', shift: 'Matutino', students: 40, room: 'Laboratório A' },
  ]);

  const [teachers, setTeachers] = useState<TeacherData[]>([
    { id: '1', name: 'Ricardo Mendes', subject: 'Matemática', hours: '40h', classesCount: 4, status: 'Ativo', email: 'ricardo.mendes@escola.com', phone: '(11) 98888-7777' },
    { id: '2', name: 'Lúcia Ferreira', subject: 'História', hours: '20h', classesCount: 3, status: 'Ativo', email: 'lucia.ferreira@escola.com', phone: '(11) 97777-6666' },
    { id: '3', name: 'Marcos Silva', subject: 'Física', hours: '30h', classesCount: 5, status: 'Em Licença', email: 'marcos.silva@escola.com', phone: '(11) 96666-5555' },
  ]);

  const [rooms, setRooms] = useState<RoomData[]>([
    { id: '301', name: 'Sala 301 - Bloco A', type: 'Teórica', capacity: 40, status: 'Disponível' },
    { id: '205', name: 'Sala 205 - Bloco A', type: 'Teórica', capacity: 35, status: 'Em Uso' },
    { id: 'LAB1', name: 'Laboratório de Química', type: 'Prática', capacity: 20, status: 'Em Uso' },
    { id: 'AUD', name: 'Auditório Principal', type: 'Eventos', capacity: 200, status: 'Disponível' },
    { id: 'BIB', name: 'Biblioteca', type: 'Estudo', capacity: 50, status: 'Manutenção' },
  ]);

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
                activeSubTab === 'teachers' ? 'Professor' : 'Sala'
              }</span>
            </button>
          </div>
        )}
      </div>

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

// --- Form Modals ---

const StudentFormModal = ({ classes, onClose, onSubmit }: { classes: ClassData[], onClose: () => void, onSubmit: (data: StudentData) => void }) => {
  const [formData, setFormData] = useState<StudentData>({
    id: '',
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
            {/* Photo Column */}
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
                 <button 
                  type="button"
                  onClick={simulatePhotoCapture}
                  className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                 >
                   <RotateCcw className="w-3 h-3" />
                   {formData.photoUrl ? 'Trocar Foto' : 'Capturar Agora'}
                 </button>
               </div>
               <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
                 <Info className="w-4 h-4 text-amber-500 shrink-0" />
                 <p className="text-[9px] text-amber-700 leading-tight">A foto deve estar nítida para garantir o funcionamento do controle de acesso biométrico na portaria.</p>
               </div>
            </div>

            {/* Fields Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-100 pb-2">Dados Acadêmicos</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo do Aluno</label>
                    <input required type="text" placeholder="Nome do estudante" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Data de Nascimento</label>
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
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Identificação (ID/RFID)</label>
                    <input type="text" placeholder="Auto-gerado se vazio" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} />
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

// --- Lists ---

const StudentsList = ({ data, onViewDetail }: { data: StudentData[], onViewDetail: (item: StudentData) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aluno</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data Nasc.</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Turma</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Responsável</th>
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
            <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.id}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Cake className="w-3 h-3 text-pink-400" />
                {item.birthday ? new Date(item.birthday).toLocaleDateString('pt-BR') : '--/--/----'}
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.classId}</td>
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-sm text-slate-700 font-medium">{item.guardianName}</span>
                <span className="text-[10px] text-slate-400">{item.guardianPhone}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onViewDetail(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Eye className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic">Nenhum aluno cadastrado.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// (Outros sub-componentes ClassFormModal, TeacherFormModal, RoomFormModal, ScheduleFormModal, StudentDetailModal, ClassDetailModal, TeacherDetailModal, RoomDetailModal, ClassesList, TeachersList, RoomsList, ScheduleView seguem a mesma lógica anterior...)

const ClassFormModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: Omit<ClassData, 'id'>) => void }) => {
  const [formData, setFormData] = useState({ name: '', grade: '', shift: 'Matutino', students: 0, room: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Nova Turma</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Turma</label>
              <input required type="text" placeholder="Ex: 3º Ano A" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Série / Ciclo</label>
              <input required type="text" placeholder="Ex: 3º Ensino Médio" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Turno</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})}>
                  <option>Matutino</option><option>Vespertino</option><option>Noturno</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sala</label>
                <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})}>
                  <option value="">Selecione...</option><option>Sala 301</option><option>Sala 205</option><option>Laboratório A</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg">Salvar Turma</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeacherFormModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: Omit<TeacherData, 'id' | 'classesCount'>) => void }) => {
  const [formData, setFormData] = useState<Omit<TeacherData, 'id' | 'classesCount'>>({
    name: '',
    subject: '',
    hours: '40h',
    status: 'Ativo',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Novo Professor</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
              <input required type="text" placeholder="Nome do docente" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Disciplina Principal</label>
              <input required type="text" placeholder="Ex: Matemática, Física" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Carga Horária</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.hours} onChange={(e) => setFormData({...formData, hours: e.target.value})}>
                  <option>10h</option><option>20h</option><option>30h</option><option>40h</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                  <option>Ativo</option><option>Em Licença</option><option>Inativo</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Institucional</label>
                <input type="email" placeholder="email@escola.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg">Salvar Professor</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RoomFormModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: RoomData) => void }) => {
  const [formData, setFormData] = useState<RoomData>({
    id: '',
    name: '',
    type: 'Teórica',
    capacity: 30,
    status: 'Disponível'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Novo Ambiente/Sala</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Código ID</label>
                <input required type="text" placeholder="Ex: 405" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Descritivo</label>
                <input required type="text" placeholder="Ex: Laboratório de Bio" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Ambiente</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option>Teórica</option><option>Prática</option><option>Eventos</option><option>Estudo</option><option>Administrativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Capacidade Máx.</label>
                <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status Inicial</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                <option>Disponível</option><option>Em Uso</option><option>Manutenção</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg">Cadastrar Sala</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ScheduleFormModal = ({ day, slot, existingEntry, teachers, rooms, onClose, onSubmit }: { 
  day: number, 
  slot: number, 
  existingEntry?: ScheduleEntry, 
  teachers: TeacherData[],
  rooms: RoomData[],
  onClose: () => void, 
  onSubmit: (data: ScheduleEntry) => void 
}) => {
  const [formData, setFormData] = useState<ScheduleEntry>(existingEntry || {
    day,
    slot,
    subject: '',
    teacherId: '',
    roomId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <h3 className="text-xl font-bold">Atribuir Aula</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase">{daysOfWeek[day-1]}</p>
            <p className="text-lg font-bold text-slate-700">{timeSlots[slot]}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Disciplina</label>
              <input required type="text" placeholder="Ex: Matemática" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Professor</label>
              <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})}>
                <option value="">Selecione...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sala</label>
              <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.roomId} onChange={(e) => setFormData({...formData, roomId: e.target.value})}>
                <option value="">Selecione...</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Salvar Horário</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentDetailModal = ({ student, onClose }: { student: StudentData, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-xl"><UserCheck className="w-5 h-5 text-white" /></div><h3 className="text-xl font-bold">Ficha do Aluno</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <img src={student.photoUrl} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-md" alt={student.name} />
            <div>
              <h4 className="text-2xl font-black text-slate-800">{student.name}</h4>
              <p className="text-indigo-500 font-bold uppercase tracking-wider text-sm">{student.classId}</p>
              <div className="flex items-center gap-2 mt-2">
                <Cake className="w-3 h-3 text-pink-500" />
                <span className="text-xs font-bold text-slate-500">Nascimento: {new Date(student.birthday).toLocaleDateString('pt-BR')}</span>
              </div>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                Status: {student.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
                 <Shield className="w-4 h-4" />
                 Informações dos Responsáveis
               </div>
               <div className="space-y-3">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Nome do Responsável</p>
                   <p className="font-bold text-slate-700">{student.guardianName}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Celular</p>
                     <p className="font-bold text-slate-700">{student.guardianPhone}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                     <p className="font-bold text-slate-700 truncate">{student.guardianEmail}</p>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
               <div className="flex items-center gap-3 mb-2 text-indigo-700 font-bold text-sm">
                 <Smartphone className="w-4 h-4" />
                 Identificação Biométrica
               </div>
               <p className="text-[11px] text-indigo-600/80 leading-relaxed">
                 O token facial deste aluno está devidamente indexado no sistema. Acesso à escola e salas de aula via biometria liberado.
               </p>
             </div>
          </div>
          
          <button onClick={onClose} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">Fechar Ficha</button>
        </div>
      </div>
    </div>
  );
};

const ClassDetailModal = ({ classData, onClose }: { classData: ClassData, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-xl"><Info className="w-5 h-5 text-white" /></div><h3 className="text-xl font-bold">Detalhes da Turma</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
        </div>
        <div className="p-8 space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-indigo-100 shadow-inner"><School className="w-10 h-10" /></div>
            <h4 className="text-2xl font-black text-slate-800">{classData.name}</h4>
            <p className="text-indigo-500 font-bold uppercase tracking-wider text-sm">{classData.grade}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turno</p><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /><p className="font-bold text-slate-700">{classData.shift}</p></div></div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sala</p><div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /><p className="font-bold text-slate-700">{classData.room}</p></div></div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total de Alunos</p><div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /><p className="font-bold text-slate-700">{classData.students} alunos</p></div></div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p><div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><p className="font-bold text-slate-700">Ativa</p></div></div>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">Fechar Detalhes</button>
        </div>
      </div>
    </div>
  );
};

const TeacherDetailModal = ({ teacher, onClose }: { teacher: TeacherData, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-xl"><User className="w-5 h-5 text-white" /></div><h3 className="text-xl font-bold">Perfil do Professor</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg text-3xl font-bold">
              {teacher.name.charAt(0)}
            </div>
            <h4 className="text-2xl font-black text-slate-800">{teacher.name}</h4>
            <p className="text-indigo-500 font-bold uppercase tracking-wider text-sm">{teacher.subject}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <Mail className="w-5 h-5 text-indigo-500" />
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Email Institucional</p>
                 <p className="font-bold text-slate-700 truncate">{teacher.email || 'Não informado'}</p>
               </div>
             </div>
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <Phone className="w-5 h-5 text-indigo-500" />
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Contato</p>
                 <p className="font-bold text-slate-700">{teacher.phone || 'Não informado'}</p>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-center">
              <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Carga Horária</p>
              <p className="text-xl font-black text-indigo-600">{teacher.hours}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Turmas Ativas</p>
              <p className="text-xl font-black text-white">{teacher.classesCount}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">Fechar Perfil</button>
        </div>
      </div>
    </div>
  );
};

const RoomDetailModal = ({ room, onClose }: { room: RoomData, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-xl"><Settings className="w-5 h-5 text-white" /></div><h3 className="text-xl font-bold">Gestão de Ambiente</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
        </div>
        <div className="p-8 space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-200 shadow-inner">
              <BookOpen className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800">{room.name}</h4>
            <p className="text-indigo-500 font-bold uppercase tracking-wider text-sm">ID: {room.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo</p>
              <p className="font-bold text-slate-700">{room.type}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Capacidade</p>
              <p className="font-bold text-slate-700">{room.capacity} Pessoas</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Status do Ambiente</p>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                  room.status === 'Disponível' ? 'bg-emerald-100 text-emerald-600' :
                  room.status === 'Em Uso' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-rose-100 text-rose-600'
                }`}>{room.status}</span>
                {room.status === 'Manutenção' && <p className="text-[10px] text-rose-500 italic font-medium">Previsão: 48h</p>}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
             <div className="flex items-center gap-3 mb-3 text-indigo-700 font-bold">
               <ShieldCheck className="w-5 h-5" />
               Controle de Acesso Biométrico
             </div>
             <p className="text-xs text-indigo-600/80 leading-relaxed">
               Este ambiente possui sensores IoT vinculados. Todas as entradas e saídas são registradas via reconhecimento facial ou RFID na porta da sala.
             </p>
          </div>
          
          <button onClick={onClose} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">Sair da Gestão</button>
        </div>
      </div>
    </div>
  );
};

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
          <tr key={item.id} className="hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
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
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Carga Horária</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Turmas</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{item.name.charAt(0)}</div>
              <span className="font-bold text-slate-800">{item.name}</span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.subject}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.hours}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.classesCount}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 
                item.status === 'Em Licença' ? 'bg-amber-100 text-amber-600' : 
                'bg-slate-100 text-slate-600'
              }`}>{item.status}</span>
            </td>
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

const RoomsList = ({ data, onViewDetail }: { data: RoomData[], onViewDetail: (r: RoomData) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {data.map(room => (
      <div key={room.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 transition-colors group relative bg-white overflow-hidden shadow-sm hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
           <div>
             <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Sala/Local</span>
             <h4 className="text-xl font-black text-slate-800">{room.id}</h4>
           </div>
           <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
             room.status === 'Disponível' ? 'bg-emerald-100 text-emerald-600' :
             room.status === 'Em Uso' ? 'bg-indigo-100 text-indigo-600' :
             'bg-rose-100 text-rose-600'
           }`}>{room.status}</span>
        </div>
        <p className="text-sm text-slate-500 mb-6 min-h-[40px] leading-tight">{room.name}</p>
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-4 border-t border-slate-50">
          <span>Tipo: {room.type}</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Cap: {room.capacity}</span>
          </div>
        </div>
        
        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        <button 
          onClick={() => onViewDetail(room)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-indigo-50 text-indigo-600 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    ))}
    {data.length === 0 && (
      <div className="col-span-full py-20 text-center text-slate-400 italic">
        Nenhum ambiente cadastrado.
      </div>
    )}
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
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <CalendarDays className="w-8 h-8 text-indigo-600" />
          <div>
            <h3 className="text-xl font-bold text-slate-800">Grade Horária de Aulas</h3>
            <p className="text-sm text-slate-500">Configure o quadro de horários semanal por turma</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Visualizar Turma:</label>
          <select 
            className="flex-1 md:w-64 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.grade}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-6 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50">
        {/* Header */}
        <div className="border-r border-b border-slate-200 p-4 font-bold text-[10px] text-slate-400 uppercase text-center flex items-center justify-center">Horário</div>
        {daysOfWeek.map(day => (
          <div key={day} className="border-r border-b border-slate-200 p-4 font-bold text-[10px] text-slate-400 uppercase text-center flex items-center justify-center last:border-r-0">
            {day}
          </div>
        ))}

        {/* Rows */}
        {timeSlots.map((time, slotIdx) => (
          <React.Fragment key={time}>
            <div className="border-r border-b border-slate-200 p-4 text-center text-[11px] font-black text-slate-500 bg-white flex items-center justify-center">
              {time}
            </div>
            {[1, 2, 3, 4, 5].map(dayIdx => {
              const entry = currentSchedule.find(e => e.day === dayIdx && e.slot === slotIdx);
              const teacher = teachers.find(t => t.id === entry?.teacherId);
              
              return (
                <div 
                  key={`${dayIdx}-${slotIdx}`} 
                  className="group relative border-r border-b border-slate-200 p-2 bg-white last:border-r-0 hover:bg-indigo-50/30 transition-all cursor-pointer min-h-[100px]"
                  onClick={() => onEditSlot(selectedClassId, dayIdx, slotIdx)}
                >
                  {entry ? (
                    <div className="h-full flex flex-col justify-center animate-in zoom-in-95 duration-200">
                      <p className="text-[10px] font-black text-indigo-600 leading-tight uppercase mb-1">{entry.subject}</p>
                      <p className="text-[9px] text-slate-500 font-bold truncate mb-1">Prof. {teacher?.name || '---'}</p>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                        <MapPin className="w-2 h-2" />
                        <span>{entry.roomId}</span>
                      </div>
                      
                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-indigo-600/90 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                         <button className="p-1.5 bg-white text-indigo-600 rounded-md shadow-lg" title="Editar">
                           <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button 
                          className="p-1.5 bg-rose-500 text-white rounded-md shadow-lg" 
                          title="Remover"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSlot(selectedClassId, dayIdx, slotIdx);
                          }}
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 group-hover:text-indigo-400 transition-colors">
                      <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Livre</span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
         <Info className="w-5 h-5 text-amber-500 shrink-0" />
         <p className="text-xs text-amber-700 leading-relaxed font-medium">
           Dica: Clique em qualquer horário "Livre" para adicionar uma nova aula. As alterações são salvas localmente nesta sessão para demonstração.
         </p>
      </div>
    </div>
  );
};

export default Management;
