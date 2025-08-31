# 🧪 Pruebas Individuales de API NearMe Backend

## 📋 Comandos para probar cada endpoint

### 1. Health Check
```bash
curl -X GET http://localhost:3000/health
```

### 2. Crear Tienda (POST)
```bash
curl -X POST http://localhost:3000/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "nit_store": "123-456-7890",
    "store_name": "Tienda de Prueba",
    "address": "Calle 123 #45-67, Bogotá",
    "phone_number": "3001234567",
    "email": "prueba@tienda.com",
    "id_store_type": 1,
    "opening_hours": "08:00:00",
    "closing_hours": "18:00:00",
    "note": "Tienda de prueba para testing"
  }'
```

### 3. Listar Tiendas (GET)
```bash
curl -X GET http://localhost:3000/api/stores
```

### 4. Obtener Tienda por NIT (GET)
```bash
curl -X GET http://localhost:3000/api/stores/123-456-7890
```

### 5. Crear Producto (POST)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Laptop Gaming",
    "price": 2500000,
    "category": "Tecnología",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming de alta gama con RTX 4060",
    "sold_out": false
  }'
```

### 6. Listar Productos (GET)
```bash
curl -X GET http://localhost:3000/api/products
```

### 7. Obtener Producto por ID (GET)
```bash
curl -X GET http://localhost:3000/api/products/1
```

### 8. Actualizar Tienda (PUT)
```bash
curl -X PUT http://localhost:3000/api/stores/123-456-7890 \
  -H "Content-Type: application/json" \
  -d '{
    "nit_store": "123-456-7890",
    "store_name": "Tienda Actualizada",
    "address": "Calle 456 #78-90, Medellín",
    "phone_number": "3001234567",
    "email": "prueba@tienda.com",
    "id_store_type": 1,
    "opening_hours": "09:00:00",
    "closing_hours": "19:00:00",
    "note": "Tienda actualizada"
  }'
```

### 9. Actualizar Producto (PUT)
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Laptop Gaming Pro",
    "price": 2800000,
    "category": "Tecnología Gaming",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming profesional con RTX 4070",
    "sold_out": false
  }'
```

### 10. Eliminar Producto (DELETE)
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

### 11. Eliminar Tienda (DELETE)
```bash
curl -X DELETE http://localhost:3000/api/stores/123-456-7890
```

## 🎯 Ejemplos de Datos para Testing

### Tiendas de Ejemplo

#### Tienda de Ropa
```json
{
  "nit_store": "111-222-3333",
  "store_name": "Fashion Store",
  "address": "Centro Comercial Galerías, Local 15",
  "phone_number": "3001112222",
  "email": "info@fashionstore.com",
  "id_store_type": 1,
  "opening_hours": "10:00:00",
  "closing_hours": "21:00:00",
  "note": "Tienda de ropa casual y formal"
}
```

#### Tienda de Tecnología
```json
{
  "nit_store": "444-555-6666",
  "store_name": "Tech World",
  "address": "Calle 72 #10-45, Bogotá",
  "phone_number": "3004445555",
  "email": "ventas@techworld.com",
  "id_store_type": 3,
  "opening_hours": "09:00:00",
  "closing_hours": "19:00:00",
  "note": "Especialistas en tecnología y computadores"
}
```

#### Tienda de Alimentos
```json
{
  "nit_store": "777-888-9999",
  "store_name": "Super Mercado",
  "address": "Carrera 15 #93-47, Bogotá",
  "phone_number": "3007778888",
  "email": "pedidos@supermercado.com",
  "id_store_type": 10,
  "opening_hours": "07:00:00",
  "closing_hours": "22:00:00",
  "note": "Supermercado con productos frescos"
}
```

### Productos de Ejemplo

#### Producto Tecnológico
```json
{
  "product_name": "iPhone 15 Pro",
  "price": 4500000,
  "category": "Smartphones",
  "id_store": "444-555-6666",
  "product_description": "iPhone 15 Pro 256GB, color Titanio Natural",
  "sold_out": false
}
```

#### Producto de Ropa
```json
{
  "product_name": "Camisa Formal Azul",
  "price": 89000,
  "category": "Ropa Formal",
  "id_store": "111-222-3333",
  "product_description": "Camisa formal azul marino, 100% algodón, talla M",
  "sold_out": false
}
```

#### Producto Alimenticio
```json
{
  "product_name": "Manzanas Rojas",
  "price": 15000,
  "category": "Frutas",
  "id_store": "777-888-9999",
  "product_description": "Manzanas rojas frescas, 1kg",
  "sold_out": false
}
```

## 🔧 Comandos Útiles

### Verificar que el servidor esté corriendo
```bash
curl http://localhost:3000/health
```

### Ejecutar todas las pruebas
```bash
chmod +x tests/api-tests.sh
./tests/api-tests.sh
```

### Limpiar base de datos antes de pruebas
```bash
npm run clean-db
```

### Ver logs del servidor
```bash
npm run dev
```

## 📝 Notas Importantes

- Asegúrate de que el servidor esté corriendo en el puerto 3000
- Los IDs de productos son auto-incrementales
- Los NITs de tiendas deben ser únicos
- Los tipos de tienda van del 1 al 38 (ver script SQL)
- Los horarios deben estar en formato HH:MM:SS
