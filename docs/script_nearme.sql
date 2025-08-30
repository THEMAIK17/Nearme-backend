create database if not exists NearMe;
use NearMe;



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
-- update en fild sold_out AND DELETE fild stock
CREATE TABLE products(
	id_product INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(250) UNIQUE,
    price DECIMAL(12,2),
    category VARCHAR(100),
    id_store VARCHAR(20),
    sold_out BOOLEAN not null default 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_store) REFERENCES stores(nit_store) 
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
select * from products;
-- create table store_views
create table store_views(
id_view int auto_increment primary key,
id_store varchar(20) not null,
viwe_date datetime default current_timestamp, 
foreign key (id_store) references stores(nit_store)

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
INSERT INTO products(product_name,price,stock,category,id_store,product_description) VALUES ('yuca',2000,5,'verduras','100-NA-2000','producto para el consumo cotidiano');
SELECT * FROM products;