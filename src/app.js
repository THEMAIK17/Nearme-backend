import express from "express";
import cors from "cors";
// import { pool } from "./server/connection_db.js";
import productRoutes from "./controllers/product.controller.js";
import storeRoutes from "./controllers/store.controller.js";
import storeViewsRoutes from "./controllers/storeViews.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NearMe Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/store-views", storeViewsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    endpoint: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    endpoint: req.originalUrl,
    method: req.method,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NearMe Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
  console.log(`🏪 Stores API: http://localhost:${PORT}/api/stores`);
  console.log(`📈 Store Views API: http://localhost:${PORT}/api/store-views`);
});

export default app;
