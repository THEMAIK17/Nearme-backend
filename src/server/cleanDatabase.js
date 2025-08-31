// cleanDatabase.js - Script para limpiar todas las tablas
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function cleanDatabase() {
    let connection;
    
    try {
        // Crear conexión
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Deshabilitar verificación de claves foráneas temporalmente
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        // Lista de tablas a limpiar (en orden para evitar problemas de FK)
        const tables = [
            'products',
            'stores', 
            'stores_type'
        ];
        
        console.log('🧹 Iniciando limpieza de tablas...');
        
        for (const table of tables) {
            try {
                await connection.execute(`TRUNCATE TABLE ${table}`);
                console.log(`✅ Tabla '${table}' limpiada correctamente`);
            } catch (error) {
                console.error(`❌ Error limpiando tabla '${table}':`, error.message);
            }
        }
        
        // Rehabilitar verificación de claves foráneas
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('🎉 Limpieza de base de datos completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar la función si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    cleanDatabase();
}

export default cleanDatabase;