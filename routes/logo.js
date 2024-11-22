const express = require("express");
const {
      createLogo,
      findAllLogos,
      findLogoById,
      findAcctiveLogo,
      updateLogoAcctive,
      deleteLogo
} = require("./../controllers/logo.controller");
const upload = require("../middleware/uploadLogo");
const { isAdmin } = require("../middleware/isAdmin");

const logo = express.Router();

logo.post("/createLogo", isAdmin, upload, createLogo);
logo.get("/findAllLogos", isAdmin, findAllLogos);
logo.get("/findLogoById/:id", isAdmin, findLogoById);
logo.get("/findAcctiveLogo", findAcctiveLogo);
logo.put("/updateLogoAcctive/:id", isAdmin, updateLogoAcctive);
logo.delete("/deleteLogo/:id", isAdmin, deleteLogo);

module.exports = logo;
