// Database configuration object with environment variables and default fallback values
export const dbConfig = {
    host: process.env.DB_HOST || "bfescknstcwiuqriti2d-mysql.services.clever-cloud.com",
    database: process.env.DB_NAME || "bfescknstcwiuqriti2d",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "uorhyotgguoabnnt",
    password: process.env.DB_PASSWORD || "QPLAg4idNskvoBOdS5Mi",
    connectionLimit: 10,        // Maximum number of connections in the pool
    waitForConnections: true,   // Queue connection requests when no connections are available
    queueLimit: 0               // Unlimited queued requests
};