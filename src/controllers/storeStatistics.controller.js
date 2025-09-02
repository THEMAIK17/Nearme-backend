import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

// GET endpoint to provide API information
router.get("/", async (req, res) => {
  try {
    res.json({
      message: "Store Statistics API",
      version: "1.0.0",
      endpoints: {
        "POST /": "Create or update daily statistics for a store",
        "GET /store/:store_id":
          "Get statistics for a specific store (with pagination)",
        "GET /store/:store_id/summary":
          "Get aggregated statistics summary for a store",
        "GET /global": "Get global statistics across all stores",
        "PUT /store/:store_id/date/:date":
          "Update specific statistics for a store and date",
        "DELETE /store/:store_id/date/:date":
          "Delete statistics for a specific store and date",
      },
      parameters: {
        period: "Time period filter (today, week, month, year, all)",
        page: "Page number for pagination (default: 1)",
        limit: "Number of records per page (default: 30)",
        start_date: "Start date for custom range (YYYY-MM-DD)",
        end_date: "End date for custom range (YYYY-MM-DD)",
      },
      example_usage: {
        create_stats:
          "POST / with {store_id, date, total_views, unique_visitors, ...}",
        get_store_stats: "GET /store/100-NA-2000?period=month&page=1&limit=10",
        get_summary: "GET /store/100-NA-2000/summary?period=week",
        get_global: "GET /global?period=month",
      },
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

// POST endpoint to create or update daily statistics for a store
router.post("/", async (req, res) => {
  try {
    const {
      store_id,
      date,
      total_views,
      unique_visitors,
      total_contacts,
      products_added,
      products_updated,
      products_deleted,
      excel_uploads,
      login_sessions,
      bounce_rate,
      avg_session_duration,
    } = req.body;

    // Validate required fields
    if (!store_id || !date) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: store_id, date",
      });
    }

    // Ensure the store exists
    const [storeExists] = await pool.query(
      "SELECT nit_store FROM stores WHERE nit_store = ?",
      [store_id]
    );
    if (storeExists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Store not found",
      });
    }

    // Check if statistics already exist for this date
    const [existingStats] = await pool.query(
      `
            SELECT id FROM store_statistics 
            WHERE store_id = ? AND date = ?
        `,
      [store_id, date]
    );

    if (existingStats.length > 0) {
      // Update existing statistics
      const updateQuery = `
                UPDATE store_statistics SET
                    total_views = COALESCE(?, total_views),
                    unique_visitors = COALESCE(?, unique_visitors),
                    total_contacts = COALESCE(?, total_contacts),
                    products_added = COALESCE(?, products_added),
                    products_updated = COALESCE(?, products_updated),
                    products_deleted = COALESCE(?, products_deleted),
                    excel_uploads = COALESCE(?, excel_uploads),
                    login_sessions = COALESCE(?, login_sessions),
                    bounce_rate = COALESCE(?, bounce_rate),
                    avg_session_duration = COALESCE(?, avg_session_duration),
                    last_updated = CURRENT_TIMESTAMP
                WHERE store_id = ? AND date = ?
            `;

      const updateValues = [
        total_views,
        unique_visitors,
        total_contacts,
        products_added,
        products_updated,
        products_deleted,
        excel_uploads,
        login_sessions,
        bounce_rate,
        avg_session_duration,
        store_id,
        date,
      ];

      await pool.query(updateQuery, updateValues);

      res.json({
        message: "Statistics updated successfully",
        store_id,
        date,
        action: "updated",
      });
    } else {
      // Insert new statistics
      const insertQuery = `
                INSERT INTO store_statistics(
                    store_id, date, total_views, unique_visitors, total_contacts,
                    products_added, products_updated, products_deleted, excel_uploads,
                    login_sessions, bounce_rate, avg_session_duration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

      const insertValues = [
        store_id,
        date,
        total_views || 0,
        unique_visitors || 0,
        total_contacts || 0,
        products_added || 0,
        products_updated || 0,
        products_deleted || 0,
        excel_uploads || 0,
        login_sessions || 0,
        bounce_rate || 0.0,
        avg_session_duration || 0,
      ];

      const [result] = await pool.query(insertQuery, insertValues);

      res.status(201).json({
        message: "Statistics created successfully",
        id: result.insertId,
        store_id,
        date,
        action: "created",
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

// GET endpoint to retrieve statistics for a specific store
router.get("/store/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const {
      start_date,
      end_date,
      period = "all",
      page = 1,
      limit = 30,
    } = req.query;

    const offset = (page - 1) * limit;

    let dateFilter = "";
    let queryParams = [store_id];

    if (start_date && end_date) {
      dateFilter = "AND date BETWEEN ? AND ?";
      queryParams.push(start_date, end_date);
    } else {
      switch (period) {
        case "today":
          dateFilter = "AND date = CURDATE()";
          break;
        case "week":
          dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
          break;
        case "month":
          dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
          break;
        case "year":
          dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)";
          break;
        default:
          dateFilter = "";
      }
    }

    const query = `
            SELECT 
                id, date, total_views, unique_visitors, total_contacts,
                products_added, products_updated, products_deleted, excel_uploads,
                login_sessions, bounce_rate, avg_session_duration, last_updated
            FROM store_statistics 
            WHERE store_id = ? ${dateFilter}
            ORDER BY date DESC 
            LIMIT ? OFFSET ?
        `;

    queryParams.push(parseInt(limit), offset);
    const [statistics] = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
            SELECT COUNT(*) as total
            FROM store_statistics 
            WHERE store_id = ? ${dateFilter}
        `;
    const countParams = queryParams.slice(0, -2); // Remove limit and offset
    const [totalResult] = await pool.query(countQuery, countParams);

    res.json({
      store_id,
      statistics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResult[0].total,
        total_pages: Math.ceil(totalResult[0].total / limit),
      },
      filters: {
        start_date: start_date || null,
        end_date: end_date || null,
        period,
      },
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

// GET endpoint to retrieve aggregated statistics for a store
router.get("/store/:store_id/summary", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { period = "month" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "AND date = CURDATE()";
        break;
      case "week":
        dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
      case "year":
        dateFilter = "AND date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Get aggregated statistics
    const [summary] = await pool.query(
      `
            SELECT 
                SUM(total_views) as total_views,
                SUM(unique_visitors) as total_unique_visitors,
                SUM(total_contacts) as total_contacts,
                SUM(products_added) as total_products_added,
                SUM(products_updated) as total_products_updated,
                SUM(products_deleted) as total_products_deleted,
                SUM(excel_uploads) as total_excel_uploads,
                SUM(login_sessions) as total_login_sessions,
                AVG(bounce_rate) as avg_bounce_rate,
                AVG(avg_session_duration) as avg_session_duration,
                COUNT(*) as days_with_data
            FROM store_statistics 
            WHERE store_id = ? ${dateFilter}
        `,
      [store_id]
    );

    // Get daily breakdown for charts
    const [dailyBreakdown] = await pool.query(
      `
            SELECT 
                date,
                total_views,
                unique_visitors,
                total_contacts,
                bounce_rate,
                avg_session_duration
            FROM store_statistics 
            WHERE store_id = ? ${dateFilter}
            ORDER BY date ASC
        `,
      [store_id]
    );

    res.json({
      store_id,
      period,
      summary: summary[0],
      daily_breakdown: dailyBreakdown,
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

// GET endpoint to retrieve global statistics across all stores
router.get("/global", async (req, res) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "WHERE date = CURDATE()";
        break;
      case "week":
        dateFilter = "WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
      case "year":
        dateFilter = "WHERE date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Global aggregated statistics
    const [globalStats] = await pool.query(`
            SELECT 
                SUM(total_views) as total_views,
                SUM(unique_visitors) as total_unique_visitors,
                SUM(total_contacts) as total_contacts,
                SUM(products_added) as total_products_added,
                SUM(products_updated) as total_products_updated,
                SUM(products_deleted) as total_products_deleted,
                SUM(excel_uploads) as total_excel_uploads,
                SUM(login_sessions) as total_login_sessions,
                AVG(bounce_rate) as avg_bounce_rate,
                AVG(avg_session_duration) as avg_session_duration,
                COUNT(DISTINCT store_id) as active_stores
            FROM store_statistics 
            ${dateFilter}
        `);

    // Top performing stores
    const [topStores] = await pool.query(`
            SELECT 
                ss.store_id,
                s.store_name,
                SUM(ss.total_views) as total_views,
                SUM(ss.unique_visitors) as unique_visitors,
                SUM(ss.total_contacts) as total_contacts,
                AVG(ss.bounce_rate) as avg_bounce_rate
            FROM store_statistics ss
            JOIN stores s ON ss.store_id = s.nit_store
            ${dateFilter}
            GROUP BY ss.store_id, s.store_name
            ORDER BY total_views DESC
            LIMIT 10
        `);

    res.json({
      period,
      global_statistics: globalStats[0],
      top_performing_stores: topStores,
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

// PUT endpoint to update specific statistics for a store and date
router.put("/store/:store_id/date/:date", async (req, res) => {
  try {
    const { store_id, date } = req.params;
    const {
      total_views,
      unique_visitors,
      total_contacts,
      products_added,
      products_updated,
      products_deleted,
      excel_uploads,
      login_sessions,
      bounce_rate,
      avg_session_duration,
    } = req.body;

    // Check if statistics exist
    const [existingStats] = await pool.query(
      `
            SELECT id FROM store_statistics 
            WHERE store_id = ? AND date = ?
        `,
      [store_id, date]
    );

    if (existingStats.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Statistics not found for this store and date",
      });
    }

    // Update statistics
    const updateQuery = `
            UPDATE store_statistics SET
                total_views = COALESCE(?, total_views),
                unique_visitors = COALESCE(?, unique_visitors),
                total_contacts = COALESCE(?, total_contacts),
                products_added = COALESCE(?, products_added),
                products_updated = COALESCE(?, products_updated),
                products_deleted = COALESCE(?, products_deleted),
                excel_uploads = COALESCE(?, excel_uploads),
                login_sessions = COALESCE(?, login_sessions),
                bounce_rate = COALESCE(?, bounce_rate),
                avg_session_duration = COALESCE(?, avg_session_duration),
                last_updated = CURRENT_TIMESTAMP
            WHERE store_id = ? AND date = ?
        `;

    const values = [
      total_views,
      unique_visitors,
      total_contacts,
      products_added,
      products_updated,
      products_deleted,
      excel_uploads,
      login_sessions,
      bounce_rate,
      avg_session_duration,
      store_id,
      date,
    ];

    await pool.query(updateQuery, values);

    res.json({
      message: "Statistics updated successfully",
      store_id,
      date,
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

// DELETE endpoint to remove statistics for a specific store and date
router.delete("/store/:store_id/date/:date", async (req, res) => {
  try {
    const { store_id, date } = req.params;

    const [result] = await pool.query(
      `
            DELETE FROM store_statistics 
            WHERE store_id = ? AND date = ?
        `,
      [store_id, date]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Statistics not found for this store and date",
      });
    }

    res.json({
      message: "Statistics deleted successfully",
      store_id,
      date,
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

export default router;
