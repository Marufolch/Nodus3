// DoctorHome.js - Panel del médico

const { useState, useEffect } = React;

function DoctorHome({ medico }) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurnos();
  }, []);

  async function loadTurnos() {
    try {
      const response = await fetch("http://localhost:4000/turnos");
      const data = await response.json();
      setTurnos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setLoading(false);
    }
  }

  // Filtrar turnos del médico
  const misTurnos = turnos.filter(t => t.medicoId === medico.id && t.status === "ACTIVO");
  
  // Turnos de hoy
  const today = new Date().toISOString().slice(0, 10);
  const turnosHoy = misTurnos.filter(t => 
    new Date(t.datetime).toISOString().slice(0, 10) === today
  );

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Bienvenido, Dr. {medico.name || medico.username}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label="Turnos de hoy" value={turnosHoy.length} />
        <Kpi label="Turnos pendientes" value={misTurnos.length} />
        <Kpi label="Pacientes únicos" value={new Set(misTurnos.map(t => t.patientId)).size} />
      </div>
      
      <Card>
        <h3 className="font-medium mb-3">Próximos turnos de hoy</h3>
        {turnosHoy.length === 0 ? (
          <p className="text-sm text-slate-500">No tienes turnos para hoy</p>
        ) : (
          <ul className="divide-y">
            {turnosHoy
              .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
              .slice(0, 5)
              .map(t => (
                <li key={t.id} className="py-2 text-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {new Date(t.datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                    {' · '}
                    <span>{t.patientName}</span>
                    {' · '}
                    <span className="text-slate-500">{t.motivo}</span>
                  </div>
                </li>
              ))
            }
          </ul>
        )}
      </Card>

      <Card>
        <p className="text-sm text-slate-600">
          Accede a tu <b>Agenda</b> desde el menú lateral para ver todos tus turnos y gestionar historias clínicas.
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

window.DoctorHome = DoctorHome;