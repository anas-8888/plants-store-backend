const mysql = require("mysql2/promise");

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "1q2w3e!@#",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = new mysql.createPool(dbConfig);
// pool.end();
module.exports = pool;
