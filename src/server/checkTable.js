import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function checkTable() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Verificar estructura de la tabla products
        const [columns] = await connection.execute('DESCRIBE products');
        console.log('📋 Estructura de la tabla products:');
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });
        
        // Verificar si hay datos
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
        console.log(`📊 Número de productos: ${rows[0].count}`);
        
        if (rows[0].count > 0) {
            const [sample] = await connection.execute('SELECT * FROM products LIMIT 1');
            console.log('📝 Ejemplo de producto:');
            console.log(JSON.stringify(sample[0], null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

checkTable();
