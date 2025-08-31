import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

async function updateStoreViewsTable() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a la base de datos');
        
        // Primero, eliminar la tabla existente si existe
        console.log('🗑️ Eliminando tabla store_views existente...');
        await connection.execute('DROP TABLE IF EXISTS store_views');
        
        // Crear la nueva tabla mejorada
        console.log('📋 Creando nueva tabla store_views mejorada...');
        await connection.execute(`
            CREATE TABLE store_views (
                id_view INT AUTO_INCREMENT PRIMARY KEY,
                id_store VARCHAR(20) NOT NULL,
                contact_type ENUM('whatsapp', 'email', 'phone', 'visit', 'other') NOT NULL,
                contact_method VARCHAR(50) NOT NULL,
                user_ip VARCHAR(45),
                user_agent TEXT,
                view_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                additional_data JSON,
                FOREIGN KEY (id_store) REFERENCES stores(nit_store)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
        
        console.log('✅ Tabla store_views actualizada exitosamente');
        
        // Crear índices para mejor rendimiento
        console.log('📊 Creando índices...');
        await connection.execute('CREATE INDEX idx_store_views_store ON store_views(id_store)');
        await connection.execute('CREATE INDEX idx_store_views_date ON store_views(view_date)');
        await connection.execute('CREATE INDEX idx_store_views_type ON store_views(contact_type)');
        
        console.log('✅ Índices creados exitosamente');
        
        // Insertar algunos datos de ejemplo
        console.log('📝 Insertando datos de ejemplo...');
        const sampleData = [
            ['123-456-7890', 'whatsapp', 'WhatsApp Business', '192.168.1.1', 'Mozilla/5.0...'],
            ['123-456-7890', 'email', 'Gmail', '192.168.1.2', 'Chrome/91.0...'],
            ['987-654-3210', 'whatsapp', 'WhatsApp Business', '192.168.1.3', 'Safari/14.0...'],
            ['123-456-7890', 'phone', 'Llamada directa', '192.168.1.4', 'Mobile App...']
        ];
        
        for (const [storeId, contactType, contactMethod, userIp, userAgent] of sampleData) {
            await connection.execute(`
                INSERT INTO store_views(id_store, contact_type, contact_method, user_ip, user_agent)
                VALUES (?, ?, ?, ?, ?)
            `, [storeId, contactType, contactMethod, userIp, userAgent]);
        }
        
        console.log('✅ Datos de ejemplo insertados');
        
        // Verificar la estructura
        const [columns] = await connection.execute('DESCRIBE store_views');
        console.log('📋 Estructura de la tabla store_views:');
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });
        
        // Verificar datos
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM store_views');
        console.log(`📊 Total de registros: ${rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

updateStoreViewsTable();
