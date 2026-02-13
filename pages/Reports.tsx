
import React from 'react';
import { 
  FileDown, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const analyticsData = [
  { month: 'Jan', taxa: 88 },
  { month: 'Fev', taxa: 92 },
  { month: 'Mar', taxa: 94 },
  { month: 'Abr', taxa: 91 },
  { month: 'Mai', taxa: 95 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios Estratégicos</h2>
          <p className="text-slate-500">Indicadores de desempenho e frequência institucional</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">
          <FileDown className="w-5 h-5" />
          <span>Exportar PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Chart */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Evolução da Presença</h3>
                  <p className="text-sm text-slate-500">Média mensal institucional</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">+3.2% vs mês anterior</span>
                </div>
             </div>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analyticsData}>
                   <defs>
                     <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip />
                   <Area type="monotone" dataKey="taxa" stroke="#6366f1" fillOpacity={1} fill="url(#colorTaxa)" strokeWidth={3} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Table of Low Frequency */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100">
               <h3 className="font-bold text-slate-800">Alerta de Evasão (Frequência &lt; 75%)</h3>
             </div>
             <div className="p-0">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                     <th className="px-6 py-4">Aluno</th>
                     <th className="px-6 py-4">Turma</th>
                     <th className="px-6 py-4">Faltas</th>
                     <th className="px-6 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-rose-50/30">
                      <td className="px-6 py-4 font-semibold text-slate-700">João Victor Pedroso</td>
                      <td className="px-6 py-4 text-sm text-slate-500">3º Ano A</td>
                      <td className="px-6 py-4 text-sm font-bold text-rose-500">14 dias</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                          <AlertCircle className="w-3 h-3" /> Crítico
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-rose-50/30">
                      <td className="px-6 py-4 font-semibold text-slate-700">Mariana Costa</td>
                      <td className="px-6 py-4 text-sm text-slate-500">1º Ano C</td>
                      <td className="px-6 py-4 text-sm font-bold text-amber-500">8 dias</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">Atenção</span>
                      </td>
                    </tr>
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Resumo por Turno</h3>
             <div className="space-y-6">
               <ShiftStat label="Matutino" value="96%" icon={Calendar} color="bg-emerald-100 text-emerald-600" />
               <ShiftStat label="Vespertino" value="91%" icon={Calendar} color="bg-indigo-100 text-indigo-600" />
               <ShiftStat label="Noturno" value="84%" icon={Calendar} color="bg-slate-100 text-slate-600" />
             </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <Users className="w-12 h-12 mb-4 opacity-50" />
               <h4 className="text-xl font-bold mb-2">Total de Alunos Ativos</h4>
               <p className="text-4xl font-black mb-6">1.240</p>
               <div className="flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-xl text-sm font-medium">
                 <span>+12 matriculados este mês</span>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShiftStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-semibold text-slate-700">{label}</span>
    </div>
    <span className="font-black text-slate-800">{value}</span>
  </div>
);

export default Reports;
