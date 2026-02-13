
import React, { useState } from 'react';
import { mockClassrooms, mockStudents } from '../services/mockData';
import { Classroom, Student } from '../types';
import { User, BookOpen, AlertTriangle, X, Clock, MapPin } from 'lucide-react';

const ClassroomMap: React.FC = () => {
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
          <p className="text-slate-500">Visualização em tempo real das salas de aula</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
             <span className="text-sm text-slate-500">Em Aula</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
             <span className="text-sm text-slate-500">Perto do Limite</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClassrooms.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onViewAttendance={() => handleOpenAttendance(room)} 
          />
        ))}
      </div>

      {/* Attendance Modal */}
      {selectedRoom && (
        <AttendanceModal 
          room={selectedRoom} 
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
          <div className={`p-2 rounded-xl ${isHighOccupancy ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-6">{room.name}</p>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Capacidade</span>
            <span className="font-bold text-slate-700">{room.currentCount} / {room.capacity}</span>
          </div>
          
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isHighOccupancy ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-3">
               <User className="w-4 h-4 text-slate-400" />
               <span className="text-sm text-slate-600 font-medium">Prof. Ricardo Mendes</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">{room.subject}</span>
               {isHighOccupancy && (
                 <div className="flex items-center gap-1 text-amber-600 text-xs font-bold animate-pulse">
                   <AlertTriangle className="w-3 h-3" />
                   LOTADA
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
      <button 
        onClick={onViewAttendance}
        className="w-full py-4 bg-slate-50 border-t border-slate-100 text-sm font-bold text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <span>Ver Lista de Presença</span>
      </button>
    </div>
  );
};

const AttendanceModal: React.FC<{ room: Classroom; onClose: () => void }> = ({ room, onClose }) => {
  // Filter students by room ID (matching mock student classId with room id)
  const presentStudents = mockStudents.filter(s => s.classId === room.id || s.classId === room.id.split(' ')[0]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
              <MapPin className="w-3 h-3" />
              {room.id}
            </div>
            <h3 className="text-xl font-bold">Lista de Presença: {room.subject}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</p>
              <p className="text-lg font-bold text-slate-700">{room.capacity}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Presentes</p>
              <p className="text-lg font-bold text-indigo-600">{presentStudents.length}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Sincronizado Agora
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {presentStudents.length > 0 ? (
            <div className="space-y-3">
              {presentStudents.map((student, idx) => (
                <div 
                  key={student.id} 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-sm transition-shadow animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <img src={student.photoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm" alt={student.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400 font-medium">ID: {student.id}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" />
                      Entrada: {student.lastAccess}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-tight">
                      Confirmado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 opacity-50 italic">
               <User className="w-12 h-12 mb-4" />
               <p className="font-medium">Nenhum aluno registrado nesta sala no momento.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomMap;
