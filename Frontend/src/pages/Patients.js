// Patients.js - Gestión de pacientes conectado a Azure

const { useState, useEffect } = React;

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", dni: "", phone: "" });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await fetch("http://localhost:4000/pacientes");
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
      setLoading(false);
    }
  }

  async function addPatient() {
    if (!form.name || !form.dni) return;
    
    const newPatient = { 
      id: uid("p"), 
      ...form 
    };

    try {
      const response = await fetch("http://localhost:4000/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
      });

      if (response.ok) {
        await loadPatients(); // Recargar lista
        setForm({ name: "", dni: "", phone: "" });
      }
    } catch (error) {
      console.error("Error al agregar paciente:", error);
    }
  }
  
  async function removePatient(id) {
    try {
      const response = await fetch(`http://localhost:4000/pacientes/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        await loadPatients(); // Recargar lista
      }
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
    }
  }

  if (loading) {
    return <div className="p-4">Cargando pacientes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users className="w-4 h-4"/> Pacientes
      </h2>
      
      <Card>
        <div className="grid md:grid-cols-3 gap-3">
          <Input 
            label="Nombre" 
            value={form.name} 
            onChange={(e)=>setForm({...form, name:e.target.value})} 
          />
          <Input 
            label="DNI" 
            value={form.dni} 
            onChange={(e)=>setForm({...form, dni:e.target.value})} 
          />
          <Input 
            label="Teléfono" 
            value={form.phone} 
            onChange={(e)=>setForm({...form, phone:e.target.value})} 
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button onClick={addPatient}>
            <Plus className="w-4 h-4 inline mr-1"/>Agregar
          </Button>
        </div>
      </Card>
      
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>Nombre</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-t">
                <td className="py-2">{p.name}</td>
                <td>{p.dni}</td>
                <td>{p.phone}</td>
                <td className="text-right">
                  <Button variant="danger" onClick={()=>removePatient(p.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.Patients = Patients;