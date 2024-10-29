const pool = require("../config/db");

async function createNewOrder({ customer_id, location_id, total_price, items }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const cartQuery = `
      INSERT INTO cart (customer_id, location_id, total_price, payment_id)
      VALUES (?, ?, ?, NULL)
    `;
    const [cartResult] = await connection.execute(cartQuery, [customer_id, location_id, total_price]);

    const cartId = cartResult.insertId;

    // Insert each item into the cart_items table
    const cartItemsQuery = `
      INSERT INTO cart_items (cartId, plantId, quantity, details)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of items) {
      const { plantId, quantity, details } = item;
      await connection.execute(cartItemsQuery, [cartId, plantId, quantity, details || 'no details']);
    }

    await connection.commit();
    return cartId;

  } catch (error) {
    await connection.rollback();
    console.error("Failed to create order:", error.message);
    throw error; // Rethrow to handle in controller
  } finally {
    connection.release();
  }
}

async function getAllOrders(customerId) {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT created_at, location_id, total_price FROM cart WHERE customer_id = ?";
    const [rows] = await connection.execute(query, [customerId]);
    return rows;
  } finally {
    connection.release();
  }
}

async function getOrderById(id) {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT created_at, location_id, total_price FROM cart WHERE id = ?";
    const [rows] = await connection.execute(query, [id]);
    return rows.length ? rows[0] : null;
  } finally {
    connection.release();
  }
}

async function findAllLastOrders() {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT * FROM cart";
    const [rows] = await connection.execute(query);
    return rows.length ? rows : null;
  } finally {
    connection.release();
  }
}

async function getItemByOrderId(orderId) {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT * FROM cart_items WHERE cartId = ?";
    const [rows] = await connection.execute(query, [orderId]);
    return rows.length ? rows : null;
  } finally {
    connection.release();
  }
}

async function createPayment({ provider, status, amount, currency, paymentMethod, transactionId }) {
  // TODO
}

module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
  findAllLastOrders,
  getItemByOrderId,
  createPayment,
};
