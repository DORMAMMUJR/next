import React, { useState, useEffect } from 'react';
import { CITIES } from './constants';
import { Role, AdminSection, CityData, AuditLogEntry } from './types';
import StudentLogin from './components/LandingPage';
import Layout from './components/Layout';
import CampusSelector from './components/CampusSelector';
import AdminAuditTable from './components/AdminAuditTable';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminSection>('dashboard');
  
  // ESTADO PRINCIPAL DE DATOS
  const [data, setData] = useState<CityData>({ 
    alumnos: [], matriculas: [], pagos: [], expedientes: [], docentes: [] 
  });
  
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [currentProofUrl, setCurrentProofUrl] = useState<string | null>(null);

  // --- CARGAR DATOS DESDE LA BASE DE DATOS (SERVER) ---
  useEffect(() => {
    if (currentSlug) {
      // Llamada a la API Real
      fetch('/api/dashboard')
        .then(res => {
          if (!res.ok) throw new Error("Error cargando datos");
          return res.json();
        })
        .then(dbData => {
          // Si la DB tiene datos, los cargamos
          if (dbData.alumnos) {
            setData(dbData);
          }
        })
        .catch(err => {
          console.error("Error conectando a API:", err);
          setToastMsg("⚠️ Error de conexión con Base de Datos");
        });
    }
  }, [currentSlug]);

  const showToast = (message: string) => {
    setToastMsg(message);
  };

  const handleLogin = async (identifier: string, credential: string, role: Role): Promise<{ success: boolean; error?: string; status?: 'CLEAN' | 'DEBT' }> => {
    // Login Simulado (Validando contra los datos cargados de la DB)
    if (role === Role.ALUMNO) {
      if (identifier === '123' && credential === '123') { // Backdoor para pruebas
         const demoStudent = data.alumnos[0];
         if (demoStudent) {
            setCurrentSlug('aguascalientes');
            setSelectedAlumnoId(demoStudent.id);
            setActiveRole(Role.ALUMNO);
            setShowLogin(false);
            return { success: true, status: demoStudent.financial_status || 'CLEAN' };
         }
      }
      const alumno = data.alumnos.find(a => a.matricula === identifier && a.fecha_nacimiento === credential);
      if (!alumno) return { success: false, error: "Credenciales incorrectas." };
      
      if (alumno.financial_status === 'DEBT') return { success: false, status: 'DEBT' };
      
      setSelectedAlumnoId(alumno.id);
      setActiveRole(Role.ALUMNO);
      setShowLogin(false);
      return { success: true, status: 'CLEAN' };
    } 
    else if (role === Role.PROFESOR) {
      // Login simple para docentes
      if (identifier === 'DOC-001') {
        setActiveRole(Role.PROFESOR);
        setCurrentSlug('aguascalientes');
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Docente no encontrado." };
    }
    else if (role === Role.OWNER) {
      // Login de Dueña
      if ((identifier === '1234' && credential === '123')) {
        setActiveRole(Role.OWNER);
        setCurrentSlug(null); 
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Acceso no autorizado." };
    }
    return { success: false, error: "Rol no reconocido." };
  };

  // --- VALIDACIÓN DE PAGOS (CONECTADO A DB) ---
  const togglePaymentVerification = (pagoId: string, currentStatus: boolean, alumnoId: string) => {
    // 1. Calcular nuevo estado optimista
    const newVerified = !currentStatus;
    
    // 2. Determinar si el alumno queda debiendo o limpio
    const updatedPagos = data.pagos.map(p => p.id === pagoId ? { ...p, verified: newVerified } : p);
    const studentPagos = updatedPagos.filter(p => p.alumno_id === alumnoId);
    const hasPending = studentPagos.some(p => p.estatus === 'Vencido' || (p.estatus === 'Pagado' && !p.verified));
    const newStatus = hasPending ? 'DEBT' : 'CLEAN';

    // 3. Enviar a la Base de Datos
    fetch('/api/pagos/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagoId, verified: newVerified, alumnoId, newStatus })
    }).catch(err => console.error("Error guardando pago:", err));

    // 4. Actualizar UI inmediatamente
    setData(prev => ({
      ...prev,
      pagos: updatedPagos,
      alumnos: prev.alumnos.map(a => a.id === alumnoId ? { ...a, financial_status: newStatus } : a)
    }));
    
    showToast(newVerified ? "Pago validado correctamente" : "Validación revocada");
  };

  // --- GUARDAR CALIFICACIÓN (CONECTADO A DB) ---
  const handleGradeSave = (alumnoId: string, newGrade: number) => {
    // Enviar a la Base de Datos
    fetch('/api/alumnos/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumnoId, grade: newGrade })
    }).catch(err => console.error("Error guardando nota:", err));

    // Actualizar UI
    setData(prev => ({
      ...prev,
      alumnos: prev.alumnos.map(a => a.id === alumnoId ? { ...a, calificacion_parcial: newGrade } : a)
    }));
    showToast(`Calificación guardada: ${newGrade}`);
  };

  const openProofModal = (url: string) => {
    setCurrentProofUrl(url);
    setProofModalOpen(true);
  };

  // --- VISTAS ---
  const OwnerDashboard = () => {
    if (!currentSlug) return <CampusSelector onSelect={(slug) => { setCurrentSlug(slug); setActiveTab('dashboard'); }} />;
    const totalStudents = data.alumnos.length;
    const totalVerifiedIncome = data.pagos.filter(p => p.estatus === 'Pagado' && p.verified).reduce((acc, curr) => acc + Number(curr.monto), 0);

    return (
      <div className="space-y-10 animate-in fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-100 pb-8">
          <div>
             <button onClick={() => setCurrentSlug(null)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-2 flex items-center gap-1 transition-colors">← Volver a Sedes</button>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Sede {currentSlug}</h2>
             <p className="text-xs font-bold text-zinc-500 mt-1">Panel de Auditoría y Control Financiero</p>
          </div>
          <div className="flex gap-8 text-right">
             <div className="bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Alumnos Activos</p>
                <p className="text-2xl font-black">{totalStudents}</p>
             </div>
             <div className="bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Ingreso Validado</p>
                <p className="text-2xl font-black text-next-green font-mono">${totalVerifiedIncome.toLocaleString()}</p>
             </div>
          </div>
        </div>
        <AdminAuditTable data={data} onVerifyPayment={togglePaymentVerification} onOpenProof={openProofModal} />
      </div>
    );
  };

  const TeacherView = () => {
    return (
      <div className="space-y-8 animate-in fade-in">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Lista de Calificaciones <span className="text-next-green">.</span></h2>
        <div className="bg-white border border-zinc-200 rounded-[32px] overflow-visible shadow-sm pb-32">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-600">
              <tr><th className="p-6">Alumno</th><th className="p-6">Matrícula</th><th className="p-6">Estatus</th><th className="p-6 text-right w-48">Calificación</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.alumnos.map(a => {
                const isBlocked = a.financial_status === 'DEBT';
                return (
                  <tr key={a.id} className={`transition-all ${isBlocked ? 'bg-zinc-50/50' : 'hover:bg-zinc-50'}`}>
                    <td className="p-6"><p className="font-bold text-sm uppercase text-black">{a.nombre_completo}</p></td>
                    <td className="p-6 text-xs font-mono text-zinc-700">{a.matricula}</td>
                    <td className="p-6"><span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${isBlocked ? 'bg-zinc-200 text-zinc-600' : 'bg-green-100 text-green-800'}`}>{isBlocked ? 'Restringido' : 'Habilitado'}</span></td>
                    <td className="p-6 text-right relative z-10"><SafeGradeInput currentGrade={a.calificacion_parcial} studentName={a.nombre_completo} isLocked={isBlocked} onSave={(newGrade) => handleGradeSave(a.id, newGrade)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (showLogin) return <StudentLogin onLogin={handleLogin} />;

  return (
    <>
      {activeRole === Role.OWNER && (
        <Layout activeRole={Role.OWNER} onRoleSelect={() => {}} onHome={() => { setCurrentSlug(null); setActiveTab('dashboard'); }} onLogout={() => setShowLogin(true)} onSedes={() => setCurrentSlug(null)} currentAdminSection={activeTab} onAdminSectionChange={(section) => setActiveTab(section)}>
          {activeTab === 'dashboard' ? <OwnerDashboard /> : <div className="p-10 text-center font-black uppercase text-zinc-300">Módulo en construcción</div>}
        </Layout>
      )}
      {activeRole === Role.PROFESOR && (
        <Layout activeRole={Role.PROFESOR} onRoleSelect={() => {}} onHome={() => setActiveTab('materias')} onLogout={() => setShowLogin(true)} onSedes={() => {}}>
          <TeacherView />
        </Layout>
      )}
      {/* Toast y Modales */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
};

export default App;