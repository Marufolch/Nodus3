// constants.js - Constantes del sistema

// Claves de localStorage
const LS = {
  users: "nodus_users",
  patients: "nodus_patients",
  appointments: "nodus_appointments",
  messages: "nodus_messages",
  histories: "nodus_histories",
};

// Roles de usuario
const roles = { 
  ADMIN: "ADMIN", 
  MEDICO: "MEDICO" 
};

// Usuarios de ejemplo para inicialización
const sampleUsers = [
  { 
    id: "u1", 
    email: "admin@nodus", 
    name: "Admin NODUS", 
    role: roles.ADMIN, 
    password: "demo" 
  },
  { 
    id: "u2", 
    email: "medico@nodus", 
    name: "Dra. García", 
    role: roles.MEDICO, 
    password: "demo", 
    license: "MP 12345" 
  },
];

// Exportar para uso global (en ambiente browser sin modules)
window.LS = LS;
window.roles = roles;
window.sampleUsers = sampleUsers;