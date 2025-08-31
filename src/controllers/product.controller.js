import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

// GET endpoint to retrieve all products from the database. 
// It queries the "products" table, orders them by their unique identifier (id_product), 
// and returns the complete list as JSON. In case of an error, it responds with a 500 error 
// and details about the failure, including the endpoint and method used.
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

// GET endpoint to retrieve a single product by its unique ID (id_product).
// The product ID is provided as a parameter in the URL. 
// If found, it returns the product data; otherwise, it returns an error message.
// Errors are caught and handled with a standardized 500 response.
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

// POST endpoint to create a new product in the database. 
// It validates that all required fields (product_name, price, category, id_store, product_description) 
// are present before inserting the new product. 
// The sold_out field defaults to false if not provided. 
// Returns the ID of the newly created product on success or a validation error if fields are missing.
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
    if (
      !product_name ||
      !price ||
      !category ||
      !id_store ||
      !product_description
    ) {
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

// PUT endpoint to update an existing product by ID. 
// First, it retrieves the current product data. 
// If the product does not exist, it returns a 404 error. 
// If it exists, it merges the request body fields with the current values, 
// so that only provided fields are updated while keeping the others unchanged. 
// Finally, it executes the update query and returns the updated product details.
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      price,
      category,
      id_store,
      product_description,
      sold_out,
    } = req.body;

    // First get the current product
    const [currentProduct] = await pool.query(
      "SELECT * FROM products WHERE id_product = ?",
      [id]
    );

    if (currentProduct.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const product = currentProduct[0];

    // Use values from body or keep the current ones
    const updatedProduct = {
      product_name: product_name || product.product_name,
      price: price || product.price,
      category: category || product.category,
      id_store: id_store || product.id_store,
      product_description: product_description || product.product_description,
      sold_out: sold_out !== undefined ? sold_out : product.sold_out,
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
        product: updatedProduct,
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

// PATCH endpoint dedicated to updating only the "sold_out" status of a product. 
// This is a partial update (not full replacement like PUT). 
// It requires the "sold_out" field in the request body. 
// If the product is found, its availability status is updated, otherwise a 404 is returned.
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { sold_out } = req.body;

    if (sold_out === undefined) {
      return res.status(400).json({
        status: "error",
        message: "sold_out field is required",
      });
    }

    const query = `UPDATE products SET sold_out=? WHERE id_product=?`;
    const values = [sold_out ? 1 : 0, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({
        mensaje: "product status updated",
        sold_out: sold_out,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
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

// DELETE endpoint to remove a product from the database by its unique ID. 
// It executes a DELETE SQL query and, if successful, responds with a confirmation message. 
// If no product was deleted (not found), it simply does not return any confirmation. 
// Errors are caught and handled with a standard 500 response.
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