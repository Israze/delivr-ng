const express = require("express");
const router = express.Router();
const { getEstimate } = require("../services/estimate.service");

// GET /api/estimate?from=yaba&to=lekki&state_code=LA&vehicle=bike
router.get("/", async (req, res) => {
  const { from, to, state_code, vehicle } = req.query;

  if (!from || !to || !state_code) {
    return res.status(400).json({
      error: "Missing required query params: from, to, state_code",
      example: "/api/estimate?from=yaba north&to=yaba south&state_code=LA",
    });
  }

  try {
    const data = await getEstimate({ from, to, state_code, vehicle });
    res.json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
