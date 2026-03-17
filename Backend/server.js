const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Azure SQL
const config = {
    user: 'nodusadmin',
    password: 'Palacios2025',
    server: 'mlinares.database.windows.net',
    database: 'nodusapp',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    },
    authentication: {
        type: 'default'
    }
};

// ============= USUARIOS / LOGIN =============

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    try {
        const pool = await sql.connect(config);
        
        const result = await pool.request()
            .input('usuario', sql.VarChar, username)
            .input('clave', sql.VarChar, password)
            .query('SELECT * FROM [dbo].[usuarios] WHERE usuario = @usuario AND clave = @clave');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];
        
        res.json({
            user: {
                id: user.Id,
                username: user.usuario,
                name: user.name || user.usuario,
                rol: user.rol,
                role: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Obtener todos los usuarios (para mensajes y turnos)
app.get('/usuarios', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT Id as id, usuario as username, name, rol as role FROM [dbo].[usuarios]');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// ============= PACIENTES =============

// Obtener todos los pacientes
app.get('/pacientes', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM [dbo].[pacientes] ORDER BY name');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Crear paciente
app.post('/pacientes', async (req, res) => {
    const { id, name, dni, phone } = req.body;

    if (!id || !name || !dni) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('name', sql.VarChar, name)
            .input('dni', sql.VarChar, dni)
            .input('phone', sql.VarChar, phone || '')
            .query('INSERT INTO [dbo].[pacientes] (id, name, dni, phone) VALUES (@id, @name, @dni, @phone)');
        
        res.json({ success: true, patient: { id, name, dni, phone } });
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Eliminar paciente
app.delete('/pacientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM [dbo].[pacientes] WHERE id = @id');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// ============= TURNOS =============

// Obtener todos los turnos
app.get('/turnos', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM [dbo].[turnos] ORDER BY datetime DESC');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener turnos:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Crear turno
app.post('/turnos', async (req, res) => {
    const { id, patientId, patientName, medicoId, medicoName, datetime, motivo, status } = req.body;

    if (!id || !patientId || !medicoId || !datetime) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('patientId', sql.VarChar, patientId)
            .input('patientName', sql.VarChar, patientName)
            .input('medicoId', sql.Int, medicoId)
            .input('medicoName', sql.VarChar, medicoName)
            .input('datetime', sql.DateTime, new Date(datetime))
            .input('motivo', sql.VarChar, motivo || '')
            .input('status', sql.VarChar, status || 'ACTIVO')
            .query(`INSERT INTO [dbo].[turnos] (id, patientId, patientName, medicoId, medicoName, datetime, motivo, status) 
                    VALUES (@id, @patientId, @patientName, @medicoId, @medicoName, @datetime, @motivo, @status)`);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al crear turno:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Actualizar estado de turno
app.put('/turnos/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('status', sql.VarChar, status)
            .query('UPDATE [dbo].[turnos] SET status = @status WHERE id = @id');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar turno:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// ============= MENSAJES =============

// Obtener todos los mensajes
app.get('/mensajes', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM [dbo].[mensajes] ORDER BY at DESC');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Crear mensaje
app.post('/mensajes', async (req, res) => {
    const { id, fromUserId, toUserId, text } = req.body;

    if (!id || !fromUserId || !toUserId || !text) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('fromUserId', sql.Int, fromUserId)
            .input('toUserId', sql.Int, toUserId)
            .input('text', sql.VarChar, text)
            .query('INSERT INTO [dbo].[mensajes] (id, fromUserId, toUserId, text, at) VALUES (@id, @fromUserId, @toUserId, @text, GETDATE())');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al crear mensaje:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// ============= HISTORIAS CLÍNICAS =============

// Obtener historia clínica de un paciente
app.get('/historias/:patientId', async (req, res) => {
    const { patientId } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientId', sql.VarChar, patientId)
            .query('SELECT * FROM [dbo].[historias_clinicas] WHERE patientId = @patientId ORDER BY at DESC');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener historia clínica:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Crear entrada en historia clínica
app.post('/historias', async (req, res) => {
    const { id, patientId, dx, note } = req.body;

    if (!id || !patientId) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('patientId', sql.VarChar, patientId)
            .input('dx', sql.VarChar, dx || '')
            .input('note', sql.VarChar, note || '')
            .query('INSERT INTO [dbo].[historias_clinicas] (id, patientId, dx, note, at) VALUES (@id, @patientId, @dx, @note, GETDATE())');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al crear entrada en historia clínica:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        await sql.close();
    }
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});