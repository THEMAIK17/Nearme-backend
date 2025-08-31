import mysql from "mysql2/promise";
import { dbConfig } from "../config/database.js";

async function updateProductConstraints() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado a la base de datos");

    console.log("🔄 Actualizando restricciones de la tabla products...");

    // 1. Verificar si existe la restricción UNIQUE
    console.log("📋 Verificando restricciones actuales...");
    const [indexes] = await connection.execute(
      'SHOW INDEX FROM products WHERE Key_name = "product_name"'
    );

    if (indexes.length > 0) {
      console.log("🗑️ Eliminando restricción UNIQUE de product_name...");
      await connection.execute("ALTER TABLE products DROP INDEX product_name");
      console.log("✅ Restricción UNIQUE eliminada");
    } else {
      console.log("ℹ️ No se encontró restricción UNIQUE en product_name");
    }

    // 2. Agregar índices para mejorar rendimiento
    console.log("📈 Agregando índices de rendimiento...");

    // Verificar si ya existen los índices
    const [existingIndexes] = await connection.execute(
      "SHOW INDEX FROM products"
    );
    const indexNames = existingIndexes.map((idx) => idx.Key_name);

    if (!indexNames.includes("idx_product_name")) {
      await connection.execute(
        "ALTER TABLE products ADD INDEX idx_product_name (product_name)"
      );
      console.log("✅ Índice idx_product_name agregado");
    } else {
      console.log("ℹ️ Índice idx_product_name ya existe");
    }

    if (!indexNames.includes("idx_category")) {
      await connection.execute(
        "ALTER TABLE products ADD INDEX idx_category (category)"
      );
      console.log("✅ Índice idx_category agregado");
    } else {
      console.log("ℹ️ Índice idx_category ya existe");
    }

    if (!indexNames.includes("idx_store")) {
      await connection.execute(
        "ALTER TABLE products ADD INDEX idx_store (id_store)"
      );
      console.log("✅ Índice idx_store agregado");
    } else {
      console.log("ℹ️ Índice idx_store ya existe");
    }

    // 3. Verificar cambios
    console.log("🔍 Verificando cambios aplicados...");
    const [finalIndexes] = await connection.execute("SHOW INDEX FROM products");
    console.log("📊 Índices actuales en la tabla products:");
    finalIndexes.forEach((idx) => {
      console.log(`   - ${idx.Key_name} (${idx.Column_name})`);
    });

    console.log("\n🎉 Actualización completada exitosamente!");
    console.log(
      "✅ Ahora múltiples tiendas pueden tener productos con el mismo nombre"
    );
    console.log(
      "✅ Se agregaron índices para mejorar el rendimiento de consultas"
    );
  } catch (error) {
    console.error("❌ Error durante la actualización:", error.message);
    console.error("Detalles:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Conexión cerrada");
    }
  }
}

updateProductConstraints();
