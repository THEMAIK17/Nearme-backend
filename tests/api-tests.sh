#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}🧪 Iniciando pruebas de API NearMe Backend${NC}"
echo "=================================================="

# Función para mostrar resultado
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# 1. Health Check
echo -e "\n${YELLOW}1. Probando Health Check${NC}"
curl -s "$BASE_URL/health" | jq .
show_result $? "Health Check"

# 2. Crear Tienda (POST /api/stores)
echo -e "\n${YELLOW}2. Creando Tienda${NC}"
STORE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/stores" \
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
  }')
echo $STORE_RESPONSE | jq .
show_result $? "Crear Tienda"

# 3. Listar Tiendas (GET /api/stores)
echo -e "\n${YELLOW}3. Listando Tiendas${NC}"
curl -s "$BASE_URL/api/stores" | jq .
show_result $? "Listar Tiendas"

# 4. Obtener Tienda por NIT (GET /api/stores/:nit)
echo -e "\n${YELLOW}4. Obteniendo Tienda por NIT${NC}"
curl -s "$BASE_URL/api/stores/123-456-7890" | jq .
show_result $? "Obtener Tienda por NIT"

# 5. Crear Producto (POST /api/products)
echo -e "\n${YELLOW}5. Creando Producto${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Laptop Gaming",
    "price": 2500000,
    "category": "Tecnología",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming de alta gama con RTX 4060",
    "sold_out": false
  }')
echo $PRODUCT_RESPONSE | jq .
show_result $? "Crear Producto"

# 6. Listar Productos (GET /api/products)
echo -e "\n${YELLOW}6. Listando Productos${NC}"
curl -s "$BASE_URL/api/products" | jq .
show_result $? "Listar Productos"

# 7. Obtener Producto por ID (GET /api/products/:id)
echo -e "\n${YELLOW}7. Obteniendo Producto por ID${NC}"
curl -s "$BASE_URL/api/products/1" | jq .
show_result $? "Obtener Producto por ID"

# 8. Actualizar Tienda (PUT /api/stores/:nit)
echo -e "\n${YELLOW}8. Actualizando Tienda${NC}"
curl -s -X PUT "$BASE_URL/api/stores/123-456-7890" \
  -H "Content-Type: application/json" \
  -d '{
    "nit_store": "123-456-7890",
    "store_name": "Tienda de Prueba Actualizada",
    "address": "Calle 456 #78-90, Medellín",
    "phone_number": "3001234567",
    "email": "prueba@tienda.com",
    "id_store_type": 1,
    "opening_hours": "09:00:00",
    "closing_hours": "19:00:00",
    "note": "Tienda actualizada para testing"
  }' | jq .
show_result $? "Actualizar Tienda"

# 9. Actualizar Producto (PUT /api/products/:id)
echo -e "\n${YELLOW}9. Actualizando Producto${NC}"
curl -s -X PUT "$BASE_URL/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Laptop Gaming Pro",
    "price": 2800000,
    "category": "Tecnología Gaming",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming profesional con RTX 4070",
    "sold_out": false
  }' | jq .
show_result $? "Actualizar Producto"

# 10. Crear más productos para testing
echo -e "\n${YELLOW}10. Creando Productos Adicionales${NC}"

# Producto 2
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Mouse Gaming RGB",
    "price": 150000,
    "category": "Accesorios Gaming",
    "id_store": "123-456-7890",
    "product_description": "Mouse gaming con RGB personalizable",
    "sold_out": false
  }' | jq .

# Producto 3
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Teclado Mecánico",
    "price": 350000,
    "category": "Accesorios Gaming",
    "id_store": "123-456-7890",
    "product_description": "Teclado mecánico con switches Cherry MX",
    "sold_out": false
  }' | jq .

# 11. Crear otra tienda
echo -e "\n${YELLOW}11. Creando Segunda Tienda${NC}"
curl -s -X POST "$BASE_URL/api/stores" \
  -H "Content-Type: application/json" \
  -d '{
    "nit_store": "987-654-3210",
    "store_name": "Electrónicos Express",
    "address": "Avenida Principal #100, Cali",
    "phone_number": "3109876543",
    "email": "info@electronicos.com",
    "id_store_type": 3,
    "opening_hours": "07:00:00",
    "closing_hours": "20:00:00",
    "note": "Tienda especializada en electrónicos"
  }' | jq .

# 12. Crear producto en la segunda tienda
echo -e "\n${YELLOW}12. Creando Producto en Segunda Tienda${NC}"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Smartphone Samsung",
    "price": 1200000,
    "category": "Smartphones",
    "id_store": "987-654-3210",
    "product_description": "Samsung Galaxy S23 con 128GB",
    "sold_out": false
  }' | jq .

# 13. Listar todos los productos
echo -e "\n${YELLOW}13. Listando Todos los Productos${NC}"
curl -s "$BASE_URL/api/products" | jq .
show_result $? "Listar Todos los Productos"

# 14. Listar todas las tiendas
echo -e "\n${YELLOW}14. Listando Todas las Tiendas${NC}"
curl -s "$BASE_URL/api/stores" | jq .
show_result $? "Listar Todas las Tiendas"

# 15. Probar endpoint inexistente (404)
echo -e "\n${YELLOW}15. Probando Endpoint Inexistente (404)${NC}"
curl -s "$BASE_URL/api/inexistente" | jq .
show_result $? "Endpoint Inexistente"

echo -e "\n${BLUE}🎉 Pruebas completadas${NC}"
echo "=================================================="
