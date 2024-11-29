const nodemailer = require("nodemailer");
const {
  createNewOrder,
  getAllOrdersWithItems,
  getOrderById,
  getAllOrdersWithItemsForAdmin,
  getItemByOrderId,
  createPayment,
} = require("../repositories/order.repository");

const { getPlantPrice } = require("../repositories/plant.repository");
const { getLocationById } = require("../repositories/locations.repository");

const ordersController = {
  async createOrder(req, res) {
    const { location_id, items } = req.body;
    const customer_id = req.user.id;
    const customer_email = req.user.email;
    let total_price = 0;

    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }
    if (!items.length) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }
    for (const item of items) {
      if (!item.plantId || !item.size || !item.quantity) {
        return res
          .status(400)
          .json({ error: "Missing required fields for an item" });
      }
    }

    // Fetch and validate location
    const location = await getLocationById(location_id);
    if (!location) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    // Add location price to total price
    total_price += parseFloat(location.price);

    // Calculate total price for items
    for (const item of items) {
      const plantPrice = await getPlantPrice(item.plantId);

      if (plantPrice === -1) {
        return res.status(400).json({ error: "Item not found" });
      }

      if (!item.size) {
        return res
          .status(400)
          .json({ error: `Size is required for plant ID: ${item.plantId}` });
      }

      total_price += plantPrice * item.quantity;
    }

    try {
      // Create the new order
      const cartId = await createNewOrder({
        location_id,
        customer_id,
        total_price,
        payment_id: null,
        items,
      });

      // Prepare email content
      const orderDetails = items
        .map(
          (item) =>
            `Plant ID: ${item.plantId}, Size: ${item.size}, Quantity: ${item.quantity}`
        )
        .join("\n");

      const emailContent = `
                Dear Customer,

                Thank you for your order!

                Order ID: ${cartId}
                Location: ${location.name} (${location.price} USD)
                Total Price: ${total_price.toFixed(2)} USD

                Items Ordered:
                ${orderDetails}

                We appreciate your business!

                Best Regards,
                Your Plant Store Team
            `;

      //Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Plant Store" <${process.env.EMAIL_USER}>`,
        to: customer_email,
        subject: "Order Confirmation",
        text: emailContent,
      });

      return res
        .status(201)
        .json({ message: "Order created successfully", cartId });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create order", details: error.message });
    }
  },

  async findAllOrders(req, res) {
    const customerId = req.user.id;

    if (isNaN(Number(customerId))) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    // Determine the language
    const language = req.language || "en"; // Default to English if no language is set

    try {
      const orders = await getAllOrdersWithItems(customerId, language);
      if (!orders.length) {
        return res
          .status(404)
          .json({ error: "No orders found for this customer" });
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to retrieve orders with items",
        details: error.message,
      });
    }
  },

  async getAllLastOrders(req, res) {
    const language = req.language || "en";

    try {
      const orders = await getAllOrdersWithItemsForAdmin(language);
      if (!orders.length) {
        return res.status(404).json({ error: "No orders found" });
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to retrieve orders with items",
        details: error.message,
      });
    }
  },

  async findOrderById(req, res) {
    const { id } = req.params;
    const language = req.language || "en"; // Default to English

    try {
      const order = await getOrderById(id, language);
      if (!order) return res.status(404).json({ error: "Order not found" });

      return res.status(200).json(order);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve order", details: error.message });
    }
  },

  async paymentAction(req, res) {
    return res.status(501).json({ error: "Payment action not implemented" });
    // TODO
  },
};

module.exports = { ordersController };
