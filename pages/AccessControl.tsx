
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Smartphone, Keyboard, CheckCircle2, AlertCircle, History, RefreshCcw, Send, Loader2, Clock } from 'lucide-react';
import { Student } from '../types';

interface AccessControlProps {
  students: Student[];
  onUpdateStatus: (id: string, status: Student['status'], time: string) => void;
}

const AccessControl: React.FC<AccessControlProps> = ({ students, onUpdateStatus }) => {
  const [method, setMethod] = useState<'FACIAL' | 'QR' | 'MANUAL'>('FACIAL');
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [notificationStatus, setNotificationStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (method === 'FACIAL' && status === 'SCANNING') {
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [method, status]);

  const startCamera = async () => {
    setErrorMessage('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Navegador não suporta acesso à câmera.");
      setStatus('ERROR');
      return;
    }

    try {
      const constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error("Error playing video:", playErr);
        }
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage("Permissão de câmera negada pelo usuário.");
      } else {
        setErrorMessage("Erro ao iniciar a fonte de vídeo.");
      }
      setStatus('ERROR');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const simulateScan = () => {
    setStatus('SCANNING');
    if (method !== 'FACIAL') {
      performScanLogic();
    } else {
      setTimeout(() => {
        performScanLogic();
      }, 2000);
    }
  };

  const performScanLogic = () => {
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Automatic Status Logic: If time > 08:15 mark as LATE
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 15);
    const newStatus = isLate ? 'LATE' : 'IN_SCHOOL';

    setMatchedStudent({ ...randomStudent, status: newStatus, lastAccess: currentTimeStr });
    onUpdateStatus(randomStudent.id, newStatus, currentTimeStr);
    
    setStatus('SUCCESS');
    setNotificationStatus('SENDING');
    
    setTimeout(() => {
      setNotificationStatus('SENT');
    }, 1200);

    setLogs(prev => [{
      id: Date.now(),
      name: randomStudent.name,
      time: currentTimeStr,
      type: 'ENTRADA',
      status: newStatus
    }, ...prev]);

    setTimeout(() => {
      setStatus('IDLE');
      setMatchedStudent(null);
      setNotificationStatus('IDLE');
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Controle de Portaria</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setMethod('FACIAL')} className={`p-2 rounded-lg transition-all ${method === 'FACIAL' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}><Camera className="w-5 h-5" /></button>
                <button onClick={() => setMethod('QR')} className={`p-2 rounded-lg transition-all ${method === 'QR' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}><Scan className="w-5 h-5" /></button>
                <button onClick={() => setMethod('MANUAL')} className={`p-2 rounded-lg transition-all ${method === 'MANUAL' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}><Keyboard className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center justify-center min-h-[440px]">
              {status === 'IDLE' && (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                    {method === 'FACIAL' && <Camera className="w-16 h-16" />}
                    {method === 'QR' && <Scan className="w-16 h-16" />}
                    {method === 'MANUAL' && <Smartphone className="w-16 h-16" />}
                  </div>
                  <div><h4 className="text-xl font-bold">Aguardando Identificação</h4></div>
                  <button onClick={simulateScan} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Iniciar Processo</button>
                </div>
              )}

              {status === 'SCANNING' && (
                <div className="w-full flex flex-col items-center gap-6">
                  {method === 'FACIAL' ? (
                    <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                      <div className="absolute inset-0 border-4 border-indigo-500/30 border-dashed animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6"><div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                  )}
                </div>
              )}

              {status === 'SUCCESS' && matchedStudent && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in">
                  <div className="relative">
                    <img src={matchedStudent.photoUrl} className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-emerald-500 p-1" alt="Student" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white"><CheckCircle2 className="w-8 h-8" /></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-800">{matchedStudent.name}</h4>
                    <p className="text-indigo-600 font-semibold">{matchedStudent.classId} • ID: {matchedStudent.id}</p>
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <span className={`px-6 py-2 rounded-full text-sm font-bold uppercase ${matchedStudent.status === 'LATE' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} border`}>
                        {matchedStudent.status === 'LATE' ? 'Acesso c/ Atraso' : 'Acesso Autorizado'}
                      </span>
                      {notificationStatus === 'SENT' && (
                        <div className="flex items-center gap-2 text-indigo-500 animate-in slide-in-from-top-2">
                          <Send className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase">Responsáveis notificados</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3"><History className="w-5 h-5 text-slate-400" /><h3 className="font-bold text-lg">Histórico (Hoje)</h3></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.map(log => (
              <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">{log.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{log.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">{log.time} • Portaria</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${log.status === 'LATE' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {log.status === 'LATE' ? 'Atraso' : 'Presença'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
