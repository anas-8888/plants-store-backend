const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const favorite = express.Router();

favorite.get("/findAllFavorite", isAdmin, favoriteController.findAllFavorites);
favorite.get("/findFavoriteById/:id", isCustomer, favoriteController.findFavoriteById);
favorite.get("/findMyAllFavorite", isCustomer, favoriteController.findMyAllFavorite);
favorite.get("/isFavorite/:customerId/:plantID", isCustomer, favoriteController.isFavorite);
favorite.post("/createFavorite", isCustomer, favoriteController.saveFavorite);
favorite.delete("/deleteFavorite/:id", isCustomer, favoriteController.deleteFavorite);

module.exports = favorite;
