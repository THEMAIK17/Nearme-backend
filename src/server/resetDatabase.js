import mysql from "mysql2/promise";
import { dbConfig } from "../config/database.js";

async function resetDatabase() {
  let connection;

  try {
    // Crear conexión
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado a la base de datos");

    // Deshabilitar verificación de claves foráneas temporalmente
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    // Lista de tablas a eliminar (en orden inverso para evitar problemas de FK)
    const tables = [
      "store_views", // Primero eliminar tablas dependientes
      "products", // Luego tablas dependientes
      "stores", // Luego tablas principales
      "stores_type", // Finalmente tablas base
    ];

    console.log("💥 Eliminando tablas existentes...");

    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Tabla '${table}' eliminada`);
      } catch (error) {
        console.error(`❌ Error eliminando tabla '${table}':`, error.message);
      }
    }

    // Rehabilitar verificación de claves foráneas
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    console.log("\n🏗️ Creando nuevas tablas...");

    // Crear tabla stores_type
    await connection.execute(`
            CREATE TABLE stores_type(
                id_store_type INT AUTO_INCREMENT PRIMARY KEY,
                store_type VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    console.log("✅ Tabla stores_type creada");

    // Crear tabla stores
    await connection.execute(`
            CREATE TABLE stores(
                nit_store VARCHAR(20) PRIMARY KEY,
                store_name VARCHAR(100) UNIQUE,
                address TEXT,
                phone_number VARCHAR(20) UNIQUE,
                email VARCHAR(200) UNIQUE,
                id_store_type INT,
                opening_hours TIME,
                closing_hours TIME,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_store_type) REFERENCES stores_type(id_store_type)
                ON DELETE SET NULL
                ON UPDATE CASCADE
            )
        `);
    console.log("✅ Tabla stores creada");

    // Crear tabla products (sin restricción UNIQUE en product_name)
    await connection.execute(`
            CREATE TABLE products(
                id_product INT AUTO_INCREMENT PRIMARY KEY,
                product_name VARCHAR(250),
                price DECIMAL(12,2),
                category VARCHAR(100),
                product_description VARCHAR(300),
                id_store VARCHAR(20),
                sold_out BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_store) REFERENCES stores(nit_store) 
                ON DELETE SET NULL
                ON UPDATE CASCADE,
                INDEX idx_product_name (product_name),
                INDEX idx_category (category),
                INDEX idx_store (id_store)
            )
        `);
    console.log("✅ Tabla products creada (sin restricción UNIQUE)");

    // Crear tabla store_views
    await connection.execute(`
            CREATE TABLE store_views(
                id_view INT AUTO_INCREMENT PRIMARY KEY,
                id_store VARCHAR(20) NOT NULL,
                contact_type VARCHAR(50) DEFAULT 'visit',
                contact_method VARCHAR(50) DEFAULT 'web',
                user_ip VARCHAR(45),
                user_agent TEXT,
                additional_data JSON,
                view_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_store) REFERENCES stores(nit_store)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
                INDEX idx_store (id_store),
                INDEX idx_contact_type (contact_type),
                INDEX idx_view_date (view_date)
            )
        `);
    console.log("✅ Tabla store_views creada");

    console.log("\n📊 Insertando datos iniciales...");

    // Insertar tipos de tienda
    const storeTypes = [
      "Ropa",
      "Calzado",
      "Tecnología",
      "Electrónica",
      "Hogar",
      "Muebles",
      "Decoración",
      "Deportes",
      "Juguetes",
      "Alimentos y Bebidas",
      "Libros",
      "Belleza y Cuidado Personal",
      "Salud y Bienestar",
      "Herramientas",
      "Automotriz",
      "Accesorios",
      "Mascotas",
      "Papelería y Oficina",
      "Arte y Manualidades",
      "Viajes y Equipaje",
      "Electrodomésticos",
      "Productos para Bebés",
      "Ropa Interior",
      "Ropa de Cama",
      "Productos Ecológicos",
      "Joyería y Relojes",
      "Instrumentos Musicales",
      "Videojuegos",
      "Música y Películas",
      "Seguridad y Vigilancia",
      "Cuidado del Jardín",
      "Alimentos Orgánicos",
      "Suplementos y Vitaminas",
      "Ropa Deportiva",
      "Tecnología Wearable",
      "Cuidado del Automóvil",
      "Muebles de Oficina",
      "Suministros para Mascotas",
    ];

    for (const storeType of storeTypes) {
      await connection.execute(
        "INSERT INTO stores_type(store_type) VALUES (?)",
        [storeType]
      );
    }
    console.log(`✅ ${storeTypes.length} tipos de tienda insertados`);

    // Insertar tienda de ejemplo
    await connection.execute(
      `
            INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) 
            VALUES (?,?,?,?,?,?,?,?,?)
        `,
      [
        "100-NA-2000",
        "olimpica",
        "cra17#57c-90",
        "3012223745",
        "maikol34@gmail.com",
        10,
        "07:00:00",
        "17:00:00",
        "productos de verduras",
      ]
    );
    console.log("✅ Tienda de ejemplo insertada");

    // Insertar producto de ejemplo
    await connection.execute(
      `
            INSERT INTO products(product_name,price,category,id_store,product_description,sold_out) 
            VALUES (?,?,?,?,?,?)
        `,
      [
        "yuca",
        2000,
        "verduras",
        "100-NA-2000",
        "producto para el consumo cotidiano",
        false,
      ]
    );
    console.log("✅ Producto de ejemplo insertado");

    // Verificar datos
    const [storeTypesCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM stores_type"
    );
    const [storesCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM stores"
    );
    const [productsCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM products"
    );

    console.log("\n📊 Resumen de datos:");
    console.log(`   - Tipos de tienda: ${storeTypesCount[0].count}`);
    console.log(`   - Tiendas: ${storesCount[0].count}`);
    console.log(`   - Productos: ${productsCount[0].count}`);

    console.log("\n🎉 ¡Base de datos reinicializada exitosamente!");
    console.log(
      "✅ Todas las tablas fueron recreadas con la estructura actualizada"
    );
    console.log("✅ La restricción UNIQUE de product_name fue eliminada");
    console.log("✅ Se agregaron índices para mejorar el rendimiento");
    console.log("✅ Datos de ejemplo insertados correctamente");
  } catch (error) {
    console.error("❌ Error durante el reinicio:", error.message);
    console.error("Detalles:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Conexión cerrada");
    }
  }
}

resetDatabase();
