// PatientsView.js - Vista de solo lectura de pacientes (para médicos)

const { useState, useEffect } = React;

function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  if (loading) {
    return <div className="p-4">Cargando pacientes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users className="w-4 h-4"/> Pacientes
      </h2>

      <Card>
        <Input 
          label="Buscar paciente" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Nombre, DNI o teléfono..."
        />
      </Card>
      
      <Card>
        <div className="text-sm text-slate-600 mb-3">
          Total de pacientes: <b>{patients.length}</b>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-2">Nombre</th>
                <th className="pb-2">DNI</th>
                <th className="pb-2">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-slate-500">
                    {searchTerm ? "No se encontraron pacientes" : "No hay pacientes registrados"}
                  </td>
                </tr>
              )}
              {filteredPatients.map(p => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{p.dni}</td>
                  <td className="py-3">{p.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

window.PatientsView = PatientsView;