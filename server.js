require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Rate limiter: Limit each IP to 5 requests per 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many requests. You are allowed 5 requests per 10 minutes.",
  },
});

// Apply the rate limiter to the API route
app.use("/api/generate-image", limiter);

// API route for image generation
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-2", // or "dall-e-3" for the latest version
        prompt: prompt,
        n: 1,
        size: "256x256",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ url: response.data.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
