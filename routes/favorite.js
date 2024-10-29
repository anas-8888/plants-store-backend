const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const favorite = express.Router();

favorite.get("/findAllFavorite", isCustomer, favoriteController.findAllFavorites);
favorite.get("/findFavoriteById/:id", isAdmin, favoriteController.findFavoriteById);
favorite.get("/findFavoriteByCustomerId/:id", isCustomer, favoriteController.findFavoriteByCustomerId);
favorite.get("/isFavorite/:customerId/:plantID", isCustomer, favoriteController.isFavorite);
favorite.post("/createFavorite", isCustomer, favoriteController.saveFavorite);
favorite.delete("/deleteFavorite/:id", isCustomer, favoriteController.deleteFavorite);

module.exports = favorite;
