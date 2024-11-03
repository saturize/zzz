require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('DB_PASS:', process.env.DB_PASS); 

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connectToDatabase = async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connecté à la base de données MySQL !');
        connection.release();
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
};

module.exports = {
    db,
    connectToDatabase
};