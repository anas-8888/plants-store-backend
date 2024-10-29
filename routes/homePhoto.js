const express = require("express");
const homePhotoController = require("../controllers/home_photo.controller");
const upload = require("../middleware/uploadHomePhoto");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const homePhoto = express.Router();

homePhoto.post("/createHomePhoto", isAdmin, upload, homePhotoController.createHomePhoto);
homePhoto.get("/findAllHomePhotos", homePhotoController.findAllHomePhotos);
homePhoto.get("/findHomePhotoById/:id", isAdmin, homePhotoController.findHomePhotoById);
homePhoto.delete("/deleteHomePhoto/:id", isAdmin, homePhotoController.deleteHomePhoto);

module.exports = homePhoto;
