// Messages.js - Sistema de mensajería conectado a Azure

const { useState, useEffect } = React;

function Messages({ user }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Seleccionar el primer usuario que no sea el actual
    if (users.length > 0 && !to) {
      const otherUser = users.find(u => u.id !== user.id);
      if (otherUser) setTo(otherUser.id);
    }
  }, [users, user.id]);

  async function loadData() {
    try {
      const [messagesRes, usersRes] = await Promise.all([
        fetch("http://localhost:4000/mensajes"),
        fetch("http://localhost:4000/usuarios")
      ]);

      const messagesData = await messagesRes.json();
      const usersData = await usersRes.json();

      setMessages(messagesData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  }

  async function send() {
    if (!text || !to) return;
    
    const msg = { 
      id: uid("m"), 
      fromUserId: user.id, 
      toUserId: parseInt(to), 
      text
    };
    
    try {
      const response = await fetch("http://localhost:4000/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg)
      });

      if (response.ok) {
        await loadData();
        setText("");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  }

  if (loading) {
    return <div className="p-4">Cargando mensajes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Mail className="w-4 h-4"/> Mensajes
      </h2>
      
      <Card>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Para</div>
            <select 
              value={to} 
              onChange={e => setTo(e.target.value)} 
              className="w-full border rounded-xl px-3 py-2"
            >
              <option value="">Seleccionar...</option>
              {users.filter(u => u.id !== user.id).map(u => (
                <option key={u.id} value={u.id}>{u.name || u.username}</option>
              ))}
            </select>
          </label>
          
          <div className="md:col-span-3">
            <Input 
              label="Mensaje" 
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder="Recordatorio, cambio de turno..." 
            />
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button onClick={send}>Enviar</Button>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-medium mb-2">Bandeja</h3>
        <ul className="divide-y text-sm">
          {messages.length === 0 && (
            <li className="py-2 text-slate-500">Sin mensajes</li>
          )}
          {messages.map(m => {
            const fromUser = users.find(u => u.id === m.fromUserId);
            const toUser = users.find(u => u.id === m.toUserId);
            const fromName = fromUser?.name || fromUser?.username || "?";
            const toName = toUser?.name || toUser?.username || "?";
            
            return (
              <li key={m.id} className="py-2 flex justify-between">
                <span><b>{fromName}</b> → {toName}: {m.text}</span>
                <span className="text-slate-500">{formatDateHuman(m.at)}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

window.Messages = Messages;