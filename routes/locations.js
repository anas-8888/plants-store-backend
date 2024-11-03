const express = require("express");
const { locationsController } = require("./../controllers/locations.controller"); 
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createLocation", isAdmin, locationsController.createLocation); 
router.get("/findAllLocations", locationsController.findAllLocations ); 
router.get("/findLocationById/:id", locationsController.findLocationById ); 
router.delete("/deleteLocation/:id", isAdmin, locationsController.deleteLocation ); 
router.put("/updateLocation/:id", isAdmin, locationsController.updateLocation ); 

module.exports = router;
