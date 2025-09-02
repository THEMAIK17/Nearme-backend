import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

// GET endpoint to provide API information
router.get("/", async (req, res) => {
  try {
    res.json({
      message: "Store Views API",
      version: "1.0.0",
      endpoints: {
        "POST /": "Register a new contact/interaction with a store",
        "GET /stats/:store_id": "Get statistics of store contacts by store ID",
        "GET /store/:store_id":
          "Get all contacts of a specific store with pagination",
        "GET /global-stats": "Get global statistics across all stores",
        "GET /unique-visitors/:store_id": "Get unique visitors for a store",
        "GET /session-analytics/:store_id": "Get session analytics for a store",
      },
      parameters: {
        period: "Time period filter (today, week, month, all)",
        page: "Page number for pagination (default: 1)",
        limit: "Number of records per page (default: 20)",
      },
      contact_types: [
        "visit",
        "phone_call",
        "whatsapp",
        "email",
        "social_media",
        "in_person",
      ],
      contact_methods: ["web", "mobile_app", "api", "admin_panel"],
      example_usage: {
        register_contact:
          "POST / with {id_store, contact_type, contact_method, session_id, ...}",
        get_stats: "GET /stats/100-NA-2000?period=week",
        get_contacts: "GET /store/100-NA-2000?page=1&limit=10",
        get_unique_visitors: "GET /unique-visitors/100-NA-2000?period=month",
        get_session_analytics: "GET /session-analytics/100-NA-2000?period=all",
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

// POST endpoint to register a new contact/interaction with a store.
// This endpoint receives data such as the store ID, type of contact (e.g., WhatsApp, phone, visit),
// method of contact, and optional metadata like user IP, browser info, or additional custom data.
// The request first validates required fields and ensures that the provided store exists.
// If everything is valid, the contact is saved into the "store_views" table and a success response is returned.
router.post("/", async (req, res) => {
  try {
    const {
      id_store,
      contact_type,
      contact_method,
      user_ip,
      user_agent,
      session_id,
      additional_data,
    } = req.body;

    // Validate required fields
    if (!id_store || !contact_type || !contact_method) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: id_store, contact_type, contact_method",
      });
    }

    // Validate contact type
    const validContactTypes = [
      "visit",
      "phone_call",
      "whatsapp",
      "email",
      "social_media",
      "in_person",
    ];
    if (!validContactTypes.includes(contact_type)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid contact_type. Must be one of: visit, phone_call, whatsapp, email, social_media, in_person",
      });
    }

    // Validate contact method
    const validContactMethods = ["web", "mobile_app", "api", "admin_panel"];
    if (!validContactMethods.includes(contact_method)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid contact_method. Must be one of: web, mobile_app, api, admin_panel",
      });
    }

    // Ensure the store exists before inserting the contact
    const [storeExists] = await pool.query(
      "SELECT nit_store FROM stores WHERE nit_store = ?",
      [id_store]
    );
    if (storeExists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Store not found",
      });
    }

    // Insert the new contact record into the database
    const query = `
            INSERT INTO store_views(id_store, contact_type, contact_method, user_ip, user_agent, session_id, additional_data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      id_store,
      contact_type,
      contact_method,
      user_ip || req.ip,
      user_agent || req.get("User-Agent"),
      session_id,
      additional_data ? JSON.stringify(additional_data) : null,
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "Contact registered successfully",
      id_view: result.insertId,
      contact_type,
      contact_method,
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

// GET endpoint to retrieve statistics of store contacts by store ID.
// This allows analyzing the number of contacts for a specific store, filtered by a time period (all, today, week, month).
// The response includes total contacts, breakdown by type, and the most recent 10 contacts with metadata.
router.get("/stats/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { period = "all" } = req.query; // Filter: all, today, week, month

    let dateFilter = "";
    let dateParams = [];

    // Apply date filters based on selected period
    switch (period) {
      case "today":
        dateFilter = "AND DATE(view_date) = CURDATE()";
        break;
      case "week":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Query for statistics grouped by contact type
    const [stats] = await pool.query(
      `
            SELECT 
                COUNT(*) as total_contacts,
                contact_type,
                COUNT(*) as count_by_type
            FROM store_views 
            WHERE id_store = ? ${dateFilter}
            GROUP BY contact_type
        `,
      [store_id]
    );

    // Query for total contacts
    const [totalResult] = await pool.query(
      `
            SELECT COUNT(*) as total
            FROM store_views 
            WHERE id_store = ? ${dateFilter}
        `,
      [store_id]
    );

    // Query for most recent 10 contacts
    const [recentContacts] = await pool.query(
      `
            SELECT 
                id_view,
                contact_type,
                contact_method,
                view_date,
                user_ip
            FROM store_views 
            WHERE id_store = ? ${dateFilter}
            ORDER BY view_date DESC 
            LIMIT 10
        `,
      [store_id]
    );

    res.json({
      store_id,
      period,
      total_contacts: totalResult[0].total,
      contacts_by_type: stats,
      recent_contacts: recentContacts,
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

// GET endpoint to retrieve all contacts of a specific store with pagination.
// This endpoint provides a paginated list of interactions (contacts) related to a store,
// allowing clients to fetch data page by page. The response includes the contacts and pagination metadata.
router.get("/store/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const [contacts] = await pool.query(
      `
            SELECT 
                id_view,
                contact_type,
                contact_method,
                user_ip,
                view_date,
                additional_data
            FROM store_views 
            WHERE id_store = ?
            ORDER BY view_date DESC 
            LIMIT ? OFFSET ?
        `,
      [store_id, parseInt(limit), offset]
    );

    // Query to get the total number of records for pagination
    const [totalResult] = await pool.query(
      `
            SELECT COUNT(*) as total
            FROM store_views 
            WHERE id_store = ?
        `,
      [store_id]
    );

    res.json({
      store_id,
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResult[0].total,
        total_pages: Math.ceil(totalResult[0].total / limit),
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

// GET endpoint to retrieve global statistics across all stores.
// This aggregates contacts regardless of store and can be filtered by period (all, today, week, month).
// The response includes stats by contact type, the top 10 most contacted stores, and total counts.
router.get("/global-stats", async (req, res) => {
  try {
    const { period = "all" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "WHERE DATE(view_date) = CURDATE()";
        break;
      case "week":
        dateFilter = "WHERE view_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "WHERE view_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Stats grouped by contact type across all stores
    const [contactTypeStats] = await pool.query(`
            SELECT 
                contact_type,
                COUNT(*) as count
            FROM store_views 
            ${dateFilter}
            GROUP BY contact_type
            ORDER BY count DESC
        `);

    // Top 10 most contacted stores
    const [topStores] = await pool.query(`
            SELECT 
                sv.id_store,
                s.store_name,
                COUNT(*) as contact_count
            FROM store_views sv
            JOIN stores s ON sv.id_store = s.nit_store
            ${dateFilter}
            GROUP BY sv.id_store, s.store_name
            ORDER BY contact_count DESC
            LIMIT 10
        `);

    // Query for overall total contacts
    const [totalResult] = await pool.query(`
            SELECT COUNT(*) as total
            FROM store_views 
            ${dateFilter}
        `);

    res.json({
      period,
      total_contacts: totalResult[0].total,
      contacts_by_type: contactTypeStats,
      top_stores: topStores,
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

// GET endpoint to retrieve unique visitors for a store
// This endpoint counts unique visitors based on session_id or user_ip
router.get("/unique-visitors/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { period = "all" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "AND DATE(view_date) = CURDATE()";
        break;
      case "week":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Count unique visitors by session_id
    const [uniqueBySession] = await pool.query(
      `
            SELECT COUNT(DISTINCT session_id) as unique_visitors_by_session
            FROM store_views 
            WHERE id_store = ? AND session_id IS NOT NULL ${dateFilter}
        `,
      [store_id]
    );

    // Count unique visitors by IP
    const [uniqueByIP] = await pool.query(
      `
            SELECT COUNT(DISTINCT user_ip) as unique_visitors_by_ip
            FROM store_views 
            WHERE id_store = ? AND user_ip IS NOT NULL ${dateFilter}
        `,
      [store_id]
    );

    res.json({
      store_id,
      period,
      unique_visitors_by_session: uniqueBySession[0].unique_visitors_by_session,
      unique_visitors_by_ip: uniqueByIP[0].unique_visitors_by_ip,
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

// GET endpoint to retrieve session analytics for a store
router.get("/session-analytics/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { period = "all" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "AND DATE(view_date) = CURDATE()";
        break;
      case "week":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND view_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Session duration analysis
    const [sessionStats] = await pool.query(
      `
            SELECT 
                session_id,
                COUNT(*) as page_views,
                MIN(view_date) as session_start,
                MAX(view_date) as session_end,
                TIMESTAMPDIFF(SECOND, MIN(view_date), MAX(view_date)) as session_duration_seconds
            FROM store_views 
            WHERE id_store = ? AND session_id IS NOT NULL ${dateFilter}
            GROUP BY session_id
            ORDER BY session_duration_seconds DESC
        `,
      [store_id]
    );

    // Calculate average session duration
    const avgDuration =
      sessionStats.length > 0
        ? sessionStats.reduce(
            (sum, session) => sum + session.session_duration_seconds,
            0
          ) / sessionStats.length
        : 0;

    res.json({
      store_id,
      period,
      total_sessions: sessionStats.length,
      average_session_duration_seconds: Math.round(avgDuration),
      session_details: sessionStats.slice(0, 10), // Top 10 longest sessions
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
