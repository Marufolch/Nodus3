// layout.js - Componentes de layout (TopBar y SideNav)

const { useState } = React;

// Barra superior
function TopBar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
          <Stethoscope className="w-5 h-5" /> NODUS – MVP
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-slate-600">
            <User2 className="w-4 h-4" /> {user.name || user.username} · {user.role}
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="w-4 h-4 inline mr-1"/>Salir
          </Button>
        </div>
      </div>
    </header>
  );
}

// Menú lateral de navegación
function SideNav({ role, route, setRoute }) {
  // Menú para Administrador
  const adminMenu = [
    { id: "dashboard", label: "Inicio", icon: ClipboardList },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "appointments", label: "Turnos", icon: CalendarDays },
    { id: "messages", label: "Mensajes", icon: Mail },
    { id: "reports", label: "Reportes", icon: FileDown },
  ];

  // Menú para Médico
  const medicoMenu = [
    { id: "dashboard", label: "Inicio", icon: ClipboardList },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "agenda", label: "Agenda", icon: CalendarDays },
    { id: "messages", label: "Mensajes", icon: Mail },
    { id: "reports", label: "Reportes", icon: FileDown },

  ];

  // Menú para Paciente
  const pacienteMenu = [
    { id: "dashboard", label: "Inicio", icon: ClipboardList },
    { id: "messages", label: "Mensajes", icon: Mail },
  ];

  // Seleccionar menú según rol
  let items = [];
  if (role === "Administrador") {
    items = adminMenu;
  } else if (role === "Medico") {
    items = medicoMenu;
  } else if (role === "Paciente") {
    items = pacienteMenu;
  }

  return (
    <nav className="md:col-span-1">
      <Card>
        <ul className="space-y-2">
          {items.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button 
                onClick={() => setRoute(id)} 
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 ${route===id?"bg-slate-100 font-semibold":""}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </nav>
  );
}

// Exportar para uso global
window.TopBar = TopBar;
window.SideNav = SideNav;