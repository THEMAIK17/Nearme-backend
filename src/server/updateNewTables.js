import { pool } from './connection_db.js';

async function updateDatabase() {
  try {
    console.log('🔄 Starting database update...');

    // 1. Update store_views table
    console.log('📊 Updating store_views table...');
    
    // Add session_id column
    try {
      await pool.query('ALTER TABLE store_views ADD COLUMN session_id VARCHAR(100) AFTER user_agent');
      console.log('✅ Added session_id column to store_views');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ session_id column already exists in store_views');
      } else {
        throw error;
      }
    }

    // Update contact_type to ENUM
    try {
      await pool.query(`ALTER TABLE store_views MODIFY COLUMN contact_type ENUM('visit', 'phone_call', 'whatsapp', 'email', 'social_media', 'in_person') DEFAULT 'visit'`);
      console.log('✅ Updated contact_type ENUM in store_views');
    } catch (error) {
      console.log('ℹ️ contact_type ENUM already updated:', error.message);
    }

    // Update contact_method to ENUM
    try {
      await pool.query(`ALTER TABLE store_views MODIFY COLUMN contact_method ENUM('web', 'mobile_app', 'api', 'admin_panel') DEFAULT 'web'`);
      console.log('✅ Updated contact_method ENUM in store_views');
    } catch (error) {
      console.log('ℹ️ contact_method ENUM already updated:', error.message);
    }

    // Add indexes
    try {
      await pool.query('ALTER TABLE store_views ADD INDEX idx_store_date (id_store, view_date)');
      console.log('✅ Added idx_store_date index to store_views');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ idx_store_date index already exists in store_views');
      } else {
        throw error;
      }
    }

    try {
      await pool.query('ALTER TABLE store_views ADD INDEX idx_session (session_id)');
      console.log('✅ Added idx_session index to store_views');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ idx_session index already exists in store_views');
      } else {
        throw error;
      }
    }

    // 2. Update recent_activities table
    console.log('📋 Updating recent_activities table...');
    
    // Add session_id column
    try {
      await pool.query('ALTER TABLE recent_activities ADD COLUMN session_id VARCHAR(100) AFTER metadata');
      console.log('✅ Added session_id column to recent_activities');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ session_id column already exists in recent_activities');
      } else {
        throw error;
      }
    }

    // Update activity_type ENUM
    try {
      await pool.query(`ALTER TABLE recent_activities MODIFY COLUMN activity_type ENUM('product_added', 'product_updated', 'product_deleted', 'store_contacted', 'excel_uploaded', 'login', 'logout', 'profile_updated', 'password_changed', 'store_info_updated')`);
      console.log('✅ Updated activity_type ENUM in recent_activities');
    } catch (error) {
      console.log('ℹ️ activity_type ENUM already updated:', error.message);
    }

    // Add indexes to recent_activities
    const recentActivitiesIndexes = [
      { name: 'idx_user_id', query: 'ALTER TABLE recent_activities ADD INDEX idx_user_id (user_id)' },
      { name: 'idx_activity_type', query: 'ALTER TABLE recent_activities ADD INDEX idx_activity_type (activity_type)' },
      { name: 'idx_created_at', query: 'ALTER TABLE recent_activities ADD INDEX idx_created_at (created_at)' },
      { name: 'idx_session', query: 'ALTER TABLE recent_activities ADD INDEX idx_session (session_id)' },
      { name: 'idx_user_activity', query: 'ALTER TABLE recent_activities ADD INDEX idx_user_activity (user_id, activity_type)' }
    ];

    for (const index of recentActivitiesIndexes) {
      try {
        await pool.query(index.query);
        console.log(`✅ Added ${index.name} index to recent_activities`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`ℹ️ ${index.name} index already exists in recent_activities`);
        } else {
          throw error;
        }
      }
    }

    // 3. Update store_statistics table
    console.log('📊 Updating store_statistics table...');
    
    const storeStatisticsColumns = [
      { name: 'unique_visitors', query: 'ALTER TABLE store_statistics ADD COLUMN unique_visitors INT DEFAULT 0 AFTER total_views' },
      { name: 'products_deleted', query: 'ALTER TABLE store_statistics ADD COLUMN products_deleted INT DEFAULT 0 AFTER products_updated' },
      { name: 'login_sessions', query: 'ALTER TABLE store_statistics ADD COLUMN login_sessions INT DEFAULT 0 AFTER excel_uploads' },
      { name: 'bounce_rate', query: 'ALTER TABLE store_statistics ADD COLUMN bounce_rate DECIMAL(5,2) DEFAULT 0.00 AFTER login_sessions' },
      { name: 'avg_session_duration', query: 'ALTER TABLE store_statistics ADD COLUMN avg_session_duration INT DEFAULT 0 AFTER bounce_rate' },
      { name: 'last_updated', query: 'ALTER TABLE store_statistics ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER avg_session_duration' }
    ];

    for (const column of storeStatisticsColumns) {
      try {
        await pool.query(column.query);
        console.log(`✅ Added ${column.name} column to store_statistics`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ ${column.name} column already exists in store_statistics`);
        } else {
          throw error;
        }
      }
    }

    // Add indexes to store_statistics
    const storeStatisticsIndexes = [
      { name: 'idx_store_id', query: 'ALTER TABLE store_statistics ADD INDEX idx_store_id (store_id)' },
      { name: 'idx_date', query: 'ALTER TABLE store_statistics ADD INDEX idx_date (date)' },
      { name: 'idx_store_date', query: 'ALTER TABLE store_statistics ADD INDEX idx_store_date (store_id, date)' }
    ];

    for (const index of storeStatisticsIndexes) {
      try {
        await pool.query(index.query);
        console.log(`✅ Added ${index.name} index to store_statistics`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`ℹ️ ${index.name} index already exists in store_statistics`);
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Database update completed successfully!');
    console.log('✅ All new tables and columns are ready to use');
    
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the update
updateDatabase().catch(console.error);
