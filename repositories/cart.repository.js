const pool = require("../config/db");

// Create a new cart
async function createCart(cartData) {
  const connection = await pool.getConnection();
  const { location, items, totalPrice, customerId, paymentId } = cartData;

  const [result] = await connection.execute(
    "INSERT INTO `cart` (location, items, totalPrice, customerId, paymentId) VALUES (?, ?, ?, ?, ?)",
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

// Find all carts
async function findAllCarts() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM `cart`");
  connection.release();
  return rows;
}

// Find cart by ID
async function findCartById(id) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM `cart` WHERE id = ?", [
    id,
  ]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Calculate total profits
async function calculateTotalProfits() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT SUM(totalPrice) AS totalProfit FROM `cart`"
  );
  connection.release();
  return rows.length > 0 ? rows[0].totalProfit : 0;
}

module.exports = {
  createCart,
  getPlantsByIds,
  findAllCarts,
  findCartById,
  calculateTotalProfits,
};
