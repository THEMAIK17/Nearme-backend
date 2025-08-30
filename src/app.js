
import express from 'express';
import cors from 'cors';
import { pool } from './server/connection_db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'NearMe Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Product routes
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM products ORDER BY id_product`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`SELECT * FROM products WHERE id_product=? ORDER BY id_product`, [id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { product_name, price, stock, category, id_store, product_description } = req.body;
        const query = `INSERT INTO products(product_name,price,stock,category,id_store,product_description) VALUES (?,?,?,?,?,?)`;
        const values = [product_name.trim(), price, stock, category.trim(), id_store, product_description.trim()];
        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "product created",
            id_product: result.insertId,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, price, stock, category, id_store, product_description } = req.body;
        const query = `UPDATE products SET product_name=?, price=?, stock=?,category=?,id_store=?,product_description=? WHERE id_product=?`;
        const values = [product_name.trim(), price, stock, category.trim(), id_store, product_description.trim(), id];
        const [result] = await pool.query(query, values);

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "product updated" });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM products WHERE id_product=?`;
        const values = [id];
        const [result] = await pool.query(query, values);

        if (result.affectedRows !== 0) {
            return res.json({ message: 'product deleted' });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// Store routes
app.get('/api/stores', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM stores`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/api/stores/:nit', async (req, res) => {
    try {
        const { nit } = req.params;
        const [rows] = await pool.query(`SELECT * FROM stores WHERE nit_store=?`, [nit]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/api/stores', async (req, res) => {
    try {
        const { nit_store, store_name, address, phone_number, email, id_store_type, opening_hours, closing_hours, note } = req.body;
        const query = `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?)`;
        const values = [nit_store, store_name.trim(), address, phone_number, email, id_store_type, opening_hours, closing_hours, note.trim()];
        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "store created",
            id_product: result.insertId,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.put('/api/stores/:nit', async (req, res) => {
    try {
        const { nit } = req.params;
        const { nit_store: new_nit_store, store_name, address, phone_number, email, id_store_type, opening_hours, closing_hours, note } = req.body;
        const query = `UPDATE stores SET nit_store=?,store_name=?,address=?,phone_number=?,email=?,id_store_type=?,opening_hours=?,closing_hours=?,note=? WHERE nit_store=?`;
        const values = [new_nit_store, store_name.trim(), address, phone_number, email, id_store_type, opening_hours, closing_hours, note.trim(), nit];
        const [result] = await pool.query(query, values);

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "store updated" });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.delete('/api/stores/:nit', async (req, res) => {
    try {
        const { nit } = req.params;
        const query = `DELETE FROM stores WHERE nit_store=?`;
        const values = [nit];
        const [result] = await pool.query(query, values);

        if (result.affectedRows !== 0) {
            return res.json({ message: 'store deleted' });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        endpoint: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        endpoint: req.originalUrl,
        method: req.method
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 NearMe Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
    console.log(`🏪 Stores API: http://localhost:${PORT}/api/stores`);
});

export default app;