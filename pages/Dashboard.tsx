
import React, { useState } from 'react';
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
  Moon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockAnnouncements, mockMenu, mockStudents } from '../services/mockData';

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
}

const Dashboard: React.FC<DashboardProps> = ({ isTvMode = false, onExitTv }) => {
  const [time, setTime] = useState(new Date());
  const [tvTheme, setTvTheme] = useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const todayFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const birthdayStudents = mockStudents.filter(s => s.birthday === todayFormatted);

  // Weather mock data
  const weather = {
    temp: 24,
    condition: 'Ensolarado',
    city: 'São Paulo, SP',
    forecast: [
      { day: 'Amanhã', temp: 26, icon: Sun },
      { day: 'Qua', temp: 22, icon: CloudRain },
      { day: 'Qui', temp: 25, icon: CloudSun },
    ]
  };

  // Determine current classes based on mode and theme
  const isDark = isTvMode ? tvTheme === 'dark' : false;
  
  const containerClasses = isTvMode 
    ? `p-12 min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`
    : 'space-y-8';

  const cardClasses = (isTvMode: boolean, isDark: boolean) => {
    if (!isTvMode) return 'bg-white border-slate-200 shadow-sm';
    return isDark ? 'bg-slate-900 border-slate-800 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-lg';
  };

  const textSlateColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const textTitleColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className={`space-y-8 ${containerClasses}`}>
      {/* Header with Clock and Weather */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className={`font-bold mb-2 ${isTvMode ? 'text-4xl' : 'text-2xl text-slate-800'}`}>
            {isTvMode ? 'Painel Institucional Digital' : 'Painel Institucional'}
          </h1>
          <p className={`${isTvMode ? 'text-xl ' + textSlateColor : 'text-slate-500'}`}>
            {time.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-6 md:gap-12">
          {/* Weather Display */}
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-end ${isTvMode ? (isDark ? 'text-white' : 'text-slate-700') : 'text-slate-700'}`}>
              <span className={`font-bold ${isTvMode ? 'text-3xl' : 'text-xl'}`}>{weather.temp}°C</span>
              <span className={`text-sm ${isTvMode ? textSlateColor : 'text-slate-500'}`}>{weather.condition}</span>
            </div>
            <div className={`p-3 rounded-2xl ${isTvMode ? (isDark ? 'bg-slate-800' : 'bg-amber-50') : 'bg-indigo-50 text-indigo-600'}`}>
              <CloudSun className={isTvMode ? 'w-10 h-10 text-amber-400' : 'w-6 h-6'} />
            </div>
          </div>

          {/* Clock Display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={`font-mono font-bold leading-none ${isTvMode ? 'text-5xl' : 'text-3xl text-slate-800'}`}>
                {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                <span className="text-sm ml-1 opacity-50">{time.toLocaleTimeString('pt-BR', { second: '2-digit' })}</span>
              </p>
              <p className={`text-sm ${isTvMode ? textSlateColor : 'text-slate-500'}`}>Horário Local</p>
            </div>
            
            {isTvMode && (
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button 
                  onClick={() => setTvTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                  className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 shadow-sm'}`}
                  title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
                >
                  {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                
                {/* Exit TV Mode */}
                <button onClick={onExitTv} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm'}`}>
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Alunos Presentes (Escola)" 
          value="455" 
          sub="94.2% do total" 
          icon={Users} 
          color="indigo" 
          trend="up"
          isTvMode={isTvMode}
          isDark={isDark}
        />
        <KpiCard 
          title="Em Sala de Aula" 
          value="412" 
          sub="85% dos presentes" 
          icon={MapPin} 
          color="emerald" 
          trend="up"
          isTvMode={isTvMode}
          isDark={isDark}
        />
        <KpiCard 
          title="Ausências Hoje" 
          value="25" 
          sub="5.8% do total" 
          icon={UserMinus} 
          color="rose" 
          trend="down"
          isTvMode={isTvMode}
          isDark={isDark}
        />
        <KpiCard 
          title="Atrasos Detectados" 
          value="12" 
          sub="Entrada após 07:15" 
          icon={Calendar} 
          color="amber" 
          trend="neutral"
          isTvMode={isTvMode}
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className={`lg:col-span-2 rounded-3xl p-8 border ${cardClasses(isTvMode, isDark)}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className={`text-xl font-bold ${textTitleColor}`}>Frequência Semanal</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className={`text-xs ${textSlateColor}`}>Presença</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className={`text-xs ${textSlateColor}`}>Faltas</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="presenca" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="faltas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Birthdays Section */}
          <div className={`rounded-3xl p-8 border ${cardClasses(isTvMode, isDark)}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                <Cake className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold ${textTitleColor}`}>Aniversariantes</h3>
            </div>
            {birthdayStudents.length > 0 ? (
              <div className="space-y-4">
                {birthdayStudents.map(student => (
                  <div key={student.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${isDark ? 'bg-pink-900/10 border-pink-900/30' : 'bg-pink-50 border-pink-100'}`}>
                    <img src={student.photoUrl} alt={student.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className={`font-bold leading-tight ${textTitleColor}`}>{student.name}</p>
                      <p className={`text-xs font-medium ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>Turma {student.classId}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${textSlateColor} text-sm italic`}>Nenhum aniversariante hoje.</p>
            )}
          </div>

          {/* Cardápio */}
          <div className={`rounded-3xl p-8 border ${cardClasses(isTvMode, isDark)}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold ${textTitleColor}`}>Cardápio do Dia</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className={`text-sm mb-1 ${textSlateColor}`}>Prato Principal</p>
                <p className="font-semibold text-lg">{mockMenu.mainDish}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${textSlateColor}`}>Acompanhamento</p>
                <p className="font-semibold">{mockMenu.side}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${textSlateColor}`}>Sobremesa</p>
                <p className="font-semibold text-indigo-500">{mockMenu.dessert}</p>
              </div>
            </div>
          </div>

          {/* Bulletin Board */}
          <div className={`rounded-3xl p-8 border ${cardClasses(isTvMode, isDark)}`}>
             <h3 className={`text-xl font-bold mb-6 ${textTitleColor}`}>Avisos e Eventos</h3>
             <div className="space-y-6">
               {mockAnnouncements.map(a => (
                 <div key={a.id} className="group cursor-pointer">
                   <div className="flex items-center justify-between mb-1">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${a.category === 'EVENT' ? (isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-600') : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')}`}>
                       {a.category}
                     </span>
                     <span className={`text-xs ${textSlateColor}`}>{a.scheduledFor}</span>
                   </div>
                   <h4 className={`font-bold group-hover:text-indigo-600 transition-colors ${textTitleColor}`}>{a.title}</h4>
                   <p className={`text-sm line-clamp-2 ${textSlateColor}`}>{a.content}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
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
    indigo: 'bg-indigo-900/30 text-indigo-400 border-indigo-800',
    rose: 'bg-rose-900/30 text-rose-400 border-rose-800',
    emerald: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
    amber: 'bg-amber-900/30 text-amber-400 border-amber-800',
  };

  const tvColorsLight = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  const bgColor = isTvMode 
    ? (isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-lg') 
    : 'bg-white border-slate-200 shadow-sm';
    
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';

  const iconStyles = isTvMode 
    ? (isDark ? tvColorsDark[color] : tvColorsLight[color]) 
    : colors[color];

  return (
    <div className={`rounded-3xl p-6 border transition-all hover:scale-[1.02] ${bgColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${iconStyles}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend === 'up' && <ArrowUpRight className="w-5 h-5 text-emerald-500" />}
        {trend === 'down' && <ArrowDownRight className="w-5 h-5 text-rose-500" />}
      </div>
      <p className={`text-sm font-medium mb-1 ${subTextColor}`}>{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        <span className={`text-xs font-medium ${subTextColor}`}>{sub}</span>
      </div>
    </div>
  );
};

export default Dashboard;
