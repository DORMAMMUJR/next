import React, { useState, useEffect } from 'react';
import { CITIES } from './constants';
import { Role, AdminSection, CityData, AuditLogEntry } from './types';
import StudentLogin from './components/LandingPage';
import Layout from './components/Layout';
import CampusSelector from './components/CampusSelector';
import AdminAuditTable from './components/AdminAuditTable';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';

// --- MOCK DATA PARA DEMO ---
const MOCK_DATA: CityData = {
  docentes: [
    { id: 'DOC-001', nombre_completo: 'Lic. Roberto Martínez', sede_slug: 'aguascalientes', email: 'roberto@next.mx', especialidad: 'Matemáticas' },
    { id: 'DOC-002', nombre_completo: 'Mtra. Ana P. López', sede_slug: 'aguascalientes', email: 'ana@next.mx', especialidad: 'Humanidades' }
  ],
  alumnos: [
    { 
      id: 'AL-001', 
      nombre_completo: 'SOFÍA RODRÍGUEZ PÉREZ', 
      matricula: 'NX-001', 
      fecha_nacimiento: '01012000', 
      docente_id: 'DOC-001', 
      grupo: 'A', 
      generacion: '2024', 
      financial_status: 'CLEAN', 
      estatus: 'Activo', 
      telefono: '555-555-5555', 
      email: 'sofia@mail.com', 
      created_at: new Date().toISOString(),
      calificacion_parcial: 9.5
    },
    { 
      id: 'AL-002', 
      nombre_completo: 'LUIS GONZÁLEZ TORRES', 
      matricula: 'NX-002', 
      fecha_nacimiento: '01012000', 
      docente_id: 'DOC-001', 
      grupo: 'A', 
      generacion: '2024', 
      financial_status: 'DEBT', 
      estatus: 'Activo', 
      telefono: '555-555-5555', 
      email: 'luis@mail.com', 
      created_at: new Date().toISOString(),
      calificacion_parcial: 8.0
    },
    { 
      id: 'AL-003', 
      nombre_completo: 'FERNANDA CASTILLO', 
      matricula: 'NX-003', 
      fecha_nacimiento: '01012000', 
      docente_id: 'DOC-002', 
      grupo: 'B', 
      generacion: '2024', 
      financial_status: 'CLEAN', 
      estatus: 'Activo', 
      telefono: '555-555-5555', 
      email: 'fer@mail.com', 
      created_at: new Date().toISOString(),
      calificacion_parcial: 10
    }
  ],
  pagos: [
    { id: 'P-001', alumno_id: 'AL-001', concepto: 'Mensualidad Septiembre', monto: 2500, fecha_pago: new Date().toISOString(), metodo: 'Transferencia', estatus: 'Pagado', verified: true },
    { id: 'P-002', alumno_id: 'AL-002', concepto: 'Mensualidad Septiembre', monto: 2500, fecha_pago: new Date(Date.now() - 86400000 * 5).toISOString(), metodo: 'Efectivo', estatus: 'Vencido', verified: false },
    { id: 'P-003', alumno_id: 'AL-002', concepto: 'Inscripción', monto: 1500, fecha_pago: new Date(Date.now() - 86400000 * 30).toISOString(), metodo: 'Transferencia', estatus: 'Pagado', verified: true },
  ],
  matriculas: [],
  expedientes: []
};

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminSection>('dashboard');
  
  // ESTADO PRINCIPAL DE DATOS - Inicializado con Mock Data por si falla la API
  const [data, setData] = useState<CityData>(MOCK_DATA);
  
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [currentProofUrl, setCurrentProofUrl] = useState<string | null>(null);

  // --- ADD STUDENT STATE ---
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false); // Toggle
  const [newStudent, setNewStudent] = useState({
    nombre_completo: '',
    matricula: '',
    fecha_nacimiento: '',
    docente_id: '',
    grupo: '',
    generacion: ''
  });

  // --- LOGGING ACTION (CONECTADO A DB) ---
  const logAction = async (user_id: string, role: Role, action: 'LOGIN_SUCCESS' | 'PANIC_BUTTON' | 'UNAUTHORIZED_ACCESS', details?: string) => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user_id,
      role,
      action,
      details: details || ''
    };

    // 1. Guardar en Base de Datos vía API
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      
      // 2. Actualizar estado local para que se vea inmediato en la tabla
      setAuditLogs(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error("No se pudo persistir el log (Dev Mode):", err);
      // Fallback para dev
      setAuditLogs(prev => [newEntry, ...prev]);
    }
  };

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
          // Si la DB tiene datos, los cargamos. Si no (ej. local), usamos mock
          if (dbData.alumnos && dbData.alumnos.length > 0) {
            setData(dbData);
          } else {
             console.log("Usando Mock Data (DB vacía o desconectada)");
             setData(MOCK_DATA);
          }
        })
        .catch(err => {
          console.error("Error conectando a API (Usando Mock):", err);
          setData(MOCK_DATA);
        });
    }
  }, [currentSlug]);

  // --- CARGAR LOGS DE AUDITORÍA ---
  useEffect(() => {
    // Cargar logs desde la DB real al entrar como Admin
    if (activeRole === Role.ADMIN) {
      fetch('/api/logs')
        .then(res => {
            if (!res.ok) throw new Error("Error fetching logs");
            return res.json();
        })
        .then(dbLogs => {
           if(Array.isArray(dbLogs)) setAuditLogs(dbLogs);
        })
        .catch(err => console.error("Error cargando bitácora:", err));
    }
  }, [activeRole]);

  const showToast = (message: string) => {
    setToastMsg(message);
  };

  const handleLogin = async (identifier: string, credential: string, role: Role): Promise<{ success: boolean; error?: string; status?: 'CLEAN' | 'DEBT' }> => {
    
    // 1. ALUMNOS
    if (role === Role.ALUMNO) {
      // Buscar en Mock Data primero para asegurar acceso demo
      const alumno = data.alumnos.find(a => a.matricula === identifier && a.fecha_nacimiento === credential);
      
      if (!alumno) return { success: false, error: "Credenciales incorrectas." };
      
      logAction(identifier, Role.ALUMNO, 'LOGIN_SUCCESS', alumno.financial_status === 'DEBT' ? 'Login con bloqueo' : 'Acceso limpio');

      if (alumno.financial_status === 'DEBT') return { success: false, status: 'DEBT' };
      
      setSelectedAlumnoId(alumno.id);
      setActiveRole(Role.ALUMNO);
      setShowLogin(false);
      return { success: true, status: 'CLEAN' };
    } 
    
    // 2. DOCENTES
    else if (role === Role.PROFESOR) {
      if (identifier === 'DOC-001') {
        logAction(identifier, Role.PROFESOR, 'LOGIN_SUCCESS');
        setActiveRole(Role.PROFESOR);
        setCurrentSlug('aguascalientes');
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Docente no encontrado." };
    }
    
    // 3. ADMIN (Antes Dueña)
    else if (role === Role.ADMIN) {
      if ((identifier === 'admin' && credential === 'admin123')) {
        logAction(identifier, Role.ADMIN, 'LOGIN_SUCCESS');
        setActiveRole(Role.ADMIN);
        setCurrentSlug(null); 
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Acceso no autorizado." };
    }
    return { success: false, error: "Rol no reconocido." };
  };

  // --- HANDLE ADD STUDENT ---
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ALUM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newStudentObj = {
        ...newStudent,
        id,
        financial_status: 'CLEAN' as 'CLEAN',
        estatus: 'Activo' as 'Activo',
        email: 'nuevo@alumno.com',
        telefono: '0000000000',
        created_at: new Date().toISOString(),
        calificacion_parcial: 0
    };
    
    try {
      const response = await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentObj)
      });

      if (response.ok) {
        // Recargar datos
        const res = await fetch('/api/dashboard');
        const dbData = await res.json();
        setData(dbData);
      } else {
        // Fallback local si la API falla
        setData(prev => ({...prev, alumnos: [...prev.alumnos, newStudentObj]}));
      }
      
      setToastMsg("Alumno registrado exitosamente");
      setIsAddStudentOpen(false);
      setNewStudent({
          nombre_completo: '',
          matricula: '',
          fecha_nacimiento: '',
          docente_id: '',
          grupo: '',
          generacion: ''
      });
      setShowStudentPassword(false);

    } catch (err) {
      console.error("Error:", err);
      // Fallback local
      setData(prev => ({...prev, alumnos: [...prev.alumnos, newStudentObj]}));
      setToastMsg("Alumno registrado (Local)");
      setIsAddStudentOpen(false);
    }
  };

  // --- VALIDACIÓN DE PAGOS ---
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

  // --- GUARDAR CALIFICACIÓN ---
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

  // --- FUNCTIONS FOR RENDER (Avoid Nested Components) ---

  const renderAdminDashboard = () => {
    if (!currentSlug) return <CampusSelector onSelect={(slug) => { setCurrentSlug(slug); setActiveTab('dashboard'); }} />;
    const totalStudents = data.alumnos.length;

    return (
      <div className="space-y-10 animate-in fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-100 pb-8">
          <div>
             <button onClick={() => setCurrentSlug(null)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-2 flex items-center gap-1 transition-colors">← Volver a Sedes</button>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Sede {currentSlug}</h2>
             <p className="text-xs font-bold text-zinc-500 mt-1">Panel de Control Administrativo</p>
          </div>
          <div className="flex gap-4 items-center text-right">
             <button onClick={() => setIsAddStudentOpen(true)} className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all shadow-lg h-fit">
                + Alumno
             </button>
             <div className="bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Alumnos Activos</p>
                <p className="text-2xl font-black">{totalStudents}</p>
             </div>
          </div>
        </div>
        <AdminAuditTable data={data} onVerifyPayment={togglePaymentVerification} onOpenProof={openProofModal} />
      </div>
    );
  };

  const renderAuditLogView = () => {
    return (
      <div className="space-y-8 animate-in fade-in">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Bitácora de Accesos <span className="text-next-green">.</span></h2>
        <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-600 sticky top-0 z-10">
                <tr>
                  <th className="p-6">Fecha y Hora</th>
                  <th className="p-6">Usuario (ID)</th>
                  <th className="p-6">Rol</th>
                  <th className="p-6">Acción</th>
                  <th className="p-6">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-6 text-xs font-mono text-zinc-700">
                      {new Date(log.timestamp).toLocaleDateString('es-MX')} <span className="text-black font-bold">{new Date(log.timestamp).toLocaleTimeString('es-MX')}</span>
                    </td>
                    <td className="p-6 font-bold text-sm font-mono text-black">{log.user_id}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider
                        ${log.role === Role.ADMIN ? 'bg-black text-white' : 
                          log.role === Role.PROFESOR ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-6 text-[10px] font-black uppercase tracking-wide">
                      {log.action === 'LOGIN_SUCCESS' && <span className="text-green-700">✅ Inicio de Sesión</span>}
                      {log.action === 'PANIC_BUTTON' && <span className="text-red-700">🚨 Botón de Pánico</span>}
                      {log.action === 'UNAUTHORIZED_ACCESS' && <span className="text-orange-700">🚫 Acceso Denegado</span>}
                    </td>
                    <td className="p-6 text-xs text-zinc-600 italic">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTeacherView = () => {
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
                    <td className="p-6"><span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${isBlocked ? 'bg-zinc-200 text-zinc-600' : 'bg-green-100 text-green-800'}`}>{isBlocked ? 'PENDIENTE DE PAGO' : 'HABILITADO'}</span></td>
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
      {activeRole === Role.ADMIN && (
        <Layout activeRole={Role.ADMIN} onRoleSelect={() => {}} onHome={() => { setCurrentSlug(null); setActiveTab('dashboard'); }} onLogout={() => setShowLogin(true)} onSedes={() => setCurrentSlug(null)} currentAdminSection={activeTab} onAdminSectionChange={(section) => setActiveTab(section)}>
          {activeTab === 'dashboard' ? renderAdminDashboard() : 
           activeTab === 'auditoria' ? renderAuditLogView() :
           <div className="p-10 text-center font-black uppercase text-zinc-300">Módulo en construcción</div>}
        </Layout>
      )}
      {activeRole === Role.PROFESOR && (
        <Layout activeRole={Role.PROFESOR} onRoleSelect={() => {}} onHome={() => setActiveTab('materias')} onLogout={() => setShowLogin(true)} onSedes={() => {}}>
          {renderTeacherView()}
        </Layout>
      )}
      {activeRole === Role.ALUMNO && (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
           <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in-95">
              <h1 className="text-5xl font-black italic uppercase text-black">Bienvenido, {data.alumnos.find(a => a.id === selectedAlumnoId)?.nombre_completo.split(' ')[0]}<span className="text-next-green">.</span></h1>
              {data.alumnos.find(a => a.id === selectedAlumnoId)?.financial_status === 'CLEAN' ? (
                <div className="bg-green-50 border-2 border-green-500 p-8 rounded-[40px]">
                   <span className="text-5xl mb-4 block">✅</span>
                   <h3 className="text-2xl font-black uppercase text-green-800 mb-2">Estás al corriente</h3>
                   <p className="text-xs font-bold text-green-900 uppercase">Tienes acceso total a tus clases y envío de tareas.</p>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-500 p-8 rounded-[40px]">
                   <span className="text-5xl mb-4 block">🚫</span>
                   <h3 className="text-2xl font-black uppercase text-red-800 mb-2">Pago en revisión o pendiente</h3>
                   <p className="text-xs font-bold text-red-900 uppercase">Tu pago no ha sido conciliado por auditoría o presentas adeudo.</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="p-6 bg-zinc-50 rounded-2xl">
                      <p className="text-[9px] font-black uppercase text-zinc-400">Docente Asignado</p>
                      <p className="font-bold">{data.docentes.find(d => d.id === data.alumnos.find(a => a.id === selectedAlumnoId)?.docente_id)?.nombre_completo || 'No asignado'}</p>
                  </div>
                  <div className="p-6 bg-zinc-50 rounded-2xl">
                      <p className="text-[9px] font-black uppercase text-zinc-400">Promedio Parcial</p>
                      <p className="font-bold text-xl">{data.alumnos.find(a => a.id === selectedAlumnoId)?.calificacion_parcial || '-'}</p>
                  </div>
              </div>
              <button onClick={() => setShowLogin(true)} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-black">Cerrar Sesión</button>
           </div>
        </div>
      )}
      {/* Toast y Modales */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      
      {/* ADD STUDENT MODAL INLINE RENDER */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddStudentOpen(false)}></div>
          <div className="bg-white w-full max-w-lg p-8 rounded-[32px] shadow-2xl relative z-10 animate-in zoom-in-95">
            <button onClick={() => setIsAddStudentOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-black font-bold">✕</button>
            <h3 className="text-2xl font-black italic uppercase mb-6">Nuevo Alumno<span className="text-next-green">.</span></h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Nombre Completo</label>
                    <input required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1 uppercase" 
                        value={newStudent.nombre_completo} onChange={e => setNewStudent({...newStudent, nombre_completo: e.target.value.toUpperCase()})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Matrícula</label>
                        <input required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1 uppercase" 
                            value={newStudent.matricula} onChange={e => setNewStudent({...newStudent, matricula: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Password (DDMMAAAA)</label>
                        <div className="relative">
                            <input required placeholder="01012000" type={showStudentPassword ? "text" : "password"} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1 pr-10" 
                                value={newStudent.fecha_nacimiento} onChange={e => setNewStudent({...newStudent, fecha_nacimiento: e.target.value})} />
                            <button type="button" onClick={() => setShowStudentPassword(!showStudentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                 {showStudentPassword ? '👁️' : '🔒'}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Docente Responsable</label>
                    <select required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1"
                        value={newStudent.docente_id} onChange={e => setNewStudent({...newStudent, docente_id: e.target.value})}>
                        <option value="">Seleccionar...</option>
                        {data.docentes.map(d => (
                            <option key={d.id} value={d.id}>{d.nombre_completo}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Grupo</label>
                        <input required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1 uppercase" 
                            value={newStudent.grupo} onChange={e => setNewStudent({...newStudent, grupo: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Generación</label>
                        <input required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold mt-1 uppercase" 
                            value={newStudent.generacion} onChange={e => setNewStudent({...newStudent, generacion: e.target.value.toUpperCase()})} />
                    </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-next-green transition-colors mt-4">
                    Registrar Alumno
                </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;