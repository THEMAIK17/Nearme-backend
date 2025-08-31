# 🛍️ Pruebas de Cambio de Estado de Productos

## 📋 Endpoints para cambiar el estado de productos

### 1. Cambiar solo el estado `sold_out` (Recomendado)
```bash
# Marcar producto como agotado
curl -X PATCH http://localhost:3000/api/products/1/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'

# Marcar producto como disponible
curl -X PATCH http://localhost:3000/api/products/1/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": false}'
```

### 2. Actualizar producto completo (PUT mejorado)
```bash
# Cambiar solo el estado, mantener otros campos
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'

# Cambiar estado y precio
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "sold_out": false,
    "price": 2000000
  }'
```

## 🎯 Ejemplos Prácticos

### Marcar producto como agotado
```bash
curl -X PATCH http://localhost:3000/api/products/3/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'
```

**Respuesta esperada:**
```json
{
  "mensaje": "product status updated",
  "sold_out": true
}
```

### Marcar producto como disponible
```bash
curl -X PATCH http://localhost:3000/api/products/3/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": false}'
```

**Respuesta esperada:**
```json
{
  "mensaje": "product status updated",
  "sold_out": false
}
```

### Actualizar producto con PUT (campos opcionales)
```bash
curl -X PUT http://localhost:3000/api/products/4 \
  -H "Content-Type: application/json" \
  -d '{
    "sold_out": true,
    "price": 2800000
  }'
```

**Respuesta esperada:**
```json
{
  "mensaje": "product updated",
  "product": {
    "product_name": "Laptop Gaming",
    "price": "2800000.00",
    "category": "Tecnología",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming de alta gama con RTX 4060",
    "sold_out": true
  }
}
```

## 📊 Verificar cambios

### Listar todos los productos
```bash
curl -X GET http://localhost:3000/api/products
```

### Obtener producto específico
```bash
curl -X GET http://localhost:3000/api/products/1
```

## 🔧 Notas Importantes

- **PATCH /:id/status**: Solo cambia el campo `sold_out`
- **PUT /:id**: Cambia cualquier campo, los no enviados se mantienen
- **sold_out**: `true` = agotado, `false` = disponible
- En la base de datos: `1` = agotado, `0` = disponible

## 🚨 Errores Comunes

### Producto no encontrado
```json
{
  "status": "error",
  "message": "Product not found"
}
```

### Campo sold_out faltante
```json
{
  "status": "error",
  "message": "sold_out field is required"
}
```
