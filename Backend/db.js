const sql = require('mssql');

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

// Exportar la config para usar en otros archivos
module.exports = config;