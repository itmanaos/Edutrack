
import React from 'react';
import { mockClassrooms } from '../services/mockData';
import { Classroom } from '../types';
import { User, BookOpen, AlertTriangle } from 'lucide-react';

const ClassroomMap: React.FC = () => {
  return (
    <div className="space-y-8">
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
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

const RoomCard: React.FC<{ room: Classroom }> = ({ room }) => {
  const occupancyRate = (room.currentCount / room.capacity) * 100;
  const isHighOccupancy = occupancyRate > 85;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all hover:shadow-md group">
      <div className="p-6">
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
      <button className="w-full py-4 bg-slate-50 border-t border-slate-100 text-sm font-bold text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        Ver Lista de Presença
      </button>
    </div>
  );
};

export default ClassroomMap;
