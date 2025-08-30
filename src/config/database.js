export const dbConfig = {
    host: process.env.DB_HOST || "bfescknstcwiuqriti2d-mysql.services.clever-cloud.com",
    database: process.env.DB_NAME || "bfescknstcwiuqriti2d",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "uorhyotgguoabnnt",
    password: process.env.DB_PASSWORD || "QPLAg4idNskvoBOdS5Mi",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
};