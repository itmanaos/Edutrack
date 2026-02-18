
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell, 
  CloudSun,
  LogOut,
  Monitor,
  Menu,
  X,
  Briefcase,
  AlertTriangle,
  Info
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AccessControl from './pages/AccessControl';
import ClassroomMap from './pages/ClassroomMap';
import Reports from './pages/Reports';
import Students from './pages/Students';
import Management from './pages/Management';
import { UserRole, EmergencyAlert, Student } from './types';
import { mockStudents as initialStudents } from './services/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [isTvMode, setIsTvMode] = useState(false);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  
  // Centralized Students State
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // Fullscreen management for TV Mode
  useEffect(() => {
    if (isTvMode) {
      document.documentElement.requestFullscreen?.().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [isTvMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsTvMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'access', label: 'Portaria', icon: DoorOpen, roles: [UserRole.ADMIN, UserRole.SECURITY] },
    { id: 'map', label: 'Mapa de Salas', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'students', label: 'Alunos', icon: Users, roles: [UserRole.ADMIN] },
    { id: 'management', label: 'Gestão', icon: Briefcase, roles: [UserRole.ADMIN] },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUserRole));

  const handleTriggerAlert = (alert: EmergencyAlert) => {
    setActiveAlert(alert);
    setTimeout(() => setActiveAlert(null), 8000);
  };

  const updateStudentStatus = (id: string, newStatus: Student['status'], accessTime: string) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, status: newStatus, lastAccess: accessTime } : s
    ));
  };

  if (isTvMode) {
    return <Dashboard isTvMode={true} onExitTv={() => setIsTvMode(false)} students={students} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {activeAlert && (
        <div className="fixed top-6 right-6 z-[200] w-96 animate-in slide-in-from-top-10 duration-500 ease-out">
          <div className={`p-5 rounded-3xl backdrop-blur-xl border shadow-2xl flex gap-4 ${
            activeAlert.type === 'CRITICAL' ? 'bg-rose-600/90 border-rose-500 text-white' : 
            activeAlert.type === 'URGENT' ? 'bg-amber-600/90 border-amber-500 text-white' : 
            'bg-slate-900/90 border-slate-700 text-white'
          }`}>
            <div className="bg-white/20 p-3 rounded-2xl h-fit">
              {activeAlert.type === 'CRITICAL' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Alerta EduTrack</p>
                <p className="text-[10px] opacity-50">Agora</p>
              </div>
              <h4 className="font-black text-sm mb-1">{activeAlert.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed line-clamp-2">{activeAlert.message}</p>
            </div>
            <button onClick={() => setActiveAlert(null)} className="p-1 hover:bg-white/10 rounded-lg h-fit">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">EduTrack Pro</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
             <button
              onClick={() => setIsTvMode(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Monitor className="w-5 h-5" />
              <span className="font-medium">Modo TV</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-6">
              <img src="https://picsum.photos/id/64/40/40" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin Gestor</p>
                <p className="text-xs text-slate-400 capitalize">{currentUserRole.toLowerCase()}</p>
              </div>
              <LogOut className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label || activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">24°C • São Paulo, SP</span>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-400 cursor-pointer hover:text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {activeTab === 'dashboard' && <Dashboard students={students} />}
          {activeTab === 'access' && <AccessControl students={students} onUpdateStatus={updateStudentStatus} />}
          {activeTab === 'map' && <ClassroomMap students={students} onUpdateStatus={updateStudentStatus} />}
          {activeTab === 'students' && <Students students={students} />}
          {activeTab === 'management' && <Management onAlertTriggered={handleTriggerAlert} />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </main>
    </div>
  );
};

export default App;
