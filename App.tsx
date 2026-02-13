import React, { useState, useEffect } from 'react';
import { Role, AdminSection, CityData } from './types';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import AdminAuditTable from './components/AdminAuditTable';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<AdminSection>('dashboard');

  // ESTADO DE DATOS (BD)
  const [data, setData] = useState<CityData>({
    alumnos: [], matriculas: [], pagos: [], expedientes: [], docentes: []
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ESTADO MODAL (Agregar Alumno)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ nombre: '', matricula: '', docenteId: '' });

  // --- CARGAR DATOS DE LA API ---
  const loadData = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(dbData => { if (dbData.alumnos) setData(dbData); })
      .catch(err => console.error("Error conectando API:", err));
  };
  useEffect(() => { loadData(); }, []);

  // --- LOGIN (AQUÍ ESTÁ LA CLAVE 1234/123) ---
  const handleLogin = async (identifier: string, credential: string, role: Role) => {

    // 1. ADMIN / DUEÑA
    if (role === Role.OWNER) {
      if (identifier === '1234' && credential === '123') {
        setActiveRole(Role.OWNER);
        setShowLogin(false);
        return { success: true };
      }
      return { success: false, error: "Credenciales de Administrador incorrectas" };
    }

    // 2. DOCENTE
    if (role === Role.PROFESOR) {
      // Validación simple (En producción podrías checar contra DB)
      if (identifier.toUpperCase().startsWith('DOC')) {
        setActiveRole(Role.PROFESOR);
        setShowLogin(false);
        return { success: true };
      }
      return { success: false, error: "ID Docente no reconocido" };
    }

    return { success: false, error: "Rol no autorizado" };
  };

  // --- FUNCIÓN: AGREGAR ALUMNO ---
  const saveNewStudent = async () => {
    if (!newStudentData.docenteId) { setToastMsg("⚠️ Asigna un docente responsable"); return; }

    try {
      const res = await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `ALUM-${Math.random().toString(36).substr(2, 5)}`,
          nombre_completo: newStudentData.nombre,
          matricula: newStudentData.matricula,
          docente_id: newStudentData.docenteId,
          grupo: 'A', generacion: '2026'
        })
      });
      if (res.ok) {
        setToastMsg("✅ Alumno registrado con deuda inicial");
        setIsAddModalOpen(false);
        loadData(); // Recargar tabla
      }
    } catch (e) { console.error(e); }
  };

  // --- VISTA DUEÑA ---
  const OwnerDashboard = () => {
    const totalDeuda = data.alumnos.filter(a => a.financial_status === 'DEBT').length;

    return (
      <div className="space-y-8 animate-in fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-100 pb-6 gap-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Panel Maestro</h2>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
              Alumnos con Adeudo: <span className="text-red-500 text-lg">{totalDeuda}</span>
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-black/20"
          >
            + Nuevo Ingreso
          </button>
        </div>

        <AdminAuditTable
          data={data}
          onVerifyPayment={(pagoId, status, alumnoId) => {
            // Validar pago en API
            fetch('/api/pagos/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pagoId, verified: !status, alumnoId, newStatus: !status ? 'CLEAN' : 'DEBT' })
            }).then(loadData);
          }}
          onOpenProof={() => { }}
        />

        {/* Modal Agregar */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in">
              <h3 className="text-2xl font-black italic mb-6">Nuevo Alumno</h3>
              <div className="space-y-4">
                <input className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-3 font-bold text-sm outline-none" placeholder="Nombre Completo" onChange={e => setNewStudentData({ ...newStudentData, nombre: e.target.value })} />
                <input className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-3 font-mono text-sm outline-none" placeholder="Matrícula" onChange={e => setNewStudentData({ ...newStudentData, matricula: e.target.value })} />
                <select className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-3 font-bold text-sm outline-none" onChange={e => setNewStudentData({ ...newStudentData, docenteId: e.target.value })}>
                  <option value="">Seleccionar Docente...</option>
                  {data.docentes.map(d => <option key={d.id} value={d.id}>{d.nombre_completo}</option>)}
                </select>
                <button onClick={saveNewStudent} className="w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest mt-2">GUARDAR</button>
                <button onClick={() => setIsAddModalOpen(false)} className="w-full text-zinc-400 font-bold py-2 text-xs uppercase">CANCELAR</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- VISTA DOCENTE ---
  const TeacherDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-3xl font-black italic uppercase">Mis Listas</h2>
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-100 text-[9px] font-black uppercase text-zinc-500">
            <tr><th className="p-6">Alumno</th><th className="p-6">Estatus</th><th className="p-6 text-right">Nota</th></tr>
          </thead>
          <tbody>
            {data.alumnos.map(a => (
              <tr key={a.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                <td className="p-6 font-bold text-sm">{a.nombre_completo}</td>
                <td className="p-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${a.financial_status === 'DEBT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{a.financial_status === 'DEBT' ? '🔒 PENDIENTE' : 'HABILITADO'}</span></td>
                <td className="p-6 text-right">
                  <SafeGradeInput
                    currentGrade={a.calificacion_parcial}
                    studentName={a.nombre_completo}
                    isLocked={a.financial_status === 'DEBT'}
                    onSave={(g) => fetch('/api/alumnos/grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alumnoId: a.id, grade: g }) })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (showLogin) return <LandingPage onLogin={handleLogin} />;

  return (
    <>
      <Layout activeRole={activeRole} onRoleSelect={() => { }} onHome={() => { }} onLogout={() => setShowLogin(true)} onSedes={() => { }}>
        {activeRole === Role.OWNER ? <OwnerDashboard /> : <TeacherDashboard />}
      </Layout>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
};

export default App;