import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function testInsert() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Probar inserción directa
        const query = `INSERT INTO products(product_name,price,category,id_store,product_description,sold_out) VALUES (?,?,?,?,?,?)`;
        const values = [
            'Test Product',
            100000,
            'Test',
            '123-456-7890',
            'Producto de prueba',
            0
        ];
        
        console.log('🔍 Query:', query);
        console.log('📝 Values:', values);
        
        const [result] = await connection.execute(query, values);
        console.log('✅ Inserción exitosa:', result);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('🔍 SQL State:', error.sqlState);
        console.error('📝 SQL Message:', error.sqlMessage);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

testInsert();
