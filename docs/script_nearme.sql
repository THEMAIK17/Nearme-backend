
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
    contact_type ENUM('visit', 'phone_call', 'whatsapp', 'email', 'social_media', 'in_person') DEFAULT 'visit',
    contact_method ENUM('web', 'mobile_app', 'api', 'admin_panel') DEFAULT 'web',
    user_ip VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    additional_data JSON,
    view_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_store) REFERENCES stores(nit_store)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX idx_store (id_store),
    INDEX idx_contact_type (contact_type),
    INDEX idx_view_date (view_date),
    INDEX idx_store_date (id_store, view_date),
    INDEX idx_session (session_id)
);

CREATE TABLE recent_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(20), -- NIT de la tienda
  activity_type ENUM('product_added', 'product_updated', 'product_deleted', 'store_contacted', 'excel_uploaded', 'login', 'logout', 'profile_updated', 'password_changed', 'store_info_updated'),
  activity_description TEXT,
  metadata JSON, -- Datos adicionales como nombre del producto, etc.
  session_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES stores(nit_store) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at),
  INDEX idx_session (session_id),
  INDEX idx_user_activity (user_id, activity_type)
);

CREATE TABLE store_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id VARCHAR(20),
  date DATE,
  total_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  total_contacts INT DEFAULT 0,
  products_added INT DEFAULT 0,
  products_updated INT DEFAULT 0,
  products_deleted INT DEFAULT 0,
  excel_uploads INT DEFAULT 0,
  login_sessions INT DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_session_duration INT DEFAULT 0, -- en segundos
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(nit_store) ON DELETE CASCADE,
  UNIQUE KEY unique_store_date (store_id, date),
  INDEX idx_store_id (store_id),
  INDEX idx_date (date),
  INDEX idx_store_date (store_id, date)
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

-- 3. Update store_views table with new improvements
-- ALTER TABLE store_views MODIFY COLUMN contact_type ENUM('visit', 'phone_call', 'whatsapp', 'email', 'social_media', 'in_person') DEFAULT 'visit';
-- ALTER TABLE store_views MODIFY COLUMN contact_method ENUM('web', 'mobile_app', 'api', 'admin_panel') DEFAULT 'web';
-- ALTER TABLE store_views ADD COLUMN session_id VARCHAR(100) AFTER user_agent;
-- ALTER TABLE store_views ADD INDEX idx_store_date (id_store, view_date);
-- ALTER TABLE store_views ADD INDEX idx_session (session_id);

-- 4. Update recent_activities table with new improvements
-- ALTER TABLE recent_activities MODIFY COLUMN activity_type ENUM('product_added', 'product_updated', 'product_deleted', 'store_contacted', 'excel_uploaded', 'login', 'logout', 'profile_updated', 'password_changed', 'store_info_updated');
-- ALTER TABLE recent_activities ADD COLUMN session_id VARCHAR(100) AFTER metadata;
-- ALTER TABLE recent_activities ADD INDEX idx_user_id (user_id);
-- ALTER TABLE recent_activities ADD INDEX idx_activity_type (activity_type);
-- ALTER TABLE recent_activities ADD INDEX idx_created_at (created_at);
-- ALTER TABLE recent_activities ADD INDEX idx_session (session_id);
-- ALTER TABLE recent_activities ADD INDEX idx_user_activity (user_id, activity_type);

-- 5. Update store_statistics table with new metrics
-- ALTER TABLE store_statistics ADD COLUMN unique_visitors INT DEFAULT 0 AFTER total_views;
-- ALTER TABLE store_statistics ADD COLUMN products_deleted INT DEFAULT 0 AFTER products_updated;
-- ALTER TABLE store_statistics ADD COLUMN login_sessions INT DEFAULT 0 AFTER excel_uploads;
-- ALTER TABLE store_statistics ADD COLUMN bounce_rate DECIMAL(5,2) DEFAULT 0.00 AFTER login_sessions;
-- ALTER TABLE store_statistics ADD COLUMN avg_session_duration INT DEFAULT 0 AFTER bounce_rate;
-- ALTER TABLE store_statistics ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER avg_session_duration;
-- ALTER TABLE store_statistics ADD INDEX idx_store_id (store_id);
-- ALTER TABLE store_statistics ADD INDEX idx_date (date);
-- ALTER TABLE store_statistics ADD INDEX idx_store_date (store_id, date);

-- 6. Verify that changes were applied correctly
-- SHOW INDEX FROM products;
-- SHOW INDEX FROM store_views;
-- SHOW INDEX FROM recent_activities;
-- SHOW INDEX FROM store_statistics;