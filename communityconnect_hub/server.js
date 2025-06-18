//
// Minimal Express server providing a proxy endpoint for NewsAPI.org (Chennai news headlines)
// - GET /api/news: Forwards to NewsAPI with API key from .env
// - Handles CORS (development), robust error responses
// - See ".env" comments for expected API key
//
const express = require('express');
const fetch = require('node-fetch'); // Must install: npm install express node-fetch
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware: Allow all origins for development
app.use(cors());

// PUBLIC_INTERFACE
// GET /api/news — Proxy to NewsAPI.org for Chennai headlines
app.get('/api/news', async (req, res) => {
  // PUBLIC_INTERFACE: Pass your NewsAPI.org key in .env as NEWS_API_KEY=YOUR_KEY
  // e.g.:
  // NEWS_API_KEY=737e634c6ef84eb4a280c96c4ec7815f

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      status: "error",
      message: "News API key not configured. Add NEWS_API_KEY to your .env file.",
    });
  }

  // Build NewsAPI URL (top headlines for Chennai)
  const url =
    "https://newsapi.org/v2/top-headlines?" +
    new URLSearchParams({
      q: "Chennai",
      pageSize: "12",
      language: "en",
      sortBy: "publishedAt",
      country: "", // Optional: can be blank
    });

  try {
    const fetchResp = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
      timeout: 10000,
    });

    // Parse JSON, handle NewsAPI error envelopes
    let data = null;
    try {
      data = await fetchResp.json();
    } catch (err) {
      return res.status(502).json({
        status: "error",
        message: "Failed to parse NewsAPI.org response.",
      });
    }

    if (fetchResp.ok && data.status === "ok" && Array.isArray(data.articles)) {
      return res.json(data); // Success passthrough
    } else {
      // NewsAPI-format error
      return res.status(502).json({
        status: data.status || "error",
        message: data.message || "NewsAPI.org returned an error.",
        code: data.code || undefined,
      });
    }
  } catch (err) {
    return res.status(502).json({
      status: "error",
      message: "Unable to contact NewsAPI.org. " + (err && err.message ? String(err.message) : ""),
    });
  }
});

// HEALTH CHECK endpoint (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "News proxy backend alive." });
});

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`News API proxy running: http://localhost:${PORT}/api/news`);
});

/*
==============================
 Suggested .env file format:
==============================
# NewsAPI.org API key (DO NOT COMMIT actual keys to public repos)
NEWS_API_KEY=737e634c6ef84eb4a280c96c4ec7815f
# Optional: PORT=5000
*/
