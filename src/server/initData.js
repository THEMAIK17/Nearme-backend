import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function initData() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Insertar tipos de tienda básicos
        console.log('📋 Insertando tipos de tienda...');
        const storeTypes = [
            'Ropa', 'Calzado', 'Tecnología', 'Electrónica', 'Hogar',
            'Muebles', 'Decoración', 'Deportes', 'Juguetes', 'Alimentos y Bebidas'
        ];
        
        for (const storeType of storeTypes) {
            await connection.execute('INSERT INTO stores_type(store_type) VALUES (?)', [storeType]);
            console.log(`✅ Tipo de tienda agregado: ${storeType}`);
        }
        
        // Insertar una tienda de ejemplo
        console.log('🏪 Insertando tienda de ejemplo...');
        await connection.execute(`
            INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) 
            VALUES (?,?,?,?,?,?,?,?,?)
        `, [
            '123-456-7890',
            'Tienda de Prueba',
            'Calle 123 #45-67, Bogotá',
            '3001234567',
            'prueba@tienda.com',
            1,
            '08:00:00',
            '18:00:00',
            'Tienda de prueba para testing'
        ]);
        console.log('✅ Tienda de ejemplo agregada');
        
        // Verificar datos
        const [storeTypesCount] = await connection.execute('SELECT COUNT(*) as count FROM stores_type');
        const [storesCount] = await connection.execute('SELECT COUNT(*) as count FROM stores');
        
        console.log(`📊 Tipos de tienda: ${storeTypesCount[0].count}`);
        console.log(`📊 Tiendas: ${storesCount[0].count}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

initData();
