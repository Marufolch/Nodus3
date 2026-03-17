// Reports.js - Sistema de reportes

function Reports() {
  const appts = loadLS(LS.appointments, []);
  
  // Preparar datos para CSV
  const rows = appts.map(a => ({ 
    Fecha: new Date(a.datetime).toLocaleDateString(), 
    Hora: new Date(a.datetime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), 
    Paciente: a.patientName, 
    Medico: a.medicoName, 
    Estado: a.status, 
    Motivo: a.motivo 
  }));
  
  const csv = rows.length ? toCSV(rows) : "";
  const href = rows.length ? URL.createObjectURL(new Blob([csv], { type: 'text/csv' })) : null;

  // Calcular totales por médico
  const totalsByMedico = appts.reduce((acc, a) => {
    acc[a.medicoName] = (acc[a.medicoName] || 0) + 1; 
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FileDown className="w-4 h-4"/> Reportes
      </h2>
      
      <Card>
        <h3 className="font-medium mb-2">Turnos por médico</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          {Object.keys(totalsByMedico).length === 0 && (
            <div className="text-slate-500">Sin datos</div>
          )}
          {Object.entries(totalsByMedico).map(([name, count]) => (
            <div 
              key={name} 
              className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between"
            >
              <span>{name}</span>
              <span className="text-xl font-bold">{count}</span>
            </div>
          ))}
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">Exportar turnos (CSV)</div>
          <Button 
            onClick={() => href && window.open(href)} 
            disabled={!href}
          >
            Descargar CSV
          </Button>
        </div>
      </Card>
      
      <Card>
        <p className="text-xs text-slate-500">
          Este reporte es mínimo para el MVP. Para producción: filtros por rango de fechas, estado, médico y exportación a PDF.
        </p>
      </Card>
    </div>
  );
}

// Exportar para uso global
window.Reports = Reports;