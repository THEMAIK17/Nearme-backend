# 🧪 Individual API Tests for NearMe Backend

## 📋 Commands to test each endpoint

### 1. Health Check

```
curl -X GET http://localhost:3000/health
```
### 2. Create Store (POST)

```
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
### 3. List Stores (GET)

```
curl -X GET http://localhost:3000/api/stores

```

### 4. Get Store by NIT (GET)

```
curl -X GET http://localhost:3000/api/stores/123-456-7890
```

### 5. Create Product (POST)

```
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
### 6. List Products (GET)

```
curl -X GET http://localhost:3000/api/products
```

### 7. Get Product by ID (GET)

```
curl -X GET http://localhost:3000/api/products/1
```
### 8. Update Store (PUT)

```
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

### 9. Update Product (PUT)

```
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
### 10. Delete Product (DELETE)

```
curl -X DELETE http://localhost:3000/api/products/1
```
### 11. Delete Store (DELETE)

```
curl -X DELETE http://localhost:3000/api/stores/123-456-7890
```

## 🎯 Example Data for Testing

### Example Stores

#### Clothing Store

```
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

#### Technology Store

```
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
#### Food Store

```
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
### Example Products

#### Tech Product
```
{
  "product_name": "iPhone 15 Pro",
  "price": 4500000,
  "category": "Smartphones",
  "id_store": "444-555-6666",
  "product_description": "iPhone 15 Pro 256GB, color Titanio Natural",
  "sold_out": false
}
```

#### Clothing Product
```
{
  "product_name": "Camisa Formal Azul",
  "price": 89000,
  "category": "Ropa Formal",
  "id_store": "111-222-3333",
  "product_description": "Camisa formal azul marino, 100% algodón, talla M",
  "sold_out": false
}
```

#### Food Product
```
{
  "product_name": "Manzanas Rojas",
  "price": 15000,
  "category": "Frutas",
  "id_store": "777-888-9999",
  "product_description": "Manzanas rojas frescas, 1kg",
  "sold_out": false
}
```
## 🔧 Useful Commands

### Verify that the server is running
```
curl http://localhost:3000/health
```
### Run all tests

```
chmod +x tests/api-tests.sh
./tests/api-tests.sh
```

### Clean database before tests
```
npm run clean-db
```

### View server logs
```
npm run dev
```

## 📝 Important Notes

Make sure the server is running on port 3000

Product IDs are auto-incremental

Store NITs must be unique

Store types go from 1 to 38 (see SQL script)

Opening and closing hours must be in HH:MM:SS format