// App.js - Aplicación principal

const { useState, useEffect } = React;

function App() {
  // Inicializar storage al montar
  useEffect(() => { 
    initStorage(); 
  }, []);

  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("dashboard");

  function logout() { 
    setUser(null); 
    setRoute("dashboard"); 
  }

  // Si no hay usuario, mostrar pantalla de login
  if (!user) {
    return <AuthScreen onLogin={(backendUser) => {
      const mappedUser = {
        ...backendUser,
        role: backendUser.rol
      };
      setUser(mappedUser);

      // Redirigir a ruta inicial según rol
      switch (mappedUser.role) {
        case "Administrador":
          setRoute("dashboard");
          break;
        case "Medico":
          setRoute("dashboard");
          break;
        case "Paciente":
          setRoute("dashboard");
          break;
        default:
          setRoute("dashboard");
      }
    }} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <TopBar user={user} onLogout={logout} />
      
      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-4 gap-4">
        <SideNav role={user.role} route={route} setRoute={setRoute} />
        
        <main className="md:col-span-3">
          {/* Rutas para ADMINISTRADOR */}
          {user.role === "Administrador" && route === "dashboard" && <AdminHome />}
          {user.role === "Administrador" && route === "patients" && <Patients />}
          {user.role === "Administrador" && route === "appointments" && <Appointments />}
          {user.role === "Administrador" && route === "agenda" && <Appointments />} {/* ← CAMBIO AQUÍ */}

          {/* Rutas para MEDICO */}
          {user.role === "Medico" && route === "dashboard" && <DoctorHome medico={user} />}
          {user.role === "Medico" && route === "agenda" && <Agenda medico={user} />}
          {user.role === "Medico" && route === "patients" && <PatientsView/>}

          {/* Rutas para PACIENTE */}
          {user.role === "Paciente" && route === "dashboard" && <PatientHome paciente={user} />}

          {/* Rutas compartidas */}
          {route === "messages" && <Messages user={user} />}
          {route === "reports" && <Reports />}
        </main>
      </div>
    </div>
  );
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);