import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM products  ORDER BY id_product`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM products WHERE id_product = ? ORDER BY id_product `,
      [id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      product_name,
      price,
      category,
      id_store,
      product_description,
      sold_out = false,
    } = req.body;

    // Validate required fields
    if (!product_name || !price || !category || !id_store || !product_description) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: product_name, price, category, id_store, product_description",
      });
    }

    const query = `INSERT INTO products(product_name,price,category,id_store,product_description,sold_out) VALUES (?,?,?,?,?,?)`;
    const values = [
      product_name.toString().trim(),
      price,
      category.toString().trim(),
      id_store,
      product_description.toString().trim(),
      sold_out ? 1 : 0,
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      message: "product created",
      id_product: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, price, category, id_store, product_description, sold_out } = req.body;

    // Primero obtener el producto actual
    const [currentProduct] = await pool.query('SELECT * FROM products WHERE id_product = ?', [id]);
    
    if (currentProduct.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Product not found"
      });
    }

    const product = currentProduct[0];

    // Usar valores del body o mantener los actuales
    const updatedProduct = {
      product_name: product_name || product.product_name,
      price: price || product.price,
      category: category || product.category,
      id_store: id_store || product.id_store,
      product_description: product_description || product.product_description,
      sold_out: sold_out !== undefined ? sold_out : product.sold_out
    };

    const query = `UPDATE products SET product_name=?, price=?, category=?, id_store=?, product_description=?, sold_out=? WHERE id_product=?`;
    const values = [
      updatedProduct.product_name.toString().trim(),
      updatedProduct.price,
      updatedProduct.category.toString().trim(),
      updatedProduct.id_store,
      updatedProduct.product_description.toString().trim(),
      updatedProduct.sold_out ? 1 : 0,
      id,
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ 
        mensaje: "product updated",
        product: updatedProduct
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Endpoint específico para cambiar solo el estado sold_out
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { sold_out } = req.body;

    if (sold_out === undefined) {
      return res.status(400).json({
        status: "error",
        message: "sold_out field is required"
      });
    }

    const query = `UPDATE products SET sold_out=? WHERE id_product=?`;
    const values = [sold_out ? 1 : 0, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ 
        mensaje: "product status updated",
        sold_out: sold_out
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Product not found"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM products WHERE id_product=?`;

    const values = [id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows !== 0) {
      return res.json({ message: "product deleted" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

export default router;
