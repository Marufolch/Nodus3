// ui.js - Componentes UI básicos

// Componente Card
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

// Componente Button
function Button({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) {
  const base = "px-3 py-2 rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    ghost: "bg-slate-100 hover:bg-slate-200",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
  };
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Componente Input
function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <input 
        {...props} 
        className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 ring-indigo-300" 
      />
    </label>
  );
}

// Componente KPI (indicador)
function Kpi({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

// Exportar para uso global
window.Card = Card;
window.Button = Button;
window.Input = Input;
window.Kpi = Kpi;