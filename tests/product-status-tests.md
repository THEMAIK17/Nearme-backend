# 🛍️ Product Status Change Tests
## 📋 Endpoints to change product status

### 1. Change only the sold_out status (Recommended)

# Mark product as sold out
```
curl -X PATCH http://localhost:3000/api/products/1/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'

# Mark product as available
curl -X PATCH http://localhost:3000/api/products/1/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": false}'

```

###  2. Update full product (Improved PUT)
```
# Change only the status, keep other fields unchanged
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'

# Change status and price
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "sold_out": false,
    "price": 2000000
  }'
```
## 🎯 Practical Examples

### Mark product as sold out
```
curl -X PATCH http://localhost:3000/api/products/3/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": true}'

```
**Expected response:**
```
{
  "message": "product status updated",
  "sold_out": true
}
```

### Mark product as available
```
curl -X PATCH http://localhost:3000/api/products/3/status \
  -H "Content-Type: application/json" \
  -d '{"sold_out": false}'
```

**Expected response:**
```
{
  "message": "product status updated",
  "sold_out": false
}
```
### Update product with PUT (optional fields)
```
curl -X PUT http://localhost:3000/api/products/4 \
  -H "Content-Type: application/json" \
  -d '{
    "sold_out": true,
    "price": 2800000
  }'

```

**Expected response:**
```
{
  "message": "product updated",
  "product": {
    "product_name": "Gaming Laptop",
    "price": "2800000.00",
    "category": "Technology",
    "id_store": "123-456-7890",
    "product_description": "High-end gaming laptop with RTX 4060",
    "sold_out": true
  }
}
```
## 📊 Verify Changes

### List all products
```
curl -X GET http://localhost:3000/api/products
```
### Get specific product
```
curl -X GET http://localhost:3000/api/products/1
```
## 🔧 Important Notes

**PATCH /:id/status**: Changes only the sold_out field

**PUT /:id**: Updates any field, non-sent fields remain unchanged

**sold_out**: true = sold out, false = available

In the database: 1 = sold out, 0 = available

## 🚨 Common Errors

### Product not found
```
{
  "status": "error",
  "message": "Product not found"
}
```
### Missing sold_out field
```
{
  "status": "error",
  "message": "sold_out field is required"
}
```
