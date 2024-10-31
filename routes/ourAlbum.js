const express = require("express");
const albumController = require("../controllers/our_album.controller");
const upload = require("../middleware/uploadAlbums");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const ourAlbum = express.Router();

ourAlbum.post("/createAlbum", isAdmin, upload, albumController.createAlbum);
ourAlbum.get("/findAllAlbumPhotos", albumController.findAllAlbumPhotos);
ourAlbum.get("/findAlbumById/:id", albumController.findAlbumById);
ourAlbum.delete("/deleteOurAlbum/:id", isAdmin, albumController.deleteAlbum);

module.exports = ourAlbum;
