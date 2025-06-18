// ===============================================================
// Minimal Express.js backend for CommunityConnect Hub
// Provides a /api/news endpoint (proxy for NewsAPI.org Chennai headlines)
// - Loads News API key from .env (NEWS_API_KEY), falls back to demo key if not set
// - Sets CORS headers for frontend access (dev/localhost)
// - Robust error handling for NewsAPI/network failures
// - Returns NewsAPI JSON or HTTP 502/500
// ===============================================================

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");  // If using Node 18+, can use global fetch
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------
// CORS setup for local dev access
// ------------------------------
// Change the 'origin' list below to restrict access as needed.
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
    // Add other allowed frontend URLs as needed.
  ]
}));

// PUBLIC_INTERFACE
// GET /api/news — Fetches Chennai headlines from NewsAPI.org
app.get("/api/news", async (req, res) => {
  // PUBLIC_INTERFACE: Set your .env as follows (see bottom for example):
  // NEWS_API_KEY=YOUR_NEWSAPI_KEY
  // If not provided, uses fallback demo key.

  // Extract from environment or use fallback key
  const apiKey = process.env.NEWS_API_KEY || "737e634c6ef84eb4a280c96c4ec7815f";

  if (!apiKey) {
    // This case will not occur with fallback, but kept for clarity
    return res.status(500).json({
      status: "error",
      message: "News API key missing. Add NEWS_API_KEY to your .env or use default."
    });
  }

  // Build NewsAPI query: "Chennai" as keyword, pageSize=12, English, sorted by date
  const query = {
    q: "Chennai",
    pageSize: "12",
    sortBy: "publishedAt",
    language: "en"
  };
  const url = "https://newsapi.org/v2/top-headlines?" + new URLSearchParams(query);

  try {
    const apiRes = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
      // Timeout note: node-fetch v2+ supports 'timeout', otherwise implement manually
      timeout: 10000
    });

    let data = null;
    try {
      data = await apiRes.json();
    } catch (parseErr) {
      return res.status(502).json({
        status: "error",
        message: "Could not parse NewsAPI.org response."
      });
    }

    // NewsAPI.org standard success envelope
    if (apiRes.ok && data.status === "ok" && Array.isArray(data.articles)) {
      return res.json(data);
    } else {
      // NewsAPI error envelope or HTTP error
      return res.status(502).json({
        status: data.status || "error",
        message: data.message || "NewsAPI.org returned an error.",
        code: data.code || undefined,
      });
    }
  } catch (err) {
    // Network or fetch failure
    return res.status(502).json({
      status: "error",
      message: "Unable to contact NewsAPI.org. " +
        (err && err.message ? String(err.message) : "")
    });
  }
});

// PUBLIC_INTERFACE
// Health check endpoint (optional)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "News backend alive." });
});

// ---------------------------------
// Start / Stop Instructions
// ---------------------------------
/*
1. Create a .env file in the same directory as this server.js:

   NEWS_API_KEY=your_newsapi_org_key
   # (You can use 737e634c6ef84eb4a280c96c4ec7815f for demo/testing)

   Optionally, to change port:
   PORT=5000

2. Install dependencies (run in this folder):
   npm install express cors dotenv node-fetch

3. Start the backend server:
   node server.js
   # or: npx nodemon server.js

4. Stop the server:
   Press Ctrl+C in the terminal where it is running.

5. Frontend can fetch news at:
   http://localhost:5000/api/news

NOTE: Never commit your actual NEWS_API_KEY to public repositories.
*/

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`News API backend running at http://localhost:${PORT}/api/news`);
});
