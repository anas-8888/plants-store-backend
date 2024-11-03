const {
      createNewOrder,
      getAllOrders,
      getOrderById,
      findAllLastOrders,
      getItemByOrderId,
      createPayment,
} = require("../repositories/order.repository");

const { getPlantPrice } = require("../repositories/plant.repository");

const ordersController = {
      async createOrder(req, res) {
            const { location_id, items } = req.body;
            const customer_id = req.user.id;
            let total_price = 0;

            // Validate items
            if (!Array.isArray(items)) {
                  return res.status(400).json({ error: "Items must be an array" });
            }

            // Calculate total price
            for (const item of items) {
                  const plantPrice = await getPlantPrice(item.plantId);
                  
                  if(plantPrice === -1) {
                        return res.status(400).json({ error: "Item not found" });
                  }

                  total_price += plantPrice * item.quantity;
            }

            try {
                  const cartId = await createNewOrder({
                        location_id,
                        customer_id,
                        total_price,
                        payment_id: null,
                        items
                  });

                  return res.status(201).json({ message: "Order created successfully", cartId });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to create order", details: error.message });
            }
      },

      async findAllOrders(req, res) {
            try {
                  const customerId = 1; // TODO
                  const orders = await getAllOrders(customerId);
                  return res.status(200).json(orders);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve orders", details: error.message });
            }
      },
      
      async getAllLastOrders(req, res) {
            try {
                  const orders = await findAllLastOrders();
                  return res.status(200).json(orders);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve orders", details: error.message });
            }
      },

      async findOrderById(req, res) {
            const { id } = req.params;
            try {
                  const order = await getOrderById(id);
                  if (!order) return res.status(404).json({ error: "Order not found" });

                  return res.status(200).json(order);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve order", details: error.message });
            }
      },

      async findAllOrderItems(req, res) {
            const { id } = req.params;
            try {
                  const Items = await getItemByOrderId(id);
                  if (!Items) {
                        return res.status(404).json({ error: "items not found" });
                  }

                  return res.status(200).json(Items);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve items", details: error.message });
            }
      },

      async paymentAction(req, res) {
            // TODO
      },
};

module.exports = { ordersController };