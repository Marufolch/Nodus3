// Appointments.js - Gestión de turnos conectado a Azure

const { useState, useEffect, useMemo } = React;

function Appointments() {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const medicos = users.filter(u => u.role === "Medico");
  
  const [form, setForm] = useState({ 
    patientId: "", 
    medicoId: "", 
    datetime: new Date().toISOString().slice(0,16), 
    motivo: "Consulta"
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Actualizar form cuando carguen los datos
  useEffect(() => {
    if (patients.length > 0 && medicos.length > 0) {
      setForm(prev => ({
        ...prev,
        patientId: prev.patientId || patients[0]?.id || "",
        medicoId: prev.medicoId || medicos[0]?.id || ""
      }));
    }
  }, [patients, medicos]);

  async function loadData() {
    try {
      const [patientsRes, usersRes, turnosRes] = await Promise.all([
        fetch("http://localhost:4000/pacientes"),
        fetch("http://localhost:4000/usuarios"),
        fetch("http://localhost:4000/turnos")
      ]);

      const patientsData = await patientsRes.json();
      const usersData = await usersRes.json();
      const turnosData = await turnosRes.json();

      setPatients(patientsData);
      setUsers(usersData);
      setList(turnosData);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  }

  async function create() {
    const p = patients.find(x => x.id === form.patientId); 
    const m = medicos.find(x => x.id === form.medicoId);
    if (!p || !m) return;
    
    const appt = { 
      id: uid("a"), 
      patientId: p.id, 
      patientName: p.name, 
      medicoId: m.id, 
      medicoName: m.name, 
      datetime: new Date(form.datetime).toISOString(), 
      motivo: form.motivo, 
      status: "ACTIVO" 
    };
    
    try {
      const response = await fetch("http://localhost:4000/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appt)
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Error al crear turno:", error);
    }
  }

  async function cancel(id) { 
    try {
      const response = await fetch(`http://localhost:4000/turnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELADO" })
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Error al cancelar turno:", error);
    }
  }

  const grouped = useMemo(() => {
    return [...list].sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  }, [list]);

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CalendarDays className="w-4 h-4"/> Turnos
      </h2>
      
      <Card>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Paciente</div>
            <select 
              className="w-full border rounded-xl px-3 py-2" 
              value={form.patientId} 
              onChange={e => setForm({...form, patientId:e.target.value})}
            >
              <option value="">Seleccionar...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Médico</div>
            <select 
              className="w-full border rounded-xl px-3 py-2" 
              value={form.medicoId} 
              onChange={e => setForm({...form, medicoId:e.target.value})}
            >
              <option value="">Seleccionar...</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>
          
          <Input 
            label="Fecha y hora" 
            type="datetime-local" 
            value={form.datetime} 
            onChange={e => setForm({...form, datetime:e.target.value})} 
          />
          
          <Input 
            label="Motivo" 
            value={form.motivo} 
            onChange={e => setForm({...form, motivo:e.target.value})} 
          />
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button onClick={create}>
            <Plus className="w-4 h-4 inline mr-1"/>Agendar
          </Button>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-medium mb-2">Agenda</h3>
        <ul className="divide-y">
          {grouped.map(a => (
            <li key={a.id} className="py-2 text-sm flex flex-wrap gap-2 items-center justify-between">
              <div>
                <span className="font-medium">{formatDateHuman(a.datetime)}</span> · {a.patientName} → {a.medicoName} · 
                <span className={`px-2 py-0.5 rounded-full text-xs ml-2 ${a.status==="ACTIVO"?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}`}>
                  {a.status}
                </span>
              </div>
              {a.status === "ACTIVO" && (
                <Button variant="danger" onClick={() => cancel(a.id)}>
                  Cancelar
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

window.Appointments = Appointments;