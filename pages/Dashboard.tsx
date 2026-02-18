
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  UserMinus, 
  Calendar, 
  Utensils, 
  ArrowUpRight, 
  ArrowDownRight,
  Maximize2,
  Cake,
  CloudSun,
  CloudRain,
  Sun,
  Moon,
  Clock as ClockIcon,
  BookOpen,
  X,
  Megaphone,
  Bell,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { mockAnnouncements, mockMenu } from '../services/mockData';
import { Student } from '../types';

const data = [
  { name: 'Seg', presenca: 450, faltas: 30 },
  { name: 'Ter', presenca: 462, faltas: 18 },
  { name: 'Qua', presenca: 440, faltas: 40 },
  { name: 'Qui', presenca: 458, faltas: 22 },
  { name: 'Sex', presenca: 455, faltas: 25 },
];

interface DashboardProps {
  isTvMode?: boolean;
  onExitTv?: () => void;
  students?: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ isTvMode = false, onExitTv, students = [] }) => {
  const [time, setTime] = useState(new Date());
  const [tvTheme, setTvTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const birthdayStudents = students.filter(s => {
    if (!s.birthday) return false;
    const studentMonthDay = s.birthday.split('-').slice(1).join('-');
    return studentMonthDay === currentMonthDay;
  });

  // Dynamic KPI Calculations
  const inSchool = students.filter(s => s.status !== 'AWAY' && s.status !== 'ABSENT').length;
  const inClass = students.filter(s => s.status === 'IN_CLASS').length;
  const absents = students.filter(s => s.status === 'ABSENT').length;
  const lates = students.filter(s => s.status === 'LATE').length;
  const totalStudents = students.length;
  const presenceRate = totalStudents > 0 ? ((inSchool / totalStudents) * 100).toFixed(1) : "0";

  const isDark = isTvMode ? tvTheme === 'dark' : false;
  
  const containerClasses = isTvMode 
    ? `fixed inset-0 z-[1000] p-6 flex flex-col gap-5 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`
    : 'space-y-8 pb-10'; // Added padding bottom for scrolling content

  const textSlateColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const textTitleColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className={containerClasses}>
      {isTvMode && (
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
              white-space: nowrap;
            }
            .birthday-glow {
              box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
            }
          `}
        </style>
      )}

      {/* Header */}
      <div className={`flex justify-between items-center ${isTvMode ? 'mb-0' : ''}`}>
        <div className="flex items-center gap-6">
          {isTvMode && (
             <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-8 h-8 text-white" />
             </div>
          )}
          <div>
            <h1 className={`font-black tracking-tighter ${isTvMode ? 'text-4xl' : 'text-2xl text-slate-800'}`}>
              {isTvMode ? 'EduTrack Pro' : 'Painel Institucional'}
            </h1>
            <p className={`font-medium ${isTvMode ? 'text-lg ' + textSlateColor : 'text-slate-500'}`}>
              {time.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className={`font-mono font-black leading-none tracking-tighter ${isTvMode ? 'text-6xl' : 'text-3xl text-slate-800'}`}>
                  {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  <span className={`${isTvMode ? 'text-xl ml-2' : 'text-sm ml-1'} opacity-30`}>
                    {time.toLocaleTimeString('pt-BR', { second: '2-digit' })}
                  </span>
                </p>
                {isTvMode && <p className="text-sm font-bold uppercase tracking-widest text-indigo-500">Live Campus Feed</p>}
             </div>
          </div>

          {isTvMode && (
            <div className="flex items-center gap-3 border-l border-slate-800/20 pl-6">
              <button 
                onClick={() => setTvTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'bg-white border border-slate-200 text-indigo-600 shadow-lg'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={onExitTv} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-rose-900/20 text-rose-500 border border-rose-900/30' : 'bg-white border border-slate-200 text-slate-600 shadow-lg'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPIs Dinâmicos */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${isTvMode ? 'gap-4' : 'gap-6'}`}>
        <KpiCard title="Presença" value={presenceRate + "%"} sub={`${inSchool} alunos`} icon={Users} color="indigo" trend="up" isTvMode={isTvMode} isDark={isDark} />
        <KpiCard title="Em Aula" value={inClass.toString()} sub="Confirmados" icon={MapPin} color="emerald" trend="up" isTvMode={isTvMode} isDark={isDark} />
        <KpiCard title="Atrasos" value={lates.toString()} sub="Tolerância Excedida" icon={ClockIcon} color="amber" trend="neutral" isTvMode={isTvMode} isDark={isDark} />
        <KpiCard title="Ausências" value={absents.toString()} sub="Não compareceram" icon={UserMinus} color="rose" trend="down" isTvMode={isTvMode} isDark={isDark} />
      </div>

      {/* Main Content Area */}
      <div className={`grid grid-cols-12 ${isTvMode ? 'gap-4 min-h-0 flex-1' : 'gap-8'}`}>
        
        {/* Coluna 1: Gráfico de Frequência */}
        <div className={`col-span-12 lg:col-span-6 rounded-[1.5rem] p-6 border flex flex-col ${isTvMode ? (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl') : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className={`font-black ${isTvMode ? 'text-2xl mb-1' : 'text-xl'} ${textTitleColor}`}>Frequência Semanal</h3>
              <p className={`text-sm ${textSlateColor}`}>Taxa de ocupação histórica</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: isTvMode ? 14 : 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: isTvMode ? 12 : 12}} />
                <Tooltip 
                  cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#ffffff' : '#000000', padding: '8px' }}
                />
                <Bar dataKey="presenca" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={isTvMode ? 40 : 40} />
                <Bar dataKey="faltas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={isTvMode ? 40 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna 2: Cardápio do Dia */}
        <div className={`col-span-12 lg:col-span-3 rounded-[1.5rem] p-6 border flex flex-col ${isTvMode ? (isDark ? 'bg-indigo-900/10 border-indigo-900/30' : 'bg-white border-slate-200 shadow-xl') : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4 text-indigo-500">
            <Utensils className="w-6 h-6" />
            <h3 className={`font-black ${isTvMode ? 'text-xl' : 'text-xl'} ${textTitleColor}`}>Refeição</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4">
             <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Menu Principal</p>
                <p className={`font-black leading-tight ${isTvMode ? 'text-lg' : 'text-lg'}`}>{mockMenu.mainDish}</p>
             </div>
             <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Acompanhamento</p>
                <p className={`font-bold leading-tight ${isTvMode ? 'text-md' : 'text-sm'}`}>{mockMenu.side}</p>
             </div>
             <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Sobremesa</p>
                <p className={`font-bold leading-tight ${isTvMode ? 'text-md' : 'text-sm'}`}>{mockMenu.dessert}</p>
             </div>
          </div>
        </div>

        {/* Coluna 3: Aniversariantes do Dia */}
        <div className={`col-span-12 lg:col-span-3 rounded-[1.5rem] p-6 border flex flex-col min-h-[300px] ${isTvMode ? (isDark ? 'bg-pink-900/10 border-pink-900/30' : 'bg-white border-slate-200 shadow-xl') : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4 text-pink-500">
            <Cake className="w-6 h-6" />
            <h3 className={`font-black ${isTvMode ? 'text-xl' : 'text-xl'} ${textTitleColor}`}>Comemorações</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-hide">
            {birthdayStudents.length > 0 ? (
              birthdayStudents.map(student => (
                <div key={student.id} className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                  <div className="relative shrink-0">
                    <img src={student.photoUrl} alt={student.name} className={`w-14 h-14 rounded-full border-2 border-white object-cover shadow-md ${isTvMode ? 'birthday-glow' : ''}`} />
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-1 rounded-full border border-white">
                      <Sparkles className="w-2 h-2" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black truncate leading-tight ${isTvMode ? 'text-lg' : 'text-lg'} ${textTitleColor}`}>{student.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`font-bold text-[10px] ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>Turma {student.classId}</p>
                      <span className="text-[8px] font-black uppercase bg-pink-500 text-white px-1.5 py-0.5 rounded leading-none">Parabéns!</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                 <Cake className="w-12 h-12 mb-2" />
                 <p className="text-sm font-bold">Sem aniversários hoje</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mural de Avisos em formato de Cards */}
      {!isTvMode && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Mural de Avisos Institucionais</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAnnouncements.map(ann => (
              <div key={ann.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all hover:shadow-indigo-100/50 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    ann.category === 'URGENT' ? 'bg-rose-100 text-rose-600' :
                    ann.category === 'EVENT' ? 'bg-amber-100 text-amber-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {ann.category === 'URGENT' ? 'Urgente' : ann.category === 'EVENT' ? 'Evento' : 'Geral'}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold">
                      {new Date(ann.scheduledFor).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{ann.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{ann.content}</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                   <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Ticker - Apenas Modo TV */}
      {isTvMode && (
        <div className={`h-12 flex items-center overflow-hidden rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-inner'}`}>
          <div className="bg-indigo-600 px-4 h-full flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest z-10 shrink-0">
            <Megaphone className="w-4 h-4 animate-bounce" />
            <span>Mural de Avisos</span>
          </div>
          <div className="flex-1 flex items-center overflow-hidden relative">
            <div className={`animate-marquee flex items-center gap-24 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {mockAnnouncements.map(ann => (
                <div key={ann.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ann.category === 'URGENT' ? 'bg-rose-500 animate-ping' : 'bg-indigo-500'}`}></div>
                  <span className="font-bold uppercase text-xs tracking-wide text-indigo-500">{ann.title}:</span>
                  <span className="text-sm font-semibold">{ann.content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string;
  sub: string;
  icon: any;
  color: 'indigo' | 'rose' | 'emerald' | 'amber';
  trend: 'up' | 'down' | 'neutral';
  isTvMode: boolean;
  isDark: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, sub, icon: Icon, color, trend, isTvMode, isDark }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const tvColorsDark = {
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  const bgColor = isTvMode 
    ? (isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-lg') 
    : 'bg-white border-slate-200 shadow-sm';
    
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const iconStyles = isTvMode ? (isDark ? tvColorsDark[color] : colors[color]) : colors[color];

  return (
    <div className={`rounded-[1.5rem] transition-all p-5 border ${bgColor}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-3 rounded-xl border ${iconStyles}`}>
          <Icon className={isTvMode ? 'w-6 h-6' : 'w-6 h-6'} />
        </div>
        {isTvMode && (
           <div className="pt-1">
              {trend === 'up' && <ArrowUpRight className="w-6 h-6 text-emerald-500 opacity-50" />}
              {trend === 'down' && <ArrowDownRight className="w-6 h-6 text-rose-500 opacity-50" />}
           </div>
        )}
      </div>
      <p className={`font-bold mb-0.5 ${isTvMode ? 'text-sm uppercase tracking-wider' : 'text-sm'} ${subTextColor}`}>{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className={`font-black tracking-tighter ${isTvMode ? 'text-4xl' : 'text-3xl'}`}>{value}</h4>
        <span className={`font-bold ${isTvMode ? 'text-sm' : 'text-xs'} ${subTextColor}`}>{sub}</span>
      </div>
    </div>
  );
};

export default Dashboard;
