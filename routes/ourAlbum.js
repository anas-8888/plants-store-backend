const express = require("express");
const albumController = require("../controllers/our_album.controller");
const upload = require("../middleware/uploadAlbums");

const ourAlbum = express.Router();

ourAlbum.post("/createAlbum", upload, albumController.createAlbum);
ourAlbum.get("/findAlbumById/:id", albumController.findAlbumById);
ourAlbum.put("/updateOurAlbum/:id", upload, albumController.updateAlbum);
ourAlbum.delete("/deleteOurAlbum/:id", albumController.deleteAlbum);

module.exports = ourAlbum;
