// Agenda.js - Agenda del médico e Historia Clínica conectado a Azure

const { useState, useEffect, useMemo } = React;

function Agenda({ medico }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(new Date().toISOString().slice(0,10));
  
  useEffect(() => {
    loadTurnos();
  }, []);

  async function loadTurnos() {
    try {
      const response = await fetch("http://localhost:4000/turnos");
      const data = await response.json();
      setList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setLoading(false);
    }
  }

  const appts = useMemo(() => {
    return list.filter(a => 
      a.medicoId === medico.id && 
      a.status !== "CANCELADO" && 
      new Date(a.datetime).toISOString().slice(0,10) === sel
    ).sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  }, [list, sel, medico.id]);

  if (loading) {
    return <div className="p-4">Cargando agenda...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CalendarDays className="w-4 h-4"/> Agenda de {medico.name || medico.username}
      </h2>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input 
              label="Seleccionar día" 
              type="date" 
              value={sel} 
              onChange={e => setSel(e.target.value)} 
            />
          </div>
          <div className="text-sm text-slate-600 pt-6">
            {appts.length} turno{appts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>

      {/* Mostrar próximos turnos si no hay para la fecha seleccionada */}
      {appts.length === 0 && list.filter(a => a.medicoId === medico.id && a.status !== "CANCELADO").length > 0 && (
        <Card>
          <h3 className="font-medium text-sm mb-2">Próximos turnos programados:</h3>
          <ul className="divide-y text-sm">
            {list
              .filter(a => a.medicoId === medico.id && a.status !== "CANCELADO")
              .sort((a,b) => new Date(a.datetime) - new Date(b.datetime))
              .slice(0, 5)
              .map(a => (
                <li key={a.id} className="py-2">
                  <span className="font-medium">
                    {new Date(a.datetime).toLocaleDateString('es-AR')} {' '}
                    {new Date(a.datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </span>
                  {' · '}
                  {a.patientName}
                  {' · '}
                  <span className="text-slate-500">{a.motivo}</span>
                </li>
              ))
            }
          </ul>
        </Card>
      )}
      
      <Card>
        <h3 className="font-medium text-sm mb-2">
          Turnos del {new Date(sel).toLocaleDateString('es-AR')}
        </h3>
        <ul className="divide-y">
          {appts.length === 0 && (
            <li className="py-2 text-sm text-slate-500">
              Sin turnos para esta fecha
            </li>
          )}
          {appts.map(a => <AgendaItem key={a.id} appt={a} onUpdate={loadTurnos} />)}
        </ul>
      </Card>
    </div>
  );
}

// Item individual de la agenda con toggle para historia clínica
function AgendaItem({ appt, onUpdate }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="py-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">
            {new Date(appt.datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </span> · {appt.patientName} · {appt.motivo}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setOpen(v => !v)}>
            Historia clínica
          </Button>
        </div>
      </div>
      {open && <History patientId={appt.patientId} patientName={appt.patientName} />}
    </li>
  );
}

// Componente Historia Clínica conectado a Azure
function History({ patientId, patientName }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [dx, setDx] = useState("");

  useEffect(() => {
    loadHistory();
  }, [patientId]);

  async function loadHistory() {
    try {
      const response = await fetch(`http://localhost:4000/historias/${patientId}`);
      const data = await response.json();
      setList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar historia clínica:", error);
      setLoading(false);
    }
  }

  async function addEntry() {
    if (!dx && !note) return;

    const entry = { 
      id: uid("hc"), 
      patientId, 
      dx, 
      note 
    };

    try {
      const response = await fetch("http://localhost:4000/historias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });

      if (response.ok) {
        await loadHistory();
        setNote("");
        setDx("");
      }
    } catch (error) {
      console.error("Error al registrar entrada:", error);
    }
  }

  if (loading) {
    return <Card className="mt-3"><p className="text-sm">Cargando historia clínica...</p></Card>;
  }

  return (
    <Card className="mt-3">
      <h4 className="font-medium mb-2">Historia clínica – {patientName}</h4>
      
      <div className="grid md:grid-cols-2 gap-3">
        <Input 
          label="Diagnóstico" 
          value={dx} 
          onChange={e => setDx(e.target.value)} 
          placeholder="CIE-10 / texto" 
        />
        <Input 
          label="Notas" 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          placeholder="Tratamiento, observaciones..." 
        />
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button onClick={addEntry}>Registrar</Button>
      </div>
      
      <div className="mt-4">
        <h5 className="text-sm text-slate-500">Últimas entradas</h5>
        <ul className="divide-y text-sm">
          {list.length === 0 && (
            <li className="py-2 text-slate-500">Sin registros</li>
          )}
          {list.map(e => (
            <li key={e.id} className="py-2">
              <span className="text-slate-500">{formatDateHuman(e.at)}:</span> <b>{e.dx}</b> — {e.note}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

window.Agenda = Agenda;
window.AgendaItem = AgendaItem;
window.History = History;