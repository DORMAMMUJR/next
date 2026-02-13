import React, { useState, useEffect } from 'react';
import { Role, AdminSection, CityData } from './types';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import OwnerDashboard from './components/OwnerDashboard';
import NewStudentModal from './components/NewStudentModal';
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

  // --- CARGAR DATOS DE LA API ---
  const loadData = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(dbData => {
        if (dbData.alumnos) setData(dbData);
        else console.error("Bad API response:", dbData);
      })
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

  // --- HANDLE NEW STUDENT SAVE ---
  const handleSaveStudent = async (studentData: any) => {
    try {
      const res = await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        setToastMsg("✅ Alumno registrado exitosamente");
        setIsAddModalOpen(false);
        loadData();
      } else {
        setToastMsg("⚠️ Error al registrar alumno");
      }
    } catch (e) {
      console.error(e);
      setToastMsg("❌ Error de conexión");
    }
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
              <tr key={a.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
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
      <Layout
        activeRole={activeRole}
        onRoleSelect={() => { }}
        onHome={() => { }}
        onLogout={() => setShowLogin(true)}
        onSedes={() => { }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeRole === Role.OWNER ? (
          <OwnerDashboard
            data={data}
            onVerifyPayment={(pagoId, status, alumnoId) => {
              fetch('/api/pagos/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pagoId, verified: !status, alumnoId, newStatus: !status ? 'CLEAN' : 'DEBT' })
              }).then(loadData);
            }}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : (
          <TeacherDashboard />
        )}
      </Layout>

      <NewStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStudent}
        docentes={data.docentes}
      />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
};

export default App;