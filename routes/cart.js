const express = require("express");
const {
  createCart,
  getAllCarts,
  getCartById,
  getAllProfits,
} = require("../controllers/cart.controller");
const { validateCart } = require("../middleware/cartValidation");

const cartRouter = express.Router();

cartRouter.post("/createCart", validateCart, createCart);
cartRouter.get("/getAllCarts", getAllCarts);
cartRouter.get("/getCartById/:id", getCartById);
cartRouter.get("/getAllProfits", getAllProfits);

module.exports = cartRouter;
