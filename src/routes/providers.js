const express = require("express");
const router = express.Router();
const {
  getAllProviders,
  getProviderById,
} = require("../services/providers.service");

// GET /api/providers
router.get("/", async (req, res) => {
  try {
    const data = await getAllProviders(req.query.city);
    res.json({ count: data.length, data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// GET /api/providers/:id
router.get("/:id", async (req, res) => {
  try {
    const data = await getProviderById(req.params.id);
    res.json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;