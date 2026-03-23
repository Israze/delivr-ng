const express = require("express");
const router = express.Router();
const { getAllCities, getCityByCode } = require("../services/cities.service");

// GET /api/cities
router.get("/", async (req, res) => {
  try {
    const data = await getAllCities();
    res.json({ count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cities/:code
router.get("/:code", async (req, res) => {
  try {
    const data = await getCityByCode(req.params.code);
    res.json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;