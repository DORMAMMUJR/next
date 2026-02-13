import React, { useState, useEffect } from 'react';
import { Role, CityData, AppView } from './types';
import { CITIES } from './constants';
import { MessageCircleQuestion } from 'lucide-react'; // Icono para el botón
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import OwnerDashboard from './components/OwnerDashboard';
import NewStudentModal from './components/NewStudentModal';
import AddTeacherModal from './components/AddTeacherModal';
import SafeGradeInput from './components/SafeGradeInput';
import Toast from './components/Toast';
import TeachersView from './components/TeachersView';
import SettingsView from './components/SettingsView';
import StudentUpload from './components/StudentUpload';
import SupportModal from './components/SupportModal';

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // 2. NUEVO ESTADO PARA CONTROLAR LA NAVEGACIÓN:
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // NUEVO: Estado para la Sede Activa
  const [activeSede, setActiveSede] = useState<string>('GENERAL');

  // NUEVO: Estado para gestionar las SEDES disponibles
  const [availableSedes, setAvailableSedes] = useState<string[]>(CITIES.map(c => c.slug));

  // --- GENERADOR DE DATOS DE PRUEBA ---
  const generateDummyData = (): CityData => {
    // Usamos las sedes iniciales para generar datos (esto solo corre una vez)
    const sedesIniciales = ['aguascalientes', 'cdmx', 'monterrey', 'guadalajara', 'queretaro', 'cancun'];
    const docentesNombres = ['Roberto Gómez', 'Laura Pausini', 'Carlos Santana', 'Frida Kahlo', 'Pedro Infante', 'Selena Quintanilla'];

    let docentes: any[] = [];
    let alumnos: any[] = [];

    // Creamos 2 o 3 maestros por sede
    sedesIniciales.forEach((sede) => {
      // 3 Maestros por sede
      for (let i = 0; i < 3; i++) {
        const docId = `doc-${sede}-${i}`;
        docentes.push({
          id: docId,
          nombre_completo: `Prof. ${docentesNombres[i] || 'Docente'} (${sede.substring(0, 3).toUpperCase()})`,
          sede_slug: sede,
          email: `docente${i}@${sede}.com`
        });

        // Creamos 5 a 10 alumnos por maestro
        const numAlumnos = Math.floor(Math.random() * 5) + 5;
        for (let j = 0; j < numAlumnos; j++) {
          const isDebtor = Math.random() > 0.3 ? false : true;
          alumnos.push({
            id: `alum-${sede}-${i}-${j}`,
            nombre_completo: `Alumno ${j + 1} de ${sede}`,
            matricula: `${sede.substring(0, 3).toUpperCase()}-2026-${i}${j}`,
            docente_id: docId,
            financial_status: isDebtor ? 'DEBT' : 'CLEAN',
            sede: sede,
            hasReceipt: isDebtor && Math.random() > 0.5, // ~50% de deudores tienen comprobante
            hasPendingReceipt: isDebtor && Math.random() > 0.5 // ~50% de deudores subieron ticket
          });
        }
      }
    });

    return { alumnos, docentes, matriculas: [], pagos: [], expedientes: [] };
  };

  // ESTADO DE DATOS (BD)
  // CAMBIA EL STATE INICIAL PARA USAR LOS DATOS FALSOS:
  const [data, setData] = useState<CityData>(generateDummyData());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ESTADO MODAL (Agregar Alumno y Agregar Docente)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

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

  // --- LOGIN ---
  const handleLogin = async (identifier: string, credential: string, role: Role) => {
    // ADMIN (Dueña): 1234 / 123
    if (role === Role.OWNER && identifier === '1234' && credential === '123') {
      setActiveRole(Role.OWNER); setShowLogin(false); return { success: true };
    }

    // DOCENTE: 1234 / 123 (Testing) o IDs reales
    if (role === Role.PROFESOR && (identifier === '1234' || identifier.startsWith('doc-')) && credential === '123') {
      setActiveRole(Role.PROFESOR); setShowLogin(false); return { success: true };
    }

    return { success: false, error: "Credenciales inválidas" };
  };

  // --- HANDLE NEW TEACHER SAVE ---
  const handleSaveTeacher = (teacherData: any) => {
    setData(prev => ({
      ...prev,
      docentes: [...prev.docentes, {
        ...teacherData,
        nombre_completo: teacherData.nombre,
        sede_slug: teacherData.sede
      }]
    }));
    setToastMsg('✅ Docente registrado exitosamente');
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

  // --- FILTRADO DE DATOS POR SEDE ---
  const getFilteredData = (): CityData => {
    if (activeSede === 'GENERAL') return data;

    // 1. Encontramos docentes de esa sede
    const docentesSede = data.docentes.filter(d => d.sede_slug === activeSede);
    const docenteIds = docentesSede.map(d => d.id);

    // 2. Filtramos alumnos asignados a esos docentes
    const alumnosSede = data.alumnos.filter(a => a.docente_id && docenteIds.includes(a.docente_id));

    return {
      ...data,
      alumnos: alumnosSede,
    };
  };

  const filteredData = getFilteredData();


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

  // 3. FUNCIÓN PARA DECIDIR QUÉ RENDERIZAR SEGÚN LA VISTA ACTUAL:
  const renderContent = () => {
    if (activeRole === Role.PROFESOR) {
      return <TeacherDashboard />;
    }

    // Si es OWNER, dependemos de la vista seleccionada:
    switch (currentView) {
      case 'dashboard':
        return (
          <OwnerDashboard
            data={filteredData}
            sedeName={activeSede}
            onVerifyPayment={(pagoId, status, alumnoId) => {
              fetch('/api/pagos/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pagoId, verified: !status, alumnoId, newStatus: !status ? 'CLEAN' : 'DEBT' })
              }).then(loadData);
            }}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        );
      case 'teachers':
        return <TeachersView docentes={data.docentes} alumnos={data.alumnos} onOpenAddTeacher={() => setIsAddTeacherOpen(true)} />;
      case 'settings':
        return (
          <SettingsView
            availableSedes={availableSedes}
            onAddSede={(newSede) => setAvailableSedes([...availableSedes, newSede])}
          />
        );
      default:
        return (
          <OwnerDashboard
            data={filteredData}
            sedeName={activeSede}
            onVerifyPayment={(pagoId, status, alumnoId) => {
              fetch('/api/pagos/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pagoId, verified: !status, alumnoId, newStatus: !status ? 'CLEAN' : 'DEBT' })
              }).then(loadData);
            }}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        );
    }
  };

  // 4. NUEVO ESTADO PARA LA SUBIDA DE ALUMNOS (SIN LOGIN)
  const [showUpload, setShowUpload] = useState(false);

  if (showUpload) {
    return (
      <StudentUpload
        onBack={() => setShowUpload(false)}
        onUpload={(matricula, file) => {
          console.log(`Subiendo archivo ${file.name} de ${matricula}`);
          // Aquí conectarías con tu backend real
          alert("Pago enviado al administrador (Simulación).");
          setShowUpload(false);
        }}
      />
    );
  }

  if (showLogin) {
    return (
      <LandingPage
        onLogin={handleLogin}
        onGoToUpload={() => setShowUpload(true)}
      />
    );
  }

  return (
    <>
      {/* 4. ACTUALIZA EL LAYOUT PARA PASARLE LA NAVEGACIÓN */}
      <Layout

        activeSede={activeSede}
        onSedeSelect={(sede) => setActiveSede(sede)}
        onLogout={() => setShowLogin(true)}
        currentView={currentView} // <-- NUEVO
        onNavigate={setCurrentView} // <-- NUEVO: Le pasamos la función para cambiar la vista
        searchData={data}
        availableSedes={availableSedes} // <-- NUEVO: Pasamos las sedes dinámicas al Layout
      >
        {/* 5. RENDERIZA EL CONTENIDO DINÁMICO */}
        {renderContent()}

        {/* BOTÓN FLOTANTE DE SOPORTE (Esquina inferior derecha) */}
        <button
          onClick={() => setIsSupportOpen(true)}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 group"
          title="Ayuda y Soporte"
        >
          <MessageCircleQuestion size={24} />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-2 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            ¿Necesitas ayuda?
          </span>
        </button>
      </Layout>

      {/* MODALES GLOBALES */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      <NewStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStudent}
        docentes={data.docentes}
        activeSede={activeSede}
      />

      <AddTeacherModal
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        onSave={handleSaveTeacher}
      />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
};

export default App;