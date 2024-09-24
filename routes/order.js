const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getAllProfits,
} = require("../controllers/order.controller");
const { validateOrder } = require("../middleware/orderValidation");

const orderRouter = express.Router();

orderRouter.post("/createOrder", validateOrder, createOrder);
orderRouter.get("/getAllOrders", getAllOrders);
orderRouter.get("/getOrderById/:id", getOrderById);
orderRouter.get("/getAllProfits", getAllProfits);

module.exports = orderRouter;
