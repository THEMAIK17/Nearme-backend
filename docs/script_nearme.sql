-- Create and use the database
CREATE DATABASE IF NOT EXISTS NearMe;
USE NearMe;

-- Create tables
CREATE TABLE stores_type(
	id_store_type INT AUTO_INCREMENT PRIMARY KEY,
    store_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stores(
	nit_store VARCHAR(20) PRIMARY KEY,
    store_name VARCHAR(100) UNIQUE,
    address TEXT,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(200) UNIQUE,
    id_store_type INT ,
    opening_hours TIME,
    closing_hours TIME,
    note TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_store_type) REFERENCES stores_type(id_store_type)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
-- update: added field sold_out AND removed field stock
CREATE TABLE products(
	id_product INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(250),
    price DECIMAL(12,2),
    category VARCHAR(100),
    product_description varchar(300),
    id_store VARCHAR(20),
    sold_out BOOLEAN not null default 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_store) REFERENCES stores(nit_store) 
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    INDEX idx_product_name (product_name),
    INDEX idx_category (category),
    INDEX idx_store (id_store)
);
select * from products;
-- create table store_views
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
);
SELECT COUNT(*) AS total_views FROM store_views WHERE id_store;

INSERT INTO stores_type(store_type) VALUES
  ('Ropa'),
  ('Calzado'),
  ('Tecnología'),
  ('Electrónica'),
  ('Hogar'),
  ('Muebles'),
  ('Decoración'),
  ('Deportes'),
  ('Juguetes'),
  ('Alimentos y Bebidas'),
  ('Libros'),
  ('Belleza y Cuidado Personal'),
  ('Salud y Bienestar'),
  ('Herramientas'),
  ('Automotriz'),
  ('Accesorios'),
  ('Mascotas'),
  ('Papelería y Oficina'),
  ('Arte y Manualidades'),
  ('Viajes y Equipaje'),
  ('Electrodomésticos'),
  ('Productos para Bebés'),
  ('Ropa Interior'),
  ('Ropa de Cama'),
  ('Productos Ecológicos'),
  ('Joyería y Relojes'),
  ('Instrumentos Musicales'),
  ('Videojuegos'),
  ('Música y Películas'),
  ('Seguridad y Vigilancia'),
  ('Cuidado del Jardín'),
  ('Alimentos Orgánicos'),
  ('Suplementos y Vitaminas'),
  ('Ropa Deportiva'),
  ('Tecnología Wearable'),
  ('Cuidado del Automóvil'),
  ('Muebles de Oficina'),
  ('Suministros para Mascotas');

SELECT * FROM stores ;
INSERT INTO  stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES('100-NA-2000','olimpica','cra17#57c-90',3012223745,'maikol34@gmail.com',10,'07:00:00','17:00:00','productos de verduras');
INSERT INTO products(product_name,price,category,id_store,product_description,sold_out) VALUES ('yuca',2000,'verduras','100-NA-2000','producto para el consumo cotidiano',false);
SELECT * FROM products;

-- =====================================================
-- COMMANDS TO UPDATE AN EXISTING DATABASE
-- =====================================================

-- If you already have an existing database, run these commands:

-- 1. Remove the UNIQUE constraint from product_name
-- ALTER TABLE products DROP INDEX product_name;

-- 2. Add indexes to improve performance
-- ALTER TABLE products ADD INDEX idx_product_name (product_name);
-- ALTER TABLE products ADD INDEX idx_category (category);
-- ALTER TABLE products ADD INDEX idx_store (id_store);

-- 3. Verify that changes were applied correctly
-- SHOW INDEX FROM products;