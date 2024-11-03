const express = require("express");
const pool = require("./../config/db");
const { isAdmin } = require("../middleware/isAdmin");

const test = express.Router();

test.get("/test", isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT 1 + 1 AS result`);
    res.status(200).json({
      message: "Database connection is Active",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = test;
