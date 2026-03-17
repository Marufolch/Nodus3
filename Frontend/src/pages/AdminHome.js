// AdminHome.js - Panel de administración conectado a Azure

const { useState, useEffect } = React;

function AdminHome() {
  const [turnos, setTurnos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [turnosRes, pacientesRes, mensajesRes] = await Promise.all([
        fetch("http://localhost:4000/turnos"),
        fetch("http://localhost:4000/pacientes"),
        fetch("http://localhost:4000/mensajes")
      ]);

      const turnosData = await turnosRes.json();
      const pacientesData = await pacientesRes.json();
      const mensajesData = await mensajesRes.json();

      setTurnos(turnosData);
      setPacientes(pacientesData);
      setMensajes(mensajesData);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }

  // Calcular turnos de hoy
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = turnos.filter(a => {
    const turnoDate = new Date(a.datetime).toISOString().slice(0, 10);
    return turnoDate === today && a.status !== "CANCELADO";
  }).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Panel Administración</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Turnos de hoy" value={todayCount} />
        <Kpi label="Turnos totales" value={turnos.length} />
        <Kpi label="Pacientes" value={pacientes.length} />
        <Kpi label="Mensajes" value={mensajes.length} />
      </div>
      
      <Card>
        <h3 className="font-medium mb-3">Próximos turnos</h3>
        {turnos
          .filter(t => t.status !== "CANCELADO")
          .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
          .slice(0, 5)
          .map(t => (
            <div key={t.id} className="py-2 border-b last:border-0 text-sm">
              <span className="font-medium">
                {new Date(t.datetime).toLocaleDateString('es-AR')} {' '}
                {new Date(t.datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </span>
              {' · '}
              {t.patientName} → {t.medicoName}
            </div>
          ))
        }
        {turnos.filter(t => t.status !== "CANCELADO").length === 0 && (
          <p className="text-sm text-slate-500 py-2">No hay turnos programados</p>
        )}
      </Card>
      
      <Card>
        <p className="text-sm text-slate-600">
          Atajos: Gestionar <b>Pacientes</b> y <b>Turnos</b> desde el menú lateral.
        </p>
      </Card>
    </div>
  );
}

// Componente Kpi (indicador)
function Kpi({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-2xl font-bold text-indigo-600">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

// Exportar para uso global
window.AdminHome = AdminHome;