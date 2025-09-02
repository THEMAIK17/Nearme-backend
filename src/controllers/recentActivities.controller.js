import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

// POST endpoint to log a new activity
// This endpoint records user activities like product operations, login/logout, etc.
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      activity_type,
      activity_description,
      metadata,
      session_id,
      ip_address,
      user_agent,
    } = req.body;

    // Validate required fields
    if (!user_id || !activity_type) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: user_id, activity_type",
      });
    }

    // Validate activity type
    const validActivityTypes = [
      "product_added",
      "product_updated",
      "product_deleted",
      "store_contacted",
      "excel_uploaded",
      "login",
      "logout",
      "profile_updated",
      "password_changed",
      "store_info_updated",
    ];
    if (!validActivityTypes.includes(activity_type)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid activity_type. Must be one of: " +
          validActivityTypes.join(", "),
      });
    }

    // Ensure the store exists
    const [storeExists] = await pool.query(
      "SELECT nit_store FROM stores WHERE nit_store = ?",
      [user_id]
    );
    if (storeExists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Store not found",
      });
    }

    // Insert the new activity record
    const query = `
            INSERT INTO recent_activities(user_id, activity_type, activity_description, metadata, session_id, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      user_id,
      activity_type,
      activity_description,
      metadata ? JSON.stringify(metadata) : null,
      session_id,
      ip_address || req.ip,
      user_agent || req.get("User-Agent"),
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "Activity logged successfully",
      id: result.insertId,
      activity_type,
      user_id,
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

// GET endpoint to retrieve recent activities for a specific store
router.get("/store/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { page = 1, limit = 20, activity_type, period = "all" } = req.query;

    const offset = (page - 1) * limit;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "AND DATE(created_at) = CURDATE()";
        break;
      case "week":
        dateFilter = "AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    let activityFilter = "";
    if (activity_type) {
      activityFilter = "AND activity_type = ?";
    }

    const query = `
            SELECT 
                id,
                activity_type,
                activity_description,
                metadata,
                session_id,
                ip_address,
                created_at
            FROM recent_activities 
            WHERE user_id = ? ${dateFilter} ${activityFilter}
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;

    const queryParams = [store_id];
    if (activity_type) {
      queryParams.push(activity_type);
    }
    queryParams.push(parseInt(limit), offset);

    const [activities] = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
            SELECT COUNT(*) as total
            FROM recent_activities 
            WHERE user_id = ? ${dateFilter} ${activityFilter}
        `;
    const countParams = [store_id];
    if (activity_type) {
      countParams.push(activity_type);
    }

    const [totalResult] = await pool.query(countQuery, countParams);

    res.json({
      store_id,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResult[0].total,
        total_pages: Math.ceil(totalResult[0].total / limit),
      },
      filters: {
        activity_type: activity_type || "all",
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

// GET endpoint to retrieve activity statistics for a store
router.get("/stats/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const { period = "all" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "AND DATE(created_at) = CURDATE()";
        break;
      case "week":
        dateFilter = "AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Activity statistics by type
    const [activityStats] = await pool.query(
      `
            SELECT 
                activity_type,
                COUNT(*) as count,
                MAX(created_at) as last_activity
            FROM recent_activities 
            WHERE user_id = ? ${dateFilter}
            GROUP BY activity_type
            ORDER BY count DESC
        `,
      [store_id]
    );

    // Total activities
    const [totalResult] = await pool.query(
      `
            SELECT COUNT(*) as total
            FROM recent_activities 
            WHERE user_id = ? ${dateFilter}
        `,
      [store_id]
    );

    // Recent activities (last 10)
    const [recentActivities] = await pool.query(
      `
            SELECT 
                activity_type,
                activity_description,
                created_at
            FROM recent_activities 
            WHERE user_id = ? ${dateFilter}
            ORDER BY created_at DESC 
            LIMIT 10
        `,
      [store_id]
    );

    res.json({
      store_id,
      period,
      total_activities: totalResult[0].total,
      activities_by_type: activityStats,
      recent_activities: recentActivities,
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

// GET endpoint to retrieve session-based activities
router.get("/session/:session_id", async (req, res) => {
  try {
    const { session_id } = req.params;

    const [activities] = await pool.query(
      `
            SELECT 
                id,
                user_id,
                activity_type,
                activity_description,
                metadata,
                ip_address,
                created_at
            FROM recent_activities 
            WHERE session_id = ?
            ORDER BY created_at ASC
        `,
      [session_id]
    );

    if (activities.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No activities found for this session",
      });
    }

    // Calculate session duration
    const sessionStart = activities[0].created_at;
    const sessionEnd = activities[activities.length - 1].created_at;
    const duration = Math.floor(
      (new Date(sessionEnd) - new Date(sessionStart)) / 1000
    );

    res.json({
      session_id,
      total_activities: activities.length,
      session_duration_seconds: duration,
      session_start: sessionStart,
      session_end: sessionEnd,
      activities,
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

// GET endpoint to retrieve global activity statistics
router.get("/global-stats", async (req, res) => {
  try {
    const { period = "all" } = req.query;

    let dateFilter = "";
    switch (period) {
      case "today":
        dateFilter = "WHERE DATE(created_at) = CURDATE()";
        break;
      case "week":
        dateFilter = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case "month":
        dateFilter = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateFilter = "";
    }

    // Global activity statistics
    const [globalStats] = await pool.query(`
            SELECT 
                activity_type,
                COUNT(*) as count
            FROM recent_activities 
            ${dateFilter}
            GROUP BY activity_type
            ORDER BY count DESC
        `);

    // Most active stores
    const [activeStores] = await pool.query(`
            SELECT 
                ra.user_id,
                s.store_name,
                COUNT(*) as activity_count
            FROM recent_activities ra
            JOIN stores s ON ra.user_id = s.nit_store
            ${dateFilter}
            GROUP BY ra.user_id, s.store_name
            ORDER BY activity_count DESC
            LIMIT 10
        `);

    // Total activities
    const [totalResult] = await pool.query(`
            SELECT COUNT(*) as total
            FROM recent_activities 
            ${dateFilter}
        `);

    res.json({
      period,
      total_activities: totalResult[0].total,
      activities_by_type: globalStats,
      most_active_stores: activeStores,
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

// DELETE endpoint to clean old activities (optional maintenance endpoint)
router.delete("/cleanup", async (req, res) => {
  try {
    const { days = 90 } = req.query; // Default: keep last 90 days

    const [result] = await pool.query(
      `
            DELETE FROM recent_activities 
            WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
        `,
      [parseInt(days)]
    );

    res.json({
      message: "Old activities cleaned up successfully",
      deleted_records: result.affectedRows,
      days_kept: parseInt(days),
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
