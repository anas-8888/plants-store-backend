const pool = require("../config/db");

async function createNewOrder({ customer_id, location_id, total_price, items }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (items.length === 0) {
      return res.status(400).json({ error: "At least one item is required to create an order" });
    }

    const cartQuery = `
      INSERT INTO cart (customer_id, location_id, total_price, payment_id)
      VALUES (?, ?, ?, NULL)
    `;
    const [cartResult] = await connection.execute(cartQuery, [customer_id, location_id, total_price]);

    const cartId = cartResult.insertId;

    const cartItemsQuery = `
      INSERT INTO cart_items (cartId, plantId, quantity, size, details)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      const { plantId, quantity, size, details } = item;
      await connection.execute(cartItemsQuery, [cartId, plantId, quantity, size, details || 'no details']);
    }

    await connection.commit();
    return cartId;

  } catch (error) {
    await connection.rollback();
    console.error("Failed to create order:", error.message);
    throw new Error(`Database Error: Failed to create order - ${error.message}`);
  }
  finally {
    connection.release();
  }
}

async function getAllOrdersWithItems(customerId, language) {
  const connection = await pool.getConnection();
  try {
    const ordersQuery = `
      SELECT c.id AS cartId, c.created_at, c.location_id, c.total_price
      FROM cart c
      WHERE c.customer_id = ?
    `;
    const [orders] = await connection.execute(ordersQuery, [customerId]);

    if (!orders.length) return [];

    const orderIds = orders.map(order => order.cartId);

    // Determine which column to select based on the language
    const plantNameColumn = language === "ar" ? "p.plant_name_AR" : "p.plant_name_EN";

    const itemsQuery = `
      SELECT ci.cartId, ci.plantId, ci.quantity, ci.size, ci.details, 
             ${plantNameColumn} AS plantName
      FROM cart_items ci
      JOIN plant p ON ci.plantId = p.id
      WHERE ci.cartId IN (${orderIds.map(() => "?").join(",")})
    `;
    const [items] = await connection.execute(itemsQuery, orderIds);

    const orderMap = {};
    orders.forEach(order => {
      orderMap[order.cartId] = { ...order, items: [] };
    });

    items.forEach(item => {
      if (orderMap[item.cartId]) {
        orderMap[item.cartId].items.push(item);
      }
    });

    return Object.values(orderMap);
  } finally {
    connection.release();
  }
}

async function getOrderById(id, language) {
  const connection = await pool.getConnection();
  try {
    // Query to get order details including customer first name and last name
    const orderQuery = `
      SELECT 
        cart.customer_id, 
        c.firstName AS firstName,
        c.lastName AS lastName,
        cart.created_at, 
        cart.location_id, 
        cart.total_price
      FROM cart
      JOIN customer c ON cart.customer_id = c.id
      WHERE cart.id = ?
    `;
    const [orderRows] = await connection.execute(orderQuery, [id]);

    if (!orderRows.length) return null; // No order found

    const order = orderRows[0];

    // Determine the plant name column based on the language
    const plantNameColumn = language === "ar" ? "p.plant_name_AR" : "p.plant_name_EN";

    // Query for items in the order
    const itemsQuery = `
      SELECT 
        ci.plantId, 
        ci.quantity, 
        ci.size, 
        ci.details, 
        ${plantNameColumn} AS plantName
      FROM cart_items ci
      JOIN plant p ON ci.plantId = p.id
      WHERE ci.cartId = ?
    `;
    const [items] = await connection.execute(itemsQuery, [id]);

    // Combine order details with items
    return { ...order, items };
  } finally {
    connection.release();
  }
}

async function getAllOrdersWithItemsForAdmin(language) {
  const connection = await pool.getConnection();
  try {
    // Query for all orders
    const ordersQuery = `
      SELECT c.id AS cartId, c.created_at, c.location_id, c.total_price, c.customer_id, cu.firstName AS customerFirstName, cu.lastName AS customerLastName
      FROM cart c
      JOIN customer cu ON c.customer_id = cu.id
    `;
    const [orders] = await connection.execute(ordersQuery);

    if (!orders.length) return [];

    const orderIds = orders.map(order => order.cartId);

    // Determine the plant name column based on the language
    const plantNameColumn = language === "ar" ? "p.plant_name_AR" : "p.plant_name_EN";

    // Query for items in the orders
    const itemsQuery = `
      SELECT ci.cartId, ci.plantId, ci.quantity, ci.size, ci.details, ${plantNameColumn} AS plantName
      FROM cart_items ci
      JOIN plant p ON ci.plantId = p.id
      WHERE ci.cartId IN (${orderIds.map(() => "?").join(",")})
    `;
    const [items] = await connection.execute(itemsQuery, orderIds);

    // Group items by their cartId
    const orderMap = {};
    orders.forEach(order => {
      orderMap[order.cartId] = { ...order, items: [] };
    });

    items.forEach(item => {
      if (orderMap[item.cartId]) {
        orderMap[item.cartId].items.push(item);
      }
    });

    return Object.values(orderMap);
  } finally {
    connection.release();
  }
}


async function createPayment({ provider, status, amount, currency, paymentMethod, transactionId }) {
  // TODO
}

module.exports = {
  createNewOrder,
  getAllOrdersWithItems,
  getOrderById,
  getAllOrdersWithItemsForAdmin,
  createPayment,
};
