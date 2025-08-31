import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

// GET endpoint to fetch all stores from the database.
// This query retrieves all rows from the "stores" table and returns them in JSON format. 
// If any error occurs during the query, the server responds with a 500 status error 
// and includes diagnostic information such as the endpoint and HTTP method used.
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

// GET endpoint to fetch a single store by its unique identifier (nit_store).
// The store's "nit" is provided as a URL parameter. 
// If the store exists, its data is returned. Otherwise, it may return an empty object. 
// Any errors encountered during query execution are caught and returned with a 500 status.
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

// POST endpoint to record a new "view" for a store. 
// Each time this endpoint is called, a record is inserted into the "store_views" table. 
// Then, it queries the database to count the total number of views for that store. 
// The response includes the store identifier, updated total views, and a success message.
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

// GET endpoint to retrieve the total number of views for a store. 
// The "nit" parameter identifies the store, and the system counts how many times 
// it has been viewed in the "store_views" table. The response includes the store ID 
// and the total view count.
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

// GET endpoint to retrieve all products belonging to a specific store, 
// along with the total number of views for that store. 
// It first queries the "products" table to get all products by store, 
// then separately queries "store_views" to count total views. 
// The response includes both the product list and the total view count for that store.
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

// POST endpoint to create a new store record. 
// It extracts store details (nit, name, address, phone, email, store type, hours, notes) from the request body, 
// and inserts them into the "stores" table. If successful, it returns a confirmation message 
// along with the ID of the newly created store. If there is any issue, it responds with an error message.
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

// PUT endpoint to update the details of an existing store. 
// The store is identified by its "nit" parameter, while the new values are taken from the request body. 
// This operation replaces all relevant fields, including nit, store name, address, and hours. 
// If the store exists and the update is successful, a success message is returned. 
// Otherwise, the response indicates no update occurred.
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

// DELETE endpoint to remove a store from the database by its unique identifier (nit_store). 
// If the store exists and is successfully deleted, a confirmation message is returned. 
// If no record is deleted, the response does not send confirmation. 
// All unexpected issues are handled with a standardized 500 error response.
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