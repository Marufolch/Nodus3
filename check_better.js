const path = require('path');
const Database = require('better-sqlite3');

// Usar la ruta absoluta del script para que siempre encuentre clinica.db
const dbPath = path.join(__dirname, 'clinica.db');

try {
  const db = new Database(dbPath, { readonly: false });
  console.log('✅ Conectado a clinica.db');

  // Verificar si la tabla usuarios existe
  const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'").get();

  if (table) {
    console.log('✅ La tabla "usuarios" existe.');

    // Contar filas
    const countRow = db.prepare('SELECT COUNT(*) AS count FROM usuarios').get();
    console.log(`ℹ️  La tabla "usuarios" tiene ${countRow.count} fila(s).`);
  } else {
    console.warn('⚠️  La tabla "usuarios" NO existe.');
  }

  db.close();
} catch (err) {
  console.error('❌ Error al conectar o consultar la DB:', err.message);
}
