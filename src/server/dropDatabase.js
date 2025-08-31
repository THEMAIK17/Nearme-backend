import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function dropDatabase() {
    let connection;
    
    try {
        // Crear conexión
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Deshabilitar verificación de claves foráneas temporalmente
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        // Lista de tablas a eliminar (en orden inverso para evitar problemas de FK)
        const tables = [
            'products',    // Primero eliminar tablas dependientes
            'stores',      // Luego tablas principales
            'stores_type'  // Finalmente tablas base
        ];
        
        console.log('💥 Iniciando eliminación de tablas...');
        
        for (const table of tables) {
            try {
                await connection.execute(`DROP TABLE IF EXISTS ${table}`);
                console.log(`✅ Tabla '${table}' eliminada correctamente`);
            } catch (error) {
                console.error(`❌ Error eliminando tabla '${table}':`, error.message);
            }
        }
        
        // Rehabilitar verificación de claves foráneas
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('🎉 Eliminación de tablas completada exitosamente');
        console.log('⚠️  NOTA: Para recrear las tablas, ejecuta el script SQL original');
        
    } catch (error) {
        console.error('❌ Error durante la eliminación:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar la función si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    dropDatabase();
}

export default dropDatabase;
