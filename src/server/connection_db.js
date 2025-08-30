import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

export const pool = mysql.createPool(dbConfig);
async function databaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`connected to the database successfully`);
        connection.release();
    } catch (error) {
        console.error(`connection error`)
    }
    
}
databaseConnection();