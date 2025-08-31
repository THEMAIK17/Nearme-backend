# NearMe Backend

Backend API para la aplicación NearMe, un sistema de gestión de tiendas y productos.

## 🚀 Características

- API RESTful para gestión de productos y tiendas
- Base de datos MySQL con Clever Cloud
- Servidor unificado en puerto 3000
- CORS habilitado
- Manejo de errores centralizado
- Scripts para gestión de base de datos

## 📁 Estructura del Proyecto

```
src/
├── app.js                    # Servidor principal
├── config/
│   └── database.js           # Configuración de BD
├── server/
│   ├── connection_db.js      # Conexión MySQL
│   ├── cleanDatabase.js      # Script para limpiar tablas
│   └── dropDatabase.js       # Script para eliminar tablas
└── controllers/
    ├── product.controller.js  # Rutas de productos
    └── store.controller.js    # Rutas de tiendas
```

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (opcional):
```bash
# Crear archivo .env con las siguientes variables:
DB_HOST=tu_host
DB_NAME=tu_database
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
PORT=3000
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 🗄️ Gestión de Base de Datos

### Inicializar base de datos con datos de prueba
```bash
npm run init-db
```
Este comando crea tipos de tienda básicos y una tienda de ejemplo.

### Limpiar todas las tablas (mantener estructura)
```bash
npm run clean-db
```
Este comando elimina todos los datos de las tablas pero mantiene la estructura.

### Eliminar todas las tablas completamente
```bash
npm run drop-db
```
Este comando elimina completamente todas las tablas de la base de datos.

### Actualizar tabla de consultas de tiendas
```bash
npm run update-views-table
```
Este comando actualiza la tabla store_views con la nueva estructura para manejar consultas.

⚠️ **ADVERTENCIA**: Las operaciones de limpieza y eliminación son irreversibles. Asegúrate de tener un respaldo antes de ejecutar.

## 📡 Endpoints

### Health Check
- `GET /health` - Estado del servidor

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto (campos opcionales)
- `PATCH /api/products/:id/status` - Cambiar solo el estado del producto
- `DELETE /api/products/:id` - Eliminar producto

### Tiendas
- `GET /api/stores` - Listar todas las tiendas
- `GET /api/stores/:nit` - Obtener tienda por NIT
- `POST /api/stores` - Crear nueva tienda
- `PUT /api/stores/:nit` - Actualizar tienda
- `DELETE /api/stores/:nit` - Eliminar tienda

### Consultas de Tiendas (Store Views)
- `POST /api/store-views` - Registrar consulta/contacto con tienda
- `GET /api/store-views/stats/:store_id` - Estadísticas de consultas por tienda
- `GET /api/store-views/store/:store_id` - Listar consultas de una tienda
- `GET /api/store-views/global-stats` - Estadísticas globales de consultas

## 🗄️ Base de Datos

El proyecto incluye el script SQL para crear la base de datos en `docs/script_nearme.sql`.

### Tablas:
- `stores_type` - Tipos de tiendas
- `stores` - Información de tiendas
- `products` - Productos de las tiendas
- `store_views` - Registro de consultas/contactos con tiendas

## 🔧 Tecnologías

- Node.js
- Express.js 4.18.2
- MySQL2
- CORS

## 🧪 Pruebas

### Ejecutar todas las pruebas
```bash
npm run test
```

### Ejecutar pruebas rápidas (solo POST)
```bash
npm run test-quick
```

### Limpiar base de datos antes de pruebas
```bash
npm run clean-db
npm run init-db
```

## 📝 Notas

- El servidor corre en el puerto 3000 por defecto
- Las credenciales de la base de datos están configuradas para Clever Cloud
- Se recomienda usar variables de entorno para las credenciales en producción
- Los scripts de base de datos respetan las claves foráneas y el orden de dependencias
- Los productos ya no tienen campo `stock`, ahora usan `sold_out` (BOOLEAN)
