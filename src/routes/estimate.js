const express = require("express");
const router = express.Router();
const { getEstimate } = require("../services/estimate.service");

// GET /api/estimate?from=yaba&to=lekki&state_code=LA&vehicle=bike
router.get("/", async (req, res) => {
  // Clean up query params — remove any quotes
  let { from, to, state_code, vehicle } = req.query;
  
  // Remove quotes and trim whitespace
  from = from?.replace(/["']/g, '').trim();
  to = to?.replace(/["']/g, '').trim();
  state_code = state_code?.replace(/["']/g, '').trim();
  vehicle = vehicle?.replace(/["']/g, '').trim();

  if (!from || !to || !state_code) {
    return res.status(400).json({
      error: "Missing required query params: from, to, state_code",
      example: "/api/estimate?from=Ikeja&to=Surulere&state_code=LA",
    });
  }

  try {
    const data = await getEstimate({ from, to, state_code, vehicle });
    res.json({ data });
  } catch (error) {
    console.error('Estimate error:', error); // Add logging
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;