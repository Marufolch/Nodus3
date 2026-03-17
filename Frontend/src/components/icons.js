// icons.js - Componentes de iconos SVG

// Componente base para iconos
const Icon = ({ d, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d={d} />
  </svg>
);

// Iconos específicos
const CalendarDays = (props) => (
  <Icon d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" {...props} />
);

const ClipboardList = (props) => (
  <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" {...props} />
);

const LogOut = (props) => (
  <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9" {...props} />
);

const Mail = (props) => (
  <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...props} />
);

const Plus = (props) => (
  <Icon d="M12 5v14m-7-7h14" {...props} />
);

const Stethoscope = (props) => (
  <Icon d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" {...props} />
);

const User2 = (props) => (
  <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...props} />
);

const Users = (props) => (
  <Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m22-10a4 4 0 0 0-8 0" {...props} />
);

const FileDown = (props) => (
  <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...props} />
);

// Exportar para uso global
window.Icon = Icon;
window.CalendarDays = CalendarDays;
window.ClipboardList = ClipboardList;
window.LogOut = LogOut;
window.Mail = Mail;
window.Plus = Plus;
window.Stethoscope = Stethoscope;
window.User2 = User2;
window.Users = Users;
window.FileDown = FileDown;