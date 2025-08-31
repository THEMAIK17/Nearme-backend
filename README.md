# NearMe Backend

Backend API for the NearMe application, a store and product management system.

## 🚀 Features

RESTful API for managing products and stores

MySQL database hosted on Clever Cloud

Unified server on port 3000

CORS enabled

Centralized error handling

Database management scripts

## 📁 Project Structure

src/
├── app.js                    # Main server
├── config/
│   └── database.js           # DB configuration
├── server/
│   ├── connection_db.js      # MySQL connection
│   ├── cleanDatabase.js      # Script to clean tables
│   └── dropDatabase.js       # Script to drop tables
└── controllers/
    ├── product.controller.js # Product routes
    └── store.controller.js   # Store routes

## 🛠️ Installation

1. Clone the repository

2. Install dependencies:

npm install


3. Configure environment variables (optional):

# Create a .env file with the following variables:

DB_HOST=your_host
DB_NAME=your_database
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
PORT=3000

## 🚀 Running the Project

### Development

npm run dev

### Production

npm start

## 🗄️ Database Management

### Initialize database with seed data

npm run init-db


This command creates basic store types and a sample store.

### Clean all tables (keep structure)

npm run clean-db


This command removes all data from tables but keeps the structure.

### Drop all tables completely

npm run drop-db

This command permanently deletes all tables from the database.

### Update store views table

npm run update-views-table


This command updates the store_views table with the new structure to handle queries.

⚠️ **WARNING**: Cleaning and dropping operations are irreversible. Make sure you have a backup before running them.

## 📡 Endpoints

###Health Check

GET /health - Server status

### Products

GET /api/products - List all products

GET /api/products/:id - Get product by ID

POST /api/products - Create a new product

PUT /api/products/:id - Update product (optional fields)

PATCH /api/products/:id/status - Change product status only

DELETE /api/products/:id - Delete product

### Stores

GET /api/stores - List all stores

GET /api/stores/:nit - Get store by NIT

POST /api/stores - Create a new store

PUT /api/stores/:nit - Update store

DELETE /api/stores/:nit - Delete store

### Store Views (Queries)

POST /api/store-views - Register store query/contact

GET /api/store-views/stats/:store_id - Get query stats per store

GET /api/store-views/store/:store_id - List store queries

GET /api/store-views/global-stats - Global query statistics

## 🗄️ Database

The project includes the SQL script to create the database in docs/script_nearme.sql.

Tables:

stores_type - Store types

stores - Store information

products - Store products

store_views - Record of store queries/contacts

## 🔧 Technologies

Node.js

Express.js 4.18.2

MySQL2

CORS

## 🧪 Testing

###Run all tests

npm run test

### Run quick tests (POST only)

npm run test-quick

###Clean database before testing

npm run clean-db

npm run init-db

## 📝 Notes

The server runs on port 3000 by default

Database credentials are configured for Clever Cloud

It is recommended to use environment variables for credentials in production

Database scripts respect foreign keys and dependency order

Products no longer have a stock field, now they use sold_out (BOOLEAN)