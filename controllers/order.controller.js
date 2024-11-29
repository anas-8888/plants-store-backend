const nodemailer = require("nodemailer");
const { format } = require('date-fns');

const {
  createNewOrder,
  getAllOrdersWithItems,
  getOrderById,
  getAllOrdersWithItemsForAdmin,
  createPayment,
} = require("../repositories/order.repository");

const {
  getPlantPrice,
  findActivePlantById
} = require("../repositories/plant.repository");

const { 
  getLocationById
 } = require("../repositories/locations.repository");

const ordersController = {
  async createOrder(req, res) {
    const { location_id, items } = req.body;
    const customer_id = req.user.id;
    const customer_email = req.user.email;
    let total_price = 0;

    try {
      // Validate items
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Items must be an array" });
      }
      if (items.length === 0) {
        return res.status(400).json({ error: "Order must contain at least one item" });
      }
      for (const item of items) {
        if (!item.plantId || !item.size || !item.quantity) {
          return res.status(400).json({ error: "Missing required fields for an item" });
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
        const plantPrice = await getPlantPrice(item.size, item.plantId);
        if (plantPrice == -1) {
          return res.status(400).json({ error: `Plant not found for ID: ${item.plantId} and size: ${item.size}` });
        }
        total_price += plantPrice * item.quantity;
      }

      // Create the new order
      const cartId = await createNewOrder({
        location_id,
        customer_id,
        total_price,
        payment_id: null,
        items,
      });

      // Generate order details
      const language = req.language || "en";
      const orderDetails = await Promise.all(
        items.map(async (item, index) => {
          const Fullitem = await findActivePlantById(item.plantId);
          return language === "en"
            ? `
            <tr>
              <td>${index + 1}</td>
              <td>${Fullitem[0].plant_name_EN}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>${await getPlantPrice(item.size, item.plantId)} JOD</td>
            </tr>
          `
            : `
            <tr>
              <td>${index + 1}</td>
              <td>${Fullitem[0].plant_name_AR}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>${await getPlantPrice(item.size, item.plantId)} دينار أردني</td>
            </tr>
          `;
        })
      );

      // Get the current date and time
      const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      // Prepare email content
      const emailContent = language === "en"
        ? `
        <html>
          <body style="font-family: Arial, sans-serif; direction: ltr; text-align: left;">
            <h2>Dear Customer,</h2>
            <p>Thank you for ordering from nabtaty.com, Here are the details of your order:</p>
            <p><strong>Date & Time:</strong> ${currentDateTime}</p>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Plant Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.join("")}
                <tr>
                  <td colspan="4" style="text-align: right;"><strong>Delivery to ${location.location_name_EN}:</strong></td>
                  <td>${location.price} JOD</td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                  <td>${total_price.toFixed(2)} JOD</td>
                </tr>
              </tbody>
            </table>
            <p>We appreciate your business!</p>
            <p>Best Regards,<br>Your Plant Store Team</p>
            <div style="text-align: center; margin-top: 20px;">
              <img src="cid:logo" alt="Nabtaty Logo" style="width: 100px; height: auto;">
            </div>
          </body>
        </html>
      `
        : `
        <html>
          <body style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>عزيزنا العميل،</h2>
            <p>شكراً لك لطلبك من موقع nabtaty.com، إليك تفاصيل طلبك:</p>
            <p><strong>التاريخ والوقت:</strong> ${currentDateTime}</p>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم النبتة</th>
                  <th>الحجم</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.join("")}
                <tr>
                  <td colspan="4" style="text-align: left;"><strong>التوصيل إلى ${location.location_name_AR}:</strong></td>
                  <td>${location.price} دينار أردني</td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: left;"><strong>الإجمالي:</strong></td>
                  <td>${total_price.toFixed(2)} دينار أردني</td>
                </tr>
              </tbody>
            </table>
            <p>نحن نقدّر تعاملك معنا!</p>
            <p>كل التمنيات,<br>فريق موقع nabtaty</p>
            <div style="text-align: center; margin-top: 20px;">
              <img src="cid:logo" alt="Nabtaty Logo" style="width: 100px; height: auto;">
            </div>
          </body>
        </html>
      `;

      // Send email
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
        subject: language === "en" ? "Order Confirmation" : "تأكيد الطلب",
        html: emailContent,
        attachments: [{
          filename: 'logo.png',
          path: 'httpdocs/assets/logo nabtaty-02.png',
          cid: 'logo' // same cid value as in the html img src
        }]
      });

      return res.status(201).json({ message: "Order created successfully", cartId });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create order", details: error.message });
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
