// helpers.js - Funciones auxiliares

// Generar ID único
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// Formatear fecha a ISO
function formatDateISO(d) { 
  return new Date(d).toISOString(); 
}

// Formatear fecha para lectura humana
function formatDateHuman(d) {
  const date = new Date(d);
  return date.toLocaleString(undefined, { 
    dateStyle: "medium", 
    timeStyle: "short" 
  });
}

// Convertir array de objetos a CSV
function toCSV(rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = Object.keys(rows[0] || {}).map(esc).join(",");
  const body = rows.map(r => Object.values(r).map(esc).join(",")).join("\n");
  return [head, body].filter(Boolean).join("\n");
}

// Exportar para uso global
window.uid = uid;
window.formatDateISO = formatDateISO;
window.formatDateHuman = formatDateHuman;
window.toCSV = toCSV;