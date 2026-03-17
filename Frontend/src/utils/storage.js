// storage.js - Gestión de localStorage

// Guardar en localStorage
function saveLS(key, value) { 
  localStorage.setItem(key, JSON.stringify(value)); 
}

// Cargar desde localStorage
function loadLS(key, fallback) {
  try { 
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; 
  } catch { 
    return fallback; 
  }
}

// Inicializar datos en localStorage
function initStorage() {
  // Usuarios
  if (!localStorage.getItem(LS.users)) {
    saveLS(LS.users, sampleUsers);
  }
  
  // Pacientes de ejemplo
  if (!localStorage.getItem(LS.patients)) {
    saveLS(LS.patients, [
      { 
        id: "p1", 
        dni: "30111222", 
        name: "Juan Pérez", 
        phone: "351-555-1111" 
      },
      { 
        id: "p2", 
        dni: "27999888", 
        name: "María López", 
        phone: "351-555-2222" 
      },
    ]);
  }
  
  // Inicializar colecciones vacías
  if (!localStorage.getItem(LS.appointments)) {
    saveLS(LS.appointments, []);
  }
  
  if (!localStorage.getItem(LS.messages)) {
    saveLS(LS.messages, []);
  }
  
  if (!localStorage.getItem(LS.histories)) {
    saveLS(LS.histories, {});
  }
}

// Exportar para uso global
window.saveLS = saveLS;
window.loadLS = loadLS;
window.initStorage = initStorage;