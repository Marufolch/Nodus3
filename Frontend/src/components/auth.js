// auth.js - Pantalla de autenticación con conexión al backend SQLite
const { useState } = React;

function AuthScreen({ onLogin }) {
  const [username, setUsername] = useState(""); // antes email
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");

    try {
      // Llamada al backend local
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Pasar usuario al componente principal
      onLogin(data.user);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErr("Credenciales inválidas o error de conexión con el servidor");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-indigo-50 to-white">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5"/>Bienvenido a Nodus
        </h1>

        <form onSubmit={handleLogin} className="space-y-3">
          <Input 
            label="Usuario" 
            value={username} 
            onChange={(e)=>setUsername(e.target.value)} 
            placeholder="Ingrese usuario" 
          />
          <Input 
            label="Contraseña" 
            type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            placeholder="Ingrese su clave" 
          />
          {err && <div className="text-rose-600 text-sm">{err}</div>}
          <div className="flex justify-end">
            <Button type="submit">Entrar</Button>
          </div>
        </form>

        <div className="text-xs text-slate-500 mt-3">
          Usuario de prueba: <br />administrador – Clave: <b>administrador123</b><br />
           medico – Clave: <b>medico123</b>
        </div>
      </Card>
    </div>
  );
}

window.AuthScreen = AuthScreen;
