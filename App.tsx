import React, { useState, useEffect } from 'react';
import { Role, AdminSection, CityData } from './types';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import AdminAuditTable from './components/AdminAuditTable';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';

// --- MOCK DATA FALLBACK ---
const MOCK_DATA: CityData = {
  docentes: [
    { id: 'DOC-001', nombre_completo: 'Roberto Martínez', sede_slug: 'aguascalientes', email: 'roberto@next.mx' },
    { id: 'DOC-002', nombre_completo: 'Ana P. López', sede_slug: 'ciudad-de-mexico', email: 'ana@next.mx' }
  ],
  alumnos: [
    { id: 'AL-001', nombre_completo: 'SOFÍA RODRÍGUEZ', matricula: 'NX-001', financial_status: 'CLEAN', estatus: 'Activo', docente_id: 'DOC-001', calificacion_parcial: 9.5 },
    { id: 'AL-002', nombre_completo: 'LUIS GONZÁLEZ', matricula: 'NX-002', financial_status: 'DEBT', estatus: 'Activo', docente_id: 'DOC-001', calificacion_parcial: 8.0 },
    { id: 'AL-003', nombre_completo: 'FERNANDA CASTILLO', matricula: 'NX-003', financial_status: 'CLEAN', estatus: 'Activo', docente_id: 'DOC-002', calificacion_parcial: 10 }
  ],
  pagos: [
    { id: 'P-001', alumno_id: 'AL-001', concepto: 'Inscripción', monto: 2500, fecha_pago: new Date().toISOString(), metodo: 'Transferencia', estatus: 'Pagado', verified: true },
    { id: 'P-002', alumno_id: 'AL-002', concepto: 'Mensualidad', monto: 2500, fecha_pago: new Date().toISOString(), metodo: 'Efectivo', estatus: 'Pagado', verified: false } // Verified false creates DEBT
  ],
  matriculas: [],
  expedientes: []
};

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminSection>('dashboard');
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  
  // DATOS
  const [data, setData] = useState<CityData>({ 
    alumnos: [], matriculas: [], pagos: [], expedientes: [], docentes: [] 
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // MODAL AGREGAR ALUMNO
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ nombre: '', matricula: '', docenteId: '' });

  // CARGA INICIAL
  const loadData = () => {
    fetch('/api/dashboard')
      .then(res => {
         if (!res.ok) throw new Error("API Error");
         return res.json();
      })
      .then(dbData => { 
         // Si la DB está vacía o hay error, usamos Mock
         if (dbData.alumnos && dbData.alumnos.length > 0) setData(dbData);
         else setData(MOCK_DATA);
      })
      .catch(err => {
         console.error("Error cargando datos (Usando Mock):", err);
         setData(MOCK_DATA);
      });
  };
  
  useEffect(() => { loadData(); }, []);

  // --- LOGICA DE LOGIN ---
  const handleLogin = async (identifier: string, credential: string, role: Role) => {
    
    // 1. LOGIN DE ADMINISTRADOR (DUEÑA)
    if (role === Role.OWNER) {
      if (identifier === '1234' && credential === '123') {
        setActiveRole(Role.OWNER);
        setShowLogin(false);
        return { success: true };
      }
      return { success: false, error: "ID o Contraseña incorrectos" };
    }

    // 2. LOGIN DE DOCENTE
    if (role === Role.PROFESOR) {
      if (identifier.toUpperCase().startsWith('DOC')) {
        setActiveRole(Role.PROFESOR);
        setShowLogin(false);
        return { success: true };
      }
      return { success: false, error: "ID Docente no reconocido" };
    }

    return { success: false, error: "Rol no permitido" };
  };

  // --- AGREGAR ALUMNO (SOLO ADMIN) ---
  const saveNewStudent = async () => {
    if(!newStudentData.docenteId) { setToastMsg("⚠️ Debes asignar un docente"); return; }
    
    // Optimistic Update
    const newStudent = {
      id: `ALUM-${Math.random().toString(36).substr(2, 5)}`,
      nombre_completo: newStudentData.nombre,
      matricula: newStudentData.matricula,
      docente_id: newStudentData.docenteId,
      financial_status: 'DEBT' as 'DEBT',
      estatus: 'Activo' as 'Activo',
      calificacion_parcial: 0
    };

    try {
      await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStudent,
          grupo: 'A', 
          generacion: '2026'
        })
      });
      // Recargar datos reales
      loadData();
    } catch(e) {
      // Si falla API, usamos local
      setData(prev => ({...prev, alumnos: [...prev.alumnos, newStudent]}));
    }

    setToastMsg("✅ Alumno registrado y generado adeudo");
    setIsAddModalOpen(false);
  };

  // --- VISTA DE DUEÑA ---
  const OwnerDashboard = () => {
    // Calculamos estadísticas rápidas
    const totalDeuda = data.alumnos.filter(a => a.financial_status === 'DEBT').length;

    return (
      <div className="space-y-8 animate-in fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-100 pb-6 gap-4">
          <div>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter">Panel de Control</h2>
             <p className="text-xs font-bold text-zinc-400 mt-1">
               Estado Financiero: <span className={totalDeuda > 0 ? "text-red-500" : "text-green-500"}>
                 {totalDeuda} Pagos Pendientes
               </span>
             </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-black/20"
          >
            + Nuevo Ingreso
          </button>
        </div>

        {/* Tabla Principal */}
        <AdminAuditTable 
          data={data} 
          onVerifyPayment={(pagoId, status, alumnoId) => {
             // Validar pago
             fetch('/api/pagos/verify', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({pagoId, verified: !status, alumnoId, newStatus: !status ? 'CLEAN' : 'DEBT'})
             }).then(() => loadData())
               .catch(() => {
                 // Fallback local update
                 setData(prev => ({
                   ...prev,
                   alumnos: prev.alumnos.map(a => a.id === alumnoId ? {...a, financial_status: !status ? 'CLEAN' : 'DEBT'} : a)
                 }));
               });
          }} 
          onOpenProof={() => {}} 
        />

        {/* Modal Agregar */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black italic mb-6 text-center">Registrar Alumno</h3>
              <div className="space-y-4">
                <input 
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-4 font-bold text-sm outline-none" 
                  placeholder="Nombre Completo" 
                  onChange={e => setNewStudentData({...newStudentData, nombre: e.target.value})}
                />
                <input 
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-4 font-mono text-sm outline-none" 
                  placeholder="Matrícula (Ej. 2026-A01)" 
                  onChange={e => setNewStudentData({...newStudentData, matricula: e.target.value})}
                />
                <select 
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-4 font-bold text-sm outline-none appearance-none"
                  onChange={e => setNewStudentData({...newStudentData, docenteId: e.target.value})}
                >
                    <option value="">Seleccionar Maestro Asignado</option>
                    {data.docentes.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre_completo} ({d.sede_slug})</option>
                    ))}
                </select>
                <button onClick={saveNewStudent} className="w-full bg-next-green text-green-900 py-4 rounded-xl font-black text-sm uppercase tracking-widest mt-4 hover:brightness-110 transition-all">
                  Guardar y Generar Deuda
                </button>
                <button onClick={() => setIsAddModalOpen(false)} className="w-full text-zinc-400 font-bold py-3 text-xs uppercase tracking-widest hover:text-black">
                  Cancelar Operación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- VISTA DE DOCENTE SIMPLIFICADA ---
  const TeacherDashboard = () => {
    return (
      <div className="space-y-6 animate-in fade-in">
        <h2 className="text-3xl font-black italic uppercase">Mis Grupos</h2>
        <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden">
           <table className="w-full text-left">
             <thead className="bg-zinc-100 text-[9px] font-black uppercase text-zinc-500">
               <tr><th className="p-6">Alumno</th><th className="p-6">Estatus</th><th className="p-6 text-right">Calificación</th></tr>
             </thead>
             <tbody>
               {data.alumnos.map(a => (
                 <tr key={a.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                   <td className="p-6 font-bold text-sm">{a.nombre_completo}</td>
                   <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${a.financial_status === 'DEBT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {a.financial_status === 'DEBT' ? '🔒 PAGO PENDIENTE' : 'HABILITADO'}
                      </span>
                   </td>
                   <td className="p-6 text-right">
                      <SafeGradeInput 
                        currentGrade={a.calificacion_parcial} 
                        studentName={a.nombre_completo} 
                        isLocked={a.financial_status === 'DEBT'} 
                        onSave={(g) => {
                           fetch('/api/alumnos/grade', {
                              method: 'POST',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({alumnoId: a.id, grade: g})
                           });
                           // Optimistic UI
                           setData(prev => ({
                             ...prev,
                             alumnos: prev.alumnos.map(alu => alu.id === a.id ? {...alu, calificacion_parcial: g} : alu)
                           }));
                        }}
                      />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    );
  };

  if (showLogin) return <LandingPage onLogin={handleLogin} />;

  return (
    <>
      <Layout 
        activeRole={activeRole} 
        onRoleSelect={() => {}} 
        onHome={() => {}} 
        onLogout={() => setShowLogin(true)} 
        onSedes={() => {}}
      >
        {activeRole === Role.OWNER ? <OwnerDashboard /> : <TeacherDashboard />}
      </Layout>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
};

export default App;