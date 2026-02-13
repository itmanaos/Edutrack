
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
  Briefcase
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AccessControl from './pages/AccessControl';
import ClassroomMap from './pages/ClassroomMap';
import Reports from './pages/Reports';
import Students from './pages/Students';
import Management from './pages/Management';
import { UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [isTvMode, setIsTvMode] = useState(false);

  // Auto-close sidebar on mobile
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

  if (isTvMode) {
    return <Dashboard isTvMode={true} onExitTv={() => setIsTvMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
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

        {/* Dynamic Page Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'access' && <AccessControl />}
          {activeTab === 'map' && <ClassroomMap />}
          {activeTab === 'students' && <Students />}
          {activeTab === 'management' && <Management />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </main>
    </div>
  );
};

export default App;
