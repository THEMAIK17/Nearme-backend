#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo -e "${BLUE}🚀 Pruebas Rápidas POST - NearMe Backend${NC}"
echo "=============================================="

# 1. Crear Tienda
echo -e "\n${YELLOW}1. Creando Tienda${NC}"
curl -s -X POST "$BASE_URL/api/stores" \
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
  }' | jq .

# 2. Crear Producto (sin stock, con sold_out)
echo -e "\n${YELLOW}2. Creando Producto${NC}"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Laptop Gaming",
    "price": 2500000,
    "category": "Tecnología",
    "id_store": "123-456-7890",
    "product_description": "Laptop gaming de alta gama con RTX 4060",
    "sold_out": false
  }' | jq .

# 3. Crear Producto Agotado
echo -e "\n${YELLOW}3. Creando Producto Agotado${NC}"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "iPhone 15 Pro",
    "price": 4500000,
    "category": "Smartphones",
    "id_store": "123-456-7890",
    "product_description": "iPhone 15 Pro 256GB, color Titanio Natural",
    "sold_out": true
  }' | jq .

# 4. Crear Segunda Tienda
echo -e "\n${YELLOW}4. Creando Segunda Tienda${NC}"
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

# 5. Crear Producto en Segunda Tienda
echo -e "\n${YELLOW}5. Creando Producto en Segunda Tienda${NC}"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Mouse Gaming RGB",
    "price": 150000,
    "category": "Accesorios Gaming",
    "id_store": "987-654-3210",
    "product_description": "Mouse gaming con RGB personalizable",
    "sold_out": false
  }' | jq .

# 6. Verificar resultados
echo -e "\n${YELLOW}6. Verificando Tiendas Creadas${NC}"
curl -s "$BASE_URL/api/stores" | jq .

echo -e "\n${YELLOW}7. Verificando Productos Creados${NC}"
curl -s "$BASE_URL/api/products" | jq .

echo -e "\n${GREEN}✅ Pruebas POST completadas${NC}"
