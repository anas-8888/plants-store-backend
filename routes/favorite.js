const express = require("express");
const favoriteController = require("../controllers/favorite.controller");

const favorite = express.Router();

favorite.post("/createFavorite", favoriteController.saveFavorite);
favorite.get("/findAllFavorite", favoriteController.findAllFavorites);
favorite.get("/findFavoriteById/:id", favoriteController.findFavoriteById);
favorite.delete("/deleteFavorite/:id", favoriteController.deleteFavorite);

module.exports = favorite;
