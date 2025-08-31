#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}🧪 Starting NearMe Backend API Tests${NC}"
echo "=================================================="

# Function to show result
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# 1. Health Check
echo -e "\n${YELLOW}1. Testing Health Check${NC}"
curl -s "$BASE_URL/health" | jq .
show_result $? "Health Check"

# 2. Create Store (POST /api/stores)
echo -e "\n${YELLOW}2. Creating Store${NC}"
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
show_result $? "Create Store"

# 3. List Stores (GET /api/stores)
echo -e "\n${YELLOW}3. Listing Stores${NC}"
curl -s "$BASE_URL/api/stores" | jq .
show_result $? "List Stores"

# 4. Get Store by NIT (GET /api/stores/:nit)
echo -e "\n${YELLOW}4. Getting Store by NIT${NC}"
curl -s "$BASE_URL/api/stores/123-456-7890" | jq .
show_result $? "Get Store by NIT"

# 5. Create Product (POST /api/products)
echo -e "\n${YELLOW}5. Creating Product${NC}"
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
show_result $? "Create Product"

# 6. List Products (GET /api/products)
echo -e "\n${YELLOW}6. Listing Products${NC}"
curl -s "$BASE_URL/api/products" | jq .
show_result $? "List Products"

# 7. Get Product by ID (GET /api/products/:id)
echo -e "\n${YELLOW}7. Getting Product by ID${NC}"
curl -s "$BASE_URL/api/products/1" | jq .
show_result $? "Get Product by ID"

# 8. Update Store (PUT /api/stores/:nit)
echo -e "\n${YELLOW}8. Updating Store${NC}"
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
show_result $? "Update Store"

# 9. Update Product (PUT /api/products/:id)
echo -e "\n${YELLOW}9. Updating Product${NC}"
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
show_result $? "Update Product"

# 10. Create more products for testing
echo -e "\n${YELLOW}10. Creating Additional Products${NC}"

# Product 2
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

# Product 3
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

# 11. Create another store
echo -e "\n${YELLOW}11. Creating Second Store${NC}"
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

# 12. Create product in the second store
echo -e "\n${YELLOW}12. Creating Product in Second Store${NC}"
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

# 13. List all products
echo -e "\n${YELLOW}13. Listing All Products${NC}"
curl -s "$BASE_URL/api/products" | jq .
show_result $? "List All Products"

# 14. List all stores
echo -e "\n${YELLOW}14. Listing All Stores${NC}"
curl -s "$BASE_URL/api/stores" | jq .
show_result $? "List All Stores"

# 15. Test nonexistent endpoint (404)
echo -e "\n${YELLOW}15. Testing Nonexistent Endpoint (404)${NC}"
curl -s "$BASE_URL/api/inexistente" | jq .
show_result $? "Nonexistent Endpoint"

echo -e "\n${BLUE}🎉 Tests completed${NC}"
echo "=================================================="
