const orderRepository = require("../repositories/order.repository");
const { validationResult } = require("express-validator");

// Create Order
async function createOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { location, items, customerId, paymentId } = req.body;
    const plantIds = Object.values(items).map((item) => item.id);
    const plants = await orderRepository.getPlantsByIds(plantIds);
    let totalPrice = 0;

    for (const itemKey in items) {
      const { id, quantity } = items[itemKey];
      const plant = plants.find((p) => p.id === id);

      if (!plant) {
        return res.status(404).json({ error: `Plant with ID ${id} not found` });
      }

      totalPrice += plant.price * quantity;
    }

    const orderId = await orderRepository.createOrder({
      location,
      items,
      totalPrice,
      customerId,
      paymentId,
    });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: orderId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
}

// Get All Orders
async function getAllOrders(req, res) {
  try {
    const orders = await orderRepository.findAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve orders",
      details: error.message,
    });
  }
}

// Get Order By ID
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderRepository.findOrderById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve order",
      details: error.message,
    });
  }
}

// Get All Profits
async function getAllProfits(req, res) {
  try {
    const totalProfit = await orderRepository.calculateTotalProfits();
    return res.status(200).json({ totalProfit });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to calculate total profits",
      details: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getAllProfits,
};
