require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectToDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connecté à la base de données MySQL !');
        connection.release();
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
};

module.exports = {
    pool,
    connectToDatabase
};