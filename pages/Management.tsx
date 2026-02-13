
import React, { useState } from 'react';
import { 
  Users, 
  School, 
  BookOpen, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CalendarDays
} from 'lucide-react';

type ManagementTab = 'classes' | 'teachers' | 'rooms' | 'schedule';

const Management: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ManagementTab>('classes');

  const subTabs = [
    { id: 'classes', label: 'Cadastro de Turmas', icon: School },
    { id: 'teachers', label: 'Cadastro de Professores', icon: Users },
    { id: 'rooms', label: 'Cadastro de Salas', icon: BookOpen },
    { id: 'schedule', label: 'Horário de Aulas', icon: Clock },
  ];

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
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
            <Plus className="w-5 h-5" />
            <span>Adicionar Novo</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {activeSubTab === 'classes' && <ClassesList />}
        {activeSubTab === 'teachers' && <TeachersList />}
        {activeSubTab === 'rooms' && <RoomsList />}
        {activeSubTab === 'schedule' && <ScheduleView />}
      </div>
    </div>
  );
};

// --- Sub-components for each management section ---

const ClassesList = () => (
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
        {[
          { id: '1', name: '3º Ano A', grade: '3º Ensino Médio', shift: 'Matutino', students: 35, room: 'Sala 301' },
          { id: '2', name: '2º Ano B', grade: '2º Ensino Médio', shift: 'Vespertino', students: 28, room: 'Sala 205' },
          { id: '3', name: '1º Ano C', grade: '1º Ensino Médio', shift: 'Matutino', students: 40, room: 'Laboratório A' },
        ].map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.grade}</td>
            <td className="px-6 py-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{item.shift}</span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.students}</td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.room}</td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TeachersList = () => (
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
        {[
          { id: '1', name: 'Ricardo Mendes', subject: 'Matemática', hours: '40h', classes: 4, status: 'Ativo' },
          { id: '2', name: 'Lúcia Ferreira', subject: 'História', hours: '20h', classes: 3, status: 'Ativo' },
          { id: '3', name: 'Marcos Silva', subject: 'Física', hours: '30h', classes: 5, status: 'Em Licença' },
        ].map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                {item.name.charAt(0)}
              </div>
              <span className="font-bold text-slate-800">{item.name}</span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.subject}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.hours}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.classes}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>{item.status}</span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RoomsList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[
      { id: '301', name: 'Sala 301 - Bloco A', type: 'Teórica', capacity: 40, status: 'Disponível' },
      { id: 'LAB1', name: 'Laboratório de Química', type: 'Prática', capacity: 20, status: 'Em Uso' },
      { id: 'AUD', name: 'Auditório Principal', type: 'Eventos', capacity: 200, status: 'Disponível' },
      { id: 'BIB', name: 'Biblioteca', type: 'Estudo', capacity: 50, status: 'Manutenção' },
    ].map(room => (
      <div key={room.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 transition-colors group">
        <div className="flex justify-between items-start mb-4">
           <h4 className="text-lg font-bold text-slate-800">{room.id}</h4>
           <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
             room.status === 'Disponível' ? 'bg-emerald-100 text-emerald-600' :
             room.status === 'Em Uso' ? 'bg-indigo-100 text-indigo-600' :
             'bg-rose-100 text-rose-600'
           }`}>{room.status}</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">{room.name}</p>
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Tipo: {room.type}</span>
          <span>Capacidade: {room.capacity}</span>
        </div>
      </div>
    ))}
  </div>
);

const ScheduleView = () => (
  <div className="p-6">
    <div className="flex items-center gap-4 mb-8">
      <CalendarDays className="w-6 h-6 text-indigo-600" />
      <h3 className="text-xl font-bold text-slate-800">Grade Horária Geral</h3>
    </div>
    
    <div className="grid grid-cols-6 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="bg-slate-50 border-r border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Horário</div>
      <div className="bg-slate-50 border-r border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Seg</div>
      <div className="bg-slate-50 border-r border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Ter</div>
      <div className="bg-slate-50 border-r border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Qua</div>
      <div className="bg-slate-50 border-r border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Qui</div>
      <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-xs text-slate-400 uppercase text-center">Sex</div>

      {['07:30 - 08:20', '08:20 - 09:10', '09:30 - 10:20', '10:20 - 11:10'].map((slot, i) => (
        <React.Fragment key={slot}>
          <div className="border-r border-b border-slate-100 p-4 text-center text-sm font-medium text-slate-500 bg-slate-50/50">{slot}</div>
          <div className="border-r border-b border-slate-100 p-2"><div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold p-2 rounded-lg text-center h-full flex flex-col justify-center">MATEMÁTICA<br/>(3º A)</div></div>
          <div className="border-r border-b border-slate-100 p-2"><div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold p-2 rounded-lg text-center h-full flex flex-col justify-center">FÍSICA<br/>(3º A)</div></div>
          <div className="border-r border-b border-slate-100 p-2"><div className="bg-amber-50 text-amber-600 text-[10px] font-bold p-2 rounded-lg text-center h-full flex flex-col justify-center">HISTÓRIA<br/>(2º B)</div></div>
          <div className="border-r border-b border-slate-100 p-2"><div className="bg-rose-50 text-rose-600 text-[10px] font-bold p-2 rounded-lg text-center h-full flex flex-col justify-center">PORTUGUÊS<br/>(1º C)</div></div>
          <div className="border-b border-slate-100 p-2"><div className="bg-slate-50 text-slate-400 text-[10px] font-bold p-2 rounded-lg text-center h-full flex flex-col justify-center italic">LIVRE</div></div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default Management;
