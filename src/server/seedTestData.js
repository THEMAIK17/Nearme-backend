import { pool } from "./connection_db.js";

async function seedTestData() {
  try {
    console.log("🌱 Starting to seed test data...");

    // 1. Seed store_views data
    console.log("📊 Seeding store_views data...");
    const storeViewsData = [
      {
        id_store: "100-NA-2000",
        contact_type: "visit",
        contact_method: "web",
        session_id: "session_001",
        user_ip: "192.168.1.100",
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        additional_data: JSON.stringify({
          source: "google",
          campaign: "summer_sale",
        }),
      },
      {
        id_store: "100-NA-2000",
        contact_type: "whatsapp",
        contact_method: "mobile_app",
        session_id: "session_002",
        user_ip: "192.168.1.101",
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        additional_data: JSON.stringify({
          phone: "+573001234567",
          message: "Interested in products",
        }),
      },
      {
        id_store: "100-NA-2000",
        contact_type: "phone_call",
        contact_method: "web",
        session_id: "session_003",
        user_ip: "192.168.1.102",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        additional_data: JSON.stringify({ duration: 180, outcome: "sale" }),
      },
      {
        id_store: "100-NA-2000",
        contact_type: "email",
        contact_method: "web",
        session_id: "session_004",
        user_ip: "192.168.1.103",
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        additional_data: JSON.stringify({
          subject: "Product inquiry",
          email: "customer@example.com",
        }),
      },
      {
        id_store: "100-NA-2000",
        contact_type: "visit",
        contact_method: "web",
        session_id: "session_005",
        user_ip: "192.168.1.104",
        user_agent: "Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0",
        additional_data: JSON.stringify({
          source: "facebook",
          page: "product_list",
        }),
      },
    ];

    for (const view of storeViewsData) {
      await pool.query(
        `
        INSERT INTO store_views (id_store, contact_type, contact_method, session_id, user_ip, user_agent, additional_data, view_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY))
      `,
        [
          view.id_store,
          view.contact_type,
          view.contact_method,
          view.session_id,
          view.user_ip,
          view.user_agent,
          view.additional_data,
        ]
      );
    }

    // 2. Seed recent_activities data
    console.log("📋 Seeding recent_activities data...");
    const activitiesData = [
      {
        user_id: "100-NA-2000",
        activity_type: "product_added",
        activity_description: "Added new product: iPhone 15 Pro Max",
        session_id: "session_001",
        metadata: JSON.stringify({
          product_name: "iPhone 15 Pro Max",
          price: 1299,
          category: "Electronics",
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "product_updated",
        activity_description: "Updated product: Samsung Galaxy S24",
        session_id: "session_002",
        metadata: JSON.stringify({
          product_name: "Samsung Galaxy S24",
          old_price: 899,
          new_price: 799,
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "excel_uploaded",
        activity_description: "Uploaded product catalog via Excel",
        session_id: "session_003",
        metadata: JSON.stringify({
          file_name: "product_catalog_2024.xlsx",
          rows_imported: 150,
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "login",
        activity_description: "User logged into admin panel",
        session_id: "session_004",
        metadata: JSON.stringify({
          login_method: "email",
          ip_address: "192.168.1.100",
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "store_contacted",
        activity_description: "Customer contacted via WhatsApp",
        session_id: "session_005",
        metadata: JSON.stringify({
          contact_method: "whatsapp",
          customer_phone: "+573001234567",
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "product_deleted",
        activity_description: "Removed discontinued product: Old Model Phone",
        session_id: "session_001",
        metadata: JSON.stringify({
          product_name: "Old Model Phone",
          reason: "discontinued",
        }),
      },
      {
        user_id: "100-NA-2000",
        activity_type: "profile_updated",
        activity_description: "Updated store profile information",
        session_id: "session_002",
        metadata: JSON.stringify({
          fields_updated: ["address", "phone_number"],
          updated_by: "admin",
        }),
      },
    ];

    for (const activity of activitiesData) {
      await pool.query(
        `
        INSERT INTO recent_activities (user_id, activity_type, activity_description, session_id, metadata, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY))
      `,
        [
          activity.user_id,
          activity.activity_type,
          activity.activity_description,
          activity.session_id,
          activity.metadata,
          "192.168.1.100",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          new Date(),
        ]
      );
    }

    // 3. Seed store_statistics data
    console.log("📊 Seeding store_statistics data...");
    const statisticsData = [
      {
        store_id: "100-NA-2000",
        date: "2024-08-25",
        total_views: 45,
        unique_visitors: 32,
        total_contacts: 12,
        products_added: 3,
        products_updated: 5,
        products_deleted: 1,
        excel_uploads: 1,
        login_sessions: 8,
        bounce_rate: 25.5,
        avg_session_duration: 180,
      },
      {
        store_id: "100-NA-2000",
        date: "2024-08-26",
        total_views: 52,
        unique_visitors: 38,
        total_contacts: 15,
        products_added: 2,
        products_updated: 3,
        products_deleted: 0,
        excel_uploads: 0,
        login_sessions: 12,
        bounce_rate: 22.8,
        avg_session_duration: 195,
      },
      {
        store_id: "100-NA-2000",
        date: "2024-08-27",
        total_views: 38,
        unique_visitors: 28,
        total_contacts: 9,
        products_added: 1,
        products_updated: 4,
        products_deleted: 2,
        excel_uploads: 1,
        login_sessions: 6,
        bounce_rate: 28.2,
        avg_session_duration: 165,
      },
      {
        store_id: "100-NA-2000",
        date: "2024-08-24",
        total_views: 41,
        unique_visitors: 30,
        total_contacts: 11,
        products_added: 4,
        products_updated: 2,
        products_deleted: 1,
        excel_uploads: 0,
        login_sessions: 9,
        bounce_rate: 24.1,
        avg_session_duration: 172,
      },
      {
        store_id: "100-NA-2000",
        date: "2024-08-23",
        total_views: 35,
        unique_visitors: 25,
        total_contacts: 8,
        products_added: 2,
        products_updated: 6,
        products_deleted: 0,
        excel_uploads: 1,
        login_sessions: 7,
        bounce_rate: 26.8,
        avg_session_duration: 158,
      },
    ];

    for (const stat of statisticsData) {
      try {
        await pool.query(
          `
          INSERT INTO store_statistics (store_id, date, total_views, unique_visitors, total_contacts, products_added, products_updated, products_deleted, excel_uploads, login_sessions, bounce_rate, avg_session_duration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            stat.store_id,
            stat.date,
            stat.total_views,
            stat.unique_visitors,
            stat.total_contacts,
            stat.products_added,
            stat.products_updated,
            stat.products_deleted,
            stat.excel_uploads,
            stat.login_sessions,
            stat.bounce_rate,
            stat.avg_session_duration,
          ]
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(
            `ℹ️ Statistics for ${stat.date} already exist, skipping...`
          );
        } else {
          throw error;
        }
      }
    }

    // 4. Add some data for other stores (if they exist)
    console.log("🏪 Adding data for other stores...");

    // Check if other stores exist
    const [otherStores] = await pool.query(
      "SELECT nit_store FROM stores WHERE nit_store != ? LIMIT 2",
      ["100-NA-2000"]
    );

    if (otherStores.length > 0) {
      for (const store of otherStores) {
        // Add some store views
        await pool.query(
          `
          INSERT INTO store_views (id_store, contact_type, contact_method, session_id, user_ip, user_agent, view_date)
          VALUES (?, 'visit', 'web', ?, '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 5) DAY))
        `,
          [store.nit_store, `session_other_${store.nit_store}`]
        );

        // Add some activities
        await pool.query(
          `
          INSERT INTO recent_activities (user_id, activity_type, activity_description, session_id, ip_address, user_agent, created_at)
          VALUES (?, 'product_added', 'Added new product', ?, '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 5) DAY))
        `,
          [store.nit_store, `session_other_${store.nit_store}`]
        );

        // Add some statistics
        await pool.query(
          `
          INSERT INTO store_statistics (store_id, date, total_views, unique_visitors, total_contacts, products_added, products_updated, products_deleted, excel_uploads, login_sessions, bounce_rate, avg_session_duration)
          VALUES (?, DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 3) DAY), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            store.nit_store,
            Math.floor(Math.random() * 30) + 10,
            Math.floor(Math.random() * 20) + 5,
            Math.floor(Math.random() * 10) + 2,
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 5),
            Math.random() * 30 + 15,
            Math.floor(Math.random() * 120) + 60,
          ]
        );
      }
    }

    console.log("✅ Test data seeded successfully!");
    console.log("📊 Added:");
    console.log("   - 5 store views with different contact types");
    console.log("   - 7 recent activities with various types");
    console.log("   - 5 daily statistics records");
    console.log("   - Additional data for other stores (if any)");
  } catch (error) {
    console.error("❌ Error seeding test data:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedTestData().catch(console.error);
