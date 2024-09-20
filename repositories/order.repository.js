const pool = require("../config/db");

// Create a new order
async function createOrder(orderData) {
  const connection = await pool.getConnection();
  const { location, items, totalPrice, customerId, paymentId } = orderData;

  const [result] = await connection.execute(
    "INSERT INTO `order` (location, items, totalPrice, customerId, paymentId) VALUES (?, ?, ?, ?, ?)",
    [location, JSON.stringify(items), totalPrice, customerId, paymentId]
  );

  connection.release();
  return result.insertId;
}

// Get plant price
async function getPlantsByIds(ids) {
  const connection = await pool.getConnection();

  const placeholders = ids.map(() => '?').join(', ');

  const [rows] = await connection.execute(
    `SELECT id, price FROM plant WHERE id IN (${placeholders})`,
    ids
  );

  connection.release();
  return rows;
}

// Find all orders
async function findAllOrders() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM `order`");
  connection.release();
  return rows;
}

// Find order by ID
async function findOrderById(id) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM `order` WHERE id = ?", [
    id,
  ]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Calculate total profits
async function calculateTotalProfits() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT SUM(totalPrice) AS totalProfit FROM `order`"
  );
  connection.release();
  return rows.length > 0 ? rows[0].totalProfit : 0;
}

module.exports = {
  createOrder,
  getPlantsByIds,
  findAllOrders,
  findOrderById,
  calculateTotalProfits,
};
