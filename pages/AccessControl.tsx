
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Smartphone, Keyboard, CheckCircle2, AlertCircle, History, RefreshCcw } from 'lucide-react';
import { mockStudents } from '../services/mockData';
import { Student } from '../types';

const AccessControl: React.FC = () => {
  const [method, setMethod] = useState<'FACIAL' | 'QR' | 'MANUAL'>('FACIAL');
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (method === 'FACIAL' && status === 'SCANNING') {
      // Use a slight delay to ensure the video element is mounted in the DOM
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
        // Ensure play is called after setting srcObject
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
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage("Nenhuma câmera encontrada no dispositivo.");
      } else {
        setErrorMessage("Erro ao iniciar a fonte de vídeo. Verifique as permissões.");
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
    // If it's not facial, we just simulate a delay. 
    // If it IS facial, the useEffect handles startCamera.
    if (method !== 'FACIAL') {
      performScanLogic();
    } else {
      // For facial, we wait 3 seconds of "looking" at the camera
      setTimeout(() => {
        if (status === 'SCANNING') performScanLogic();
      }, 3000);
    }
  };

  const performScanLogic = () => {
    const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    setMatchedStudent(randomStudent);
    setStatus('SUCCESS');
    setLogs(prev => [{
      id: Date.now(),
      name: randomStudent.name,
      time: new Date().toLocaleTimeString(),
      type: 'ENTRADA'
    }, ...prev]);

    // Reset after 3 seconds
    setTimeout(() => {
      setStatus('IDLE');
      setMatchedStudent(null);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Interactive Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Controle de Portaria</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => { setMethod('FACIAL'); setStatus('IDLE'); }}
                  className={`p-2 rounded-lg transition-all ${method === 'FACIAL' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                  title="Reconhecimento Facial"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setMethod('QR'); setStatus('IDLE'); }}
                  className={`p-2 rounded-lg transition-all ${method === 'QR' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                  title="QR Code"
                >
                  <Scan className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setMethod('MANUAL'); setStatus('IDLE'); }}
                  className={`p-2 rounded-lg transition-all ${method === 'MANUAL' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                  title="Entrada Manual"
                >
                  <Keyboard className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center justify-center min-h-[440px]">
              {status === 'IDLE' && (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    {method === 'FACIAL' && <Camera className="w-16 h-16" />}
                    {method === 'QR' && <Scan className="w-16 h-16" />}
                    {method === 'MANUAL' && <Smartphone className="w-16 h-16" />}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Aguardando Aproximação</h4>
                    <p className="text-slate-500">
                      {method === 'FACIAL' ? 'Posicione o aluno em frente à câmera' : 
                       method === 'QR' ? 'Aponte o QR Code para o leitor' : 
                       'Digite o ID do aluno no terminal'}
                    </p>
                  </div>
                  <button 
                    onClick={simulateScan}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all transform active:scale-95"
                  >
                    {method === 'FACIAL' ? 'Ativar Câmera' : 'Iniciar Leitura'}
                  </button>
                </div>
              )}

              {status === 'SCANNING' && (
                <div className="w-full flex flex-col items-center gap-6">
                  {method === 'FACIAL' ? (
                    <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover scale-x-[-1]" 
                      />
                      <div className="absolute inset-0 border-4 border-indigo-500/30 border-dashed animate-pulse pointer-events-none"></div>
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        LIVE FEED
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-64 border-2 border-white/20 rounded-[40%]"></div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-xs font-bold uppercase tracking-widest bg-gradient-to-t from-black/80 to-transparent p-4">
                        Analisando Biometria...
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-500 font-medium">Aguardando entrada de dados...</p>
                    </div>
                  )}
                  <button 
                    onClick={() => setStatus('IDLE')}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {status === 'SUCCESS' && matchedStudent && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="relative">
                    <img src={matchedStudent.photoUrl} className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-emerald-500 p-1 shadow-xl" alt="Student" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-800">{matchedStudent.name}</h4>
                    <p className="text-indigo-600 font-semibold">{matchedStudent.classId} • ID: {matchedStudent.id}</p>
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <span className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wide">
                        Acesso Autorizado
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Notificação enviada aos responsáveis</p>
                    </div>
                  </div>
                </div>
              )}

              {status === 'ERROR' && (
                <div className="text-center space-y-6 max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-rose-600">Erro de Dispositivo</h4>
                    <p className="text-slate-500 text-sm mt-2">{errorMessage || "Ocorreu um erro inesperado ao acessar o hardware."}</p>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={startCamera} 
                      className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Tentar Novamente
                    </button>
                    <button 
                      onClick={() => { setMethod('MANUAL'); setStatus('IDLE'); }} 
                      className="text-sm font-bold text-indigo-600 hover:underline"
                    >
                      Usar Entrada Manual
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-time Logs */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <History className="w-5 h-5 text-slate-400" />
               <h3 className="font-bold text-lg">Histórico (Hoje)</h3>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">Live Updates</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <History className="w-12 h-12 mb-2" />
                <p className="font-medium">Nenhum registro nas últimas horas</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-in slide-in-from-top duration-300">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-sm">
                    {log.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{log.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{log.time} • Terminal 01</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md tracking-widest uppercase">
                      Entrada
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
