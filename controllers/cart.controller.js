const cartRepository = require("../repositories/cart.repository");
const { validationResult } = require("express-validator");

// Create cart
async function createCart(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { location, items, customerId, paymentId } = req.body;
    const plantIds = Object.values(items).map((item) => item.id);
    const plants = await cartRepository.getPlantsByIds(plantIds);
    let totalPrice = 0;

    for (const itemKey in items) {
      const { id, quantity } = items[itemKey];
      const plant = plants.find((p) => p.id === id);

      if (!plant) {
        return res.status(404).json({ error: `Plant with ID ${id} not found` });
      }

      totalPrice += plant.price * quantity;
    }

    const cartId = await cartRepository.createCart({
      location,
      items,
      totalPrice,
      customerId,
      paymentId,
    });

    return res.status(201).json({
      message: "cart created successfully",
      cartId: cartId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create cart",
      details: error.message,
    });
  }
}

// Get All carts
async function getAllCarts(req, res) {
  try {
    const carts = await cartRepository.findAllCarts();
    return res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve carts",
      details: error.message,
    });
  }
}

// Get cart By ID
async function getCartById(req, res) {
  try {
    const { id } = req.params;
    const cart = await cartRepository.findCartById(id);
    if (!cart) {
      return res.status(404).json({ error: "cart not found" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve cart",
      details: error.message,
    });
  }
}

// Get All Profits
async function getAllProfits(req, res) {
  try {
    const totalProfit = await cartRepository.calculateTotalProfits();
    return res.status(200).json({ totalProfit });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to calculate total profits",
      details: error.message,
    });
  }
}

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  getAllProfits,
};
