import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CITIES, CITY_KEYS } from './constants';
import { Alumno, Matricula, Pago, CityData, City, ExpedienteAlumno, DocumentoPDF, Role, AuditLogEntry, AdminSection, Docente } from './types';
import AIAssistant from './components/AIAssistant';
import StudentLogin from './components/LandingPage';
import Layout from './components/Layout';
import CampusSelector from './components/CampusSelector';
import AdminAuditTable from './components/AdminAuditTable';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';

// --- SEED DATA PARA AGUASCALIENTES ---
const SEED_AGUASCALIENTES: CityData = (() => {
  const docentes: Docente[] = [
    { id: "DOC-001", nombre_completo: "Lic. Roberto Gómez", sede_slug: "aguascalientes", email: "roberto.g@next.edu.mx", especialidad: "Matemáticas" },
    { id: "DOC-002", nombre_completo: "Ing. Sofia Martínez", sede_slug: "aguascalientes", email: "sofia.m@next.edu.mx", especialidad: "Programación" }
  ];

  const alumnos: Alumno[] = [];
  const matriculas: Matricula[] = [];
  const pagos: Pago[] = [];
  const expedientes: ExpedienteAlumno[] = [];

  const rawData = [
    // ALUMNO 1: Asignado a Roberto
    { 
      name: "Carlos Alberto Ramírez López", 
      mat: "NX-001023", 
      dob: "15082005", 
      grupo: "A1", 
      financial_status: 'CLEAN' as const, 
      asistencia: 10, 
      total_clases: 10, 
      calif: 9.5, 
      docente_id: "DOC-001",
      last_activity: "2024-02-14",
      pagos: [
        { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-10", verified: true, proof: "https://placehold.co/400x600/png?text=Voucher+Inscripcion" },
        { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-15", verified: true, proof: "https://placehold.co/400x600/png?text=Voucher+Enero" }
      ]
    },
    // ALUMNO 2: Asignado a Roberto (Deuda)
    { 
      name: "José Luis Hernández Vega", 
      mat: "NX-001025", 
      dob: "22032004", 
      grupo: "A1", 
      financial_status: 'DEBT' as const, 
      asistencia: 8, 
      total_clases: 10, 
      calif: null, 
      docente_id: "DOC-001",
      last_activity: "2024-02-10",
      pagos: [
        { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-05", verified: true, proof: "https://placehold.co/400x600/png?text=Voucher+Inscripcion" },
        { c: "Mensualidad Enero", m: 1800, s: "Vencido", f: "2026-01-20", verified: false, proof: null }
      ]
    },
    // ALUMNO 3: Asignado a Sofia
    { 
      name: "Ana Maria Gonzalez", 
      mat: "NX-001099", 
      dob: "01012005", 
      grupo: "A1", 
      financial_status: 'DEBT' as const, 
      asistencia: 9, 
      total_clases: 10, 
      calif: null, 
      docente_id: "DOC-002",
      last_activity: "2024-02-14",
      pagos: [
        { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-02-01", verified: false, proof: "https://placehold.co/400x600/png?text=Falso+Comprobante" } 
      ] 
    },
  ];

  rawData.forEach(item => {
    const id = Math.random().toString(36).substr(2, 9);
    alumnos.push({
      id,
      nombre_completo: item.name,
      matricula: item.mat,
      fecha_nacimiento: item.dob,
      financial_status: item.financial_status,
      telefono: "4491234567",
      email: `${item.name.toLowerCase().replace(/ /g, '.')}@next.edu.mx`,
      generacion: "2026",
      grupo: item.grupo,
      estatus: "Activo",
      created_at: "2026-01-01", 
      asistencias: item.asistencia,
      total_clases: item.total_clases,
      calificacion_parcial: item.calif,
      docente_id: item.docente_id,
      last_homework_date: item.last_activity
    });

    item.pagos.forEach(p => {
      pagos.push({
        id: Math.random().toString(36).substr(2, 5),
        alumno_id: id,
        concepto: p.c as any,
        monto: p.m,
        fecha_pago: p.f,
        metodo: "Transferencia",
        estatus: p.s as any,
        verified: p.verified,
        proof_url: p.proof || undefined
      });
    });

    expedientes.push({
      alumno_id: id,
      docs: {},
      updated_at: new Date().toISOString()
    });
  });

  return { alumnos, matriculas, pagos, expedientes, docentes };
})();

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null); // Start null to show campus selector
  const [activeTab, setActiveTab] = useState<AdminSection>('dashboard');
  const [data, setData] = useState<CityData>({ alumnos: [], matriculas: [], pagos: [], expedientes: [], docentes: [] });
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // States for Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Estado para el modal de comprobantes
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [currentProofUrl, setCurrentProofUrl] = useState<string | null>(null);

  // Cargar datos de ciudad y API
  useEffect(() => {
    const loadData = async () => {
      if (currentSlug) {
        // 1. Intentar cargar desde localStorage primero (optimista)
        const storageKey = `NEXT_DATA_${currentSlug}`;
        const saved = localStorage.getItem(storageKey);
        
        // 2. Intentar cargar desde API PostgreSQL
        try {
          // Nota: Si estás probando localmente y no tienes el backend de PG corriendo,
          // esto fallará silenciosamente y usará los datos semilla.
          const response = await fetch('/api/alumnos');
          if (response.ok) {
            const dbAlumnos = await response.json();
            
            // Si la base de datos retorna registros, los usamos
            if (Array.isArray(dbAlumnos) && dbAlumnos.length > 0) {
              console.log("✅ Datos cargados desde PostgreSQL:", dbAlumnos.length, "registros.");
              
              // Aquí fusionamos con la estructura existente. 
              // Asumimos que la tabla 'alumnos' tiene columnas compatibles con la interfaz Alumno
              setData(prev => ({
                ...prev,
                alumnos: dbAlumnos as Alumno[],
                // Si la DB solo trae alumnos, mantenemos docentes y otros datos del seed/local
                // para que la app no se vea vacía en otras secciones.
                docentes: prev.docentes.length ? prev.docentes : SEED_AGUASCALIENTES.docentes,
                pagos: prev.pagos.length ? prev.pagos : SEED_AGUASCALIENTES.pagos
              }));
              return; // Salimos si la carga de DB fue exitosa
            }
          }
        } catch (error) {
          console.log("ℹ️ No se pudo conectar a la API (usando modo offline/demo):", error);
        }

        // 3. Fallback: Si no hubo API o falló, usamos LocalStorage o Seed
        if (saved) {
          const parsed = JSON.parse(saved);
          if (currentSlug === 'aguascalientes' && (!parsed.docentes || parsed.docentes.length === 0)) {
            saveData(SEED_AGUASCALIENTES);
          } else {
            setData(parsed);
          }
        } else {
          const initial = currentSlug === 'aguascalientes' ? SEED_AGUASCALIENTES : { alumnos: [], matriculas: [], pagos: [], expedientes: [], docentes: [] };
          saveData(initial);
        }
      }
    };

    loadData();
  }, [currentSlug]);

  // Cargar registros de auditoría
  useEffect(() => {
    const savedLogs = localStorage.getItem('NEXT_AUDIT_LOGS');
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Error parsing audit logs", e);
      }
    }
  }, []);

  const saveData = (newData: CityData) => {
    setData(newData);
    localStorage.setItem(`NEXT_DATA_${currentSlug}`, JSON.stringify(newData));
  };

  const showToast = (message: string) => {
    setToastMsg(message);
  };

  const logAction = (user_id: string, role: Role, action: 'LOGIN_SUCCESS' | 'PANIC_BUTTON' | 'UNAUTHORIZED_ACCESS', details?: string) => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user_id,
      role,
      action,
      details
    };
    const updatedLogs = [newEntry, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('NEXT_AUDIT_LOGS', JSON.stringify(updatedLogs));
  };

  const handleLogin = async (identifier: string, credential: string, role: Role): Promise<{ success: boolean; error?: string; status?: 'CLEAN' | 'DEBT' }> => {
    if (role === Role.ALUMNO) {
      if (identifier === '123' && credential === '123') {
        const demoStudent = SEED_AGUASCALIENTES.alumnos[0];
        // We load Aguascalientes data for the demo student automatically
        setCurrentSlug('aguascalientes');
        if (demoStudent) {
           logAction('DEMO-ALUMNO', Role.ALUMNO, 'LOGIN_SUCCESS', 'Acceso Rápido Demo');
           setSelectedAlumnoId(demoStudent.id);
           setActiveRole(Role.ALUMNO);
           setShowLogin(false);
           return { success: true, status: demoStudent.financial_status || 'CLEAN' };
        }
      }

      const alumno = data.alumnos.find(a => a.matricula === identifier && a.fecha_nacimiento === credential);
      if (!alumno) return { success: false, error: "Credenciales incorrectas." };
      
      logAction(identifier, Role.ALUMNO, 'LOGIN_SUCCESS', alumno.financial_status === 'DEBT' ? 'Login con bloqueo por deuda' : 'Acceso limpio');

      if (alumno.financial_status === 'DEBT') return { success: false, status: 'DEBT' };
      
      setSelectedAlumnoId(alumno.id);
      setActiveRole(Role.ALUMNO);
      setShowLogin(false);
      return { success: true, status: 'CLEAN' };
    } 
    else if (role === Role.PROFESOR) {
      if ((identifier === '123' && credential === '1234') || identifier === 'DOC-2026' || identifier === 'DOC-001') {
        logAction(identifier, Role.PROFESOR, 'LOGIN_SUCCESS');
        setActiveRole(Role.PROFESOR);
        // Default teacher to Aguascalientes for now, or could force a selection
        setCurrentSlug('aguascalientes');
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Error de docente." };
    }
    else if (role === Role.OWNER) {
      if ((identifier === '1234' && credential === '123') || (identifier === 'OWNER' && credential === 'ADMIN')) {
        logAction(identifier, Role.OWNER, 'LOGIN_SUCCESS');
        setActiveRole(Role.OWNER);
        // Owner doesn't auto-select a city, they go to Campus Selector
        setCurrentSlug(null); 
        setShowLogin(false);
        return { success: true, status: 'CLEAN' };
      }
      return { success: false, error: "Acceso no autorizado." };
    }
    return { success: false, error: "Rol no reconocido." };
  };

  const togglePaymentVerification = (pagoId: string, currentStatus: boolean, alumnoId: string) => {
    const updatedPagos = data.pagos.map(p => {
      if (p.id === pagoId) {
        return { ...p, verified: !currentStatus };
      }
      return p;
    });

    const studentPagos = updatedPagos.filter(p => p.alumno_id === alumnoId);
    const hasPendingOrUnverified = studentPagos.some(p => p.estatus === 'Vencido' || (p.estatus === 'Pagado' && !p.verified));
    const newStatus = hasPendingOrUnverified ? 'DEBT' : 'CLEAN';

    const updatedAlumnos = data.alumnos.map(a => {
      if (a.id === alumnoId) {
        return { ...a, financial_status: newStatus as 'CLEAN' | 'DEBT' };
      }
      return a;
    });

    saveData({ ...data, pagos: updatedPagos, alumnos: updatedAlumnos });
    showToast(!currentStatus ? "Pago validado correctamente" : "Validación revocada");
  };

  const handleGradeSave = (alumnoId: string, newGrade: number) => {
    const updatedAlumnos = data.alumnos.map(a => {
      if (a.id === alumnoId) {
        return { ...a, calificacion_parcial: newGrade };
      }
      return a;
    });
    saveData({ ...data, alumnos: updatedAlumnos });
    showToast(`Calificación asignada correctamente.`);
  };

  const openProofModal = (url: string) => {
    setCurrentProofUrl(url);
    setProofModalOpen(true);
  };

  // --- VISTAS ESTRATÉGICAS ---

  // 1. LA DUEÑA: DETECTOR DE MENTIRAS + AUDITORÍA MAESTRA
  const OwnerDashboard = () => {
    // If no slug is selected, show Campus Selector
    if (!currentSlug) {
      return (
        <CampusSelector 
          onSelect={(slug) => {
            setCurrentSlug(slug);
            // Optionally default active tab if needed, but dashboard is fine
            setActiveTab('dashboard');
          }} 
        />
      );
    }

    // If slug selected, show Audit Dashboard for that city
    const totalStudents = data.alumnos.length;
    const totalVerifiedIncome = data.pagos.filter(p => p.estatus === 'Pagado' && p.verified).reduce((acc, curr) => acc + curr.monto, 0);

    return (
      <div className="space-y-10 animate-in fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-100 pb-8">
          <div>
             <button 
                onClick={() => setCurrentSlug(null)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-2 flex items-center gap-1 transition-colors"
             >
               ← Volver a Sedes
             </button>
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

        {/* Master Audit Grid (Grouped by Teacher) */}
        <AdminAuditTable 
          data={data}
          onVerifyPayment={togglePaymentVerification}
          onOpenProof={openProofModal}
        />
      </div>
    );
  };

  const AuditLogView = () => {
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
                        ${log.role === Role.OWNER ? 'bg-black text-white' : 
                          log.role === Role.PROFESOR ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-6 text-[10px] font-black uppercase tracking-wide">
                      {log.action === 'LOGIN_SUCCESS' && <span className="text-green-700">✅ Inicio de Sesión</span>}
                      {log.action === 'PANIC_BUTTON' && <span className="text-red-700">🚨 Botón de Pánico</span>}
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

  // 2. EL DOCENTE: FILTRO DE SEGURIDAD
  const TeacherView = () => {
    return (
      <div className="space-y-8 animate-in fade-in">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Lista de Calificaciones <span className="text-next-green">.</span></h2>
        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 mb-6 flex items-start gap-4">
           <span className="text-2xl">ℹ️</span>
           <div>
             <h4 className="font-black text-sm uppercase text-zinc-900 mb-1">Política de Asentamiento de Notas</h4>
             <p className="text-xs text-zinc-600 leading-relaxed">
               Las calificaciones guardadas entran en estado de "Lectura" para evitar ediciones accidentales.
               <br/>
               Los alumnos con estatus <span className="font-bold bg-zinc-200 px-1 rounded text-[10px] uppercase">Bloqueado</span> no pueden recibir calificación hasta regularizar sus pagos.
             </p>
           </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[32px] overflow-visible shadow-sm pb-32">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-600">
              <tr>
                <th className="p-6">Alumno</th>
                <th className="p-6">Matrícula</th>
                <th className="p-6">Estatus</th>
                <th className="p-6 text-right w-48">Calificación Parcial 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.alumnos.map(a => {
                const isBlocked = a.financial_status === 'DEBT';
                return (
                  <tr key={a.id} className={`transition-all ${isBlocked ? 'bg-zinc-50/50' : 'hover:bg-zinc-50'}`}>
                    <td className="p-6">
                      <p className="font-bold text-sm uppercase text-black">{a.nombre_completo}</p>
                      {isBlocked && <p className="text-[9px] text-red-600 font-black uppercase mt-1">🔒 Bloqueo Administrativo</p>}
                    </td>
                    <td className="p-6 text-xs font-mono text-zinc-700">{a.matricula}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${isBlocked ? 'bg-zinc-200 text-zinc-600' : 'bg-green-100 text-green-800'}`}>
                        {isBlocked ? 'Restringido' : 'Habilitado'}
                      </span>
                    </td>
                    <td className="p-6 text-right relative z-10">
                       <SafeGradeInput 
                         currentGrade={a.calificacion_parcial}
                         studentName={a.nombre_completo}
                         isLocked={isBlocked}
                         onSave={(newGrade) => handleGradeSave(a.id, newGrade)}
                       />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 3. MAIN RENDER
  if (showLogin) {
    return <StudentLogin onLogin={handleLogin} />;
  }

  return (
    <>
      {activeRole === Role.OWNER && (
        <Layout 
          activeRole={Role.OWNER} 
          onRoleSelect={() => {}} 
          onHome={() => {
            setCurrentSlug(null); // Reset to Campus Selector when clicking Home
            setActiveTab('dashboard');
          }} 
          onLogout={() => setShowLogin(true)} 
          onSedes={() => setCurrentSlug(null)}
          currentAdminSection={activeTab}
          onAdminSectionChange={(section) => setActiveTab(section)}
        >
          {activeTab === 'dashboard' && <OwnerDashboard />}
          {activeTab === 'auditoria' && <AuditLogView />}
          {activeTab !== 'dashboard' && activeTab !== 'auditoria' && (
             <div className="p-10 text-center font-black uppercase text-zinc-300">Módulo en construcción</div>
          )}
        </Layout>
      )}

      {activeRole === Role.PROFESOR && (
        <Layout activeRole={Role.PROFESOR} onRoleSelect={() => {}} onHome={() => setActiveTab('materias')} onLogout={() => setShowLogin(true)} onSedes={() => {}}>
          <TeacherView />
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
              <button onClick={() => setShowLogin(true)} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-black">Cerrar Sesión</button>
           </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

      {/* MODAL COMPROBANTES */}
      {proofModalOpen && currentProofUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl relative ring-1 ring-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Evidencia de Pago</h3>
               <button 
                  onClick={() => setProofModalOpen(false)}
                  className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center text-zinc-900 font-bold transition-all"
               >
                  ✕
               </button>
            </div>
            
            {/* Image Container */}
            <div className="flex-1 bg-zinc-50 flex items-center justify-center p-4 overflow-hidden relative">
               {/* Pattern background for transparency/empty space */}
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               <img 
                 src={currentProofUrl} 
                 alt="Comprobante" 
                 className="max-w-full max-h-full object-contain rounded-lg shadow-lg" 
               />
            </div>
            
            {/* Footer / Actions */}
             <div className="p-4 bg-white border-t border-zinc-100 flex justify-end">
                <a 
                  href={currentProofUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black underline"
                >
                  Abrir original en nueva pestaña
                </a>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;