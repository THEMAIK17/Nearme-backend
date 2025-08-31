import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM stores `);
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

router.get("/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const [rows] = await pool.query(`SELECT *FROM stores WHERE nit_store=? `, [
      nit,
    ]);
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
// Store views endpoints
router.post("/:nit/views", async (req, res) => {
  try {
    const { nit } = req.params;

    // Insert a new view record
    const insertQuery = `INSERT INTO store_views(id_store) VALUES (?)`;
    await pool.query(insertQuery, [nit]);

    // Get total views for this store
    const countQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [result] = await pool.query(countQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: result[0].total_views,
      message: "View recorded successfully",
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

router.get("/:nit/views", async (req, res) => {
  try {
    const { nit } = req.params;

    // Get total views for this store
    const countQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [result] = await pool.query(countQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: result[0].total_views,
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

// Get products by store with view count
router.get("/:nit/products", async (req, res) => {
  try {
    const { nit } = req.params;

    // Get products for this store
    const productsQuery = `SELECT * FROM products WHERE id_store = ? ORDER BY id_product`;
    const [products] = await pool.query(productsQuery, [nit]);

    // Get store views
    const viewsQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [viewsResult] = await pool.query(viewsQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: viewsResult[0].total_views,
      products: products,
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

router.post("/", async (req, res) => {
  try {
    const {
      nit_store,
      store_name,
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note,
    } = req.body;
    const query = `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?)`;
    const values = [
      nit_store,
      store_name.trim(),
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note.trim(),
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      message: "store created",
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

router.put("/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const {
      nit_store: new_nit_store,
      store_name,
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note,
    } = req.body;
    const query = `UPDATE stores SET nit_store=?,store_name=?,address=?,phone_number=?,email=?,id_store_type=?,opening_hours=?,closing_hours=?,note=? WHERE nit_store=?`;
    const values = [
      new_nit_store,
      store_name.trim(),
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note.trim(),
      nit,
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ mensaje: "store updated" });
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

router.delete("/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const query = `DELETE FROM stores WHERE nit_store=?`;

    const values = [nit];
    const [result] = await pool.query(query, values);

    if (result.affectedRows !== 0) {
      return res.json({ message: "store deleted" });
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
