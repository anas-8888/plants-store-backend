const express = require("express");
const { ordersController } = require("../controllers/order.controller");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");
const { validateCart } = require("../middleware/cartValidation");

const router = express.Router();

router.post("/createOrder", isCustomer, ordersController.createOrder);
router.get("/findAllOrders", isAdmin, ordersController.getAllLastOrders);
router.get("/findMyAllOrders", isCustomer, ordersController.findAllOrders);
router.get("/findOrderById/:id", isAdmin, ordersController.findOrderById);
router.post("/paymentAction", isCustomer, validateCart, ordersController.paymentAction); // TODO

module.exports = router;
