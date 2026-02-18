
import React, { useState } from 'react';
import { mockClassrooms } from '../services/mockData';
import { Classroom, Student } from '../types';
import { User, BookOpen, AlertTriangle, X, Clock, MapPin, CheckCircle, ChevronDown, Info } from 'lucide-react';

interface ClassroomMapProps {
  students: Student[];
  onUpdateStatus: (id: string, status: Student['status'], time: string) => void;
}

const ClassroomMap: React.FC<ClassroomMapProps> = ({ students, onUpdateStatus }) => {
  const [selectedRoom, setSelectedRoom] = useState<Classroom | null>(null);

  const handleOpenAttendance = (room: Classroom) => {
    setSelectedRoom(room);
  };

  const handleCloseAttendance = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mapa de Ocupação</h2>
          <p className="text-slate-500">Localização e check-in em sala em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClassrooms.map(room => {
          // Calculate dynamic occupancy based on current state
          const count = students.filter(s => s.status === 'IN_CLASS' && (s.classId === room.id || s.classId === room.id.split(' ')[0])).length;
          return (
            <RoomCard 
              key={room.id} 
              room={{...room, currentCount: count}} 
              onViewAttendance={() => handleOpenAttendance(room)} 
            />
          );
        })}
      </div>

      {selectedRoom && (
        <AttendanceModal 
          initialRoom={selectedRoom} 
          allRooms={mockClassrooms}
          students={students}
          onUpdateStatus={onUpdateStatus}
          onClose={handleCloseAttendance} 
        />
      )}
    </div>
  );
};

const RoomCard: React.FC<{ room: Classroom; onViewAttendance: () => void }> = ({ room, onViewAttendance }) => {
  const occupancyRate = (room.currentCount / room.capacity) * 100;
  const isHighOccupancy = occupancyRate > 85;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all hover:shadow-md group flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Ativo</span>
            <h4 className="text-xl font-bold mt-1">{room.id}</h4>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-6">{room.name}</p>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Ocupação Atual</span>
            <span className="font-bold text-slate-700">{room.currentCount} / {room.capacity}</span>
          </div>
          
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isHighOccupancy ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">{room.subject}</span>
             </div>
          </div>
        </div>
      </div>
      <button 
        onClick={onViewAttendance}
        className="w-full py-4 bg-slate-50 border-t border-slate-100 text-sm font-bold text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
      >
        Gerenciar Presença
      </button>
    </div>
  );
};

const AttendanceModal: React.FC<{ initialRoom: Classroom; allRooms: Classroom[]; students: Student[]; onUpdateStatus: any; onClose: () => void }> = ({ initialRoom, allRooms, students, onUpdateStatus, onClose }) => {
  const [activeRoomId, setActiveRoomId] = useState(initialRoom.id);
  
  const currentRoom = allRooms.find(r => r.id === activeRoomId) || initialRoom;
  const roomStudents = students.filter(s => s.classId === activeRoomId || s.classId === activeRoomId.split(' ')[0]);

  const handleRoomCheckIn = (studentId: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    onUpdateStatus(studentId, 'IN_CLASS', time);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold">Gestão de Presença</h3>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Controle Biométrico em Sala</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {/* Room Selector Dropdown */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selecione a Sala de Aula</label>
          <div className="relative">
            <select 
              value={activeRoomId} 
              onChange={(e) => setActiveRoomId(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-800 font-bold py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              {allRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.name} ({r.subject})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white">
          <div className="flex justify-between items-center mb-2 px-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Alunos Matriculados ({roomStudents.length})</h4>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Em Sala: {roomStudents.filter(s => s.status === 'IN_CLASS').length}</span>
            </div>
          </div>
          
          {roomStudents.length > 0 ? (
            roomStudents.map(student => (
              <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all group">
                <img src={student.photoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm" alt={student.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{student.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      student.status === 'IN_CLASS' ? 'bg-emerald-100 text-emerald-600' :
                      student.status === 'LATE' || student.status === 'IN_SCHOOL' ? 'bg-amber-100 text-amber-600' :
                      student.status === 'ABSENT' ? 'bg-rose-100 text-rose-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {student.status.replace('_', ' ')}
                    </span>
                    {student.lastAccess !== '-' && (
                      <span className="text-[9px] text-slate-400 font-medium italic">Check-in: {student.lastAccess}</span>
                    )}
                  </div>
                </div>
                {student.status !== 'IN_CLASS' ? (
                  <button 
                    onClick={() => handleRoomCheckIn(student.id)}
                    disabled={student.status === 'AWAY' || student.status === 'ABSENT'}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md shadow-indigo-100"
                  >
                    Confirmar
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    OK
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2 opacity-50">
               <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
               <p className="text-sm font-bold">Nenhum aluno vinculado a esta sala.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 text-center shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Info className="w-3 h-3 inline-block mr-1 -mt-0.5" />
            O check-in em sala altera o status para <span className="text-indigo-600">IN_CLASS</span> e atualiza o mapa de ocupação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassroomMap;
