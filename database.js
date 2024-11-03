require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectToDatabase = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion à la base de données:', err);
            return;
        }
        console.log('Connecté à la base de données MySQL !');
        connection.release();
    });
};

module.exports = {
    pool,
    connectToDatabase
};