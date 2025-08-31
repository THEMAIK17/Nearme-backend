import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function debugQuery() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Simular exactamente lo que hace el controlador
        const product_name = 'Test Product';
        const price = 100000;
        const category = 'Test';
        const id_store = '100-NA-2000';
        const product_description = 'Producto de prueba';
        const sold_out = false;
        
        const query = `INSERT INTO products(product_name,price,category,id_store,product_description,sold_out) VALUES (?,?,?,?,?,?)`;
        const values = [
            product_name.toString().trim(),
            price,
            category.toString().trim(),
            id_store,
            product_description.toString().trim(),
            sold_out ? 1 : 0,
        ];
        
        console.log('🔍 Query:', query);
        console.log('📝 Values:', values);
        console.log('📊 Values length:', values.length);
        console.log('🔢 Placeholders count:', (query.match(/\?/g) || []).length);
        
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

debugQuery();
