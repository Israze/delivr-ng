const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { limiter, strictLimiter } = require("./middleware/rateLimiter");

dotenv.config();

const citiesRoute = require("./routes/cities");
const providersRoute = require("./routes/providers");
const estimateRoute = require("./routes/estimate");

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter); 

// Routes
app.use("/api/cities", citiesRoute);
app.use("/api/providers", providersRoute);
app.use("/api/estimate", strictLimiter, estimateRoute); // stricter on estimate

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "delivr-ng",
    version: "1.0.0",
    description: "Nigerian Delivery Fee Estimator API",
    endpoints: [
      "GET /api/cities",
      "GET /api/cities/:code",
      "GET /api/providers",
      "GET /api/providers/:id",
      "GET /api/estimate?from=Ikeja&to=Surulere&state_code=LA",
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`delivr-ng running on port ${PORT}`);
});