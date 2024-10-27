const express = require("express");
const homePhotoController = require("../controllers/home_photo.controller");

const upload = require("../middleware/uploadHomePhoto");

const homePhoto = express.Router();

homePhoto.post("/createHomePhoto", upload, homePhotoController.createHomePhoto);
homePhoto.get("/findHomePhotoById/:id", homePhotoController.findHomePhotoById);
homePhoto.put(
  "/updateHomePhoto/:id",
  upload,
  homePhotoController.updateHomePhoto
);
homePhoto.delete("/deleteHomePhoto/:id", homePhotoController.deleteHomePhoto);

module.exports = homePhoto;
