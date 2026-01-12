import mysql from 'mysql2/promise';

// Configuración de la base de datos
// Puedes cambiar estos valores según tu configuración
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'experiment_data',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexiones para mejor rendimiento
let pool = null;

export function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Función para ejecutar queries
export async function query(sql, params) {
    const pool = getPool();
    const [results] = await pool.execute(sql, params);
    return results;
}

// Función para cerrar el pool (útil para tests)
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
