import React, { useEffect, useState } from "react";

/**
 * Weather.js — CommunityConnect Hub (Chennai Weather)
 *
 * This component fetches and displays the current weather in Chennai using the OpenWeatherMap API.
 * - Robust error handling for user-facing experience (loading | error | success).
 * - Dark theme, with branding color highlights: #dc0000 (primary), #00dc00 (secondary), #0000dc (accent).
 * - INSTRUCTIONS: Place your OpenWeatherMap API KEY below where marked.
 *   You can sign up free for an API key at: https://openweathermap.org/api
 *   (If you use the default demo key, results are limited and unreliable.)
 *
 * Style classes use the CommunityConnect Hub's dark card/layout system.
 */

// PUBLIC_INTERFACE
function Weather() {
  /**
   * Main Weather display for Chennai. Handles fetch, parses, and displays weather in a presentable card.
   */
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // 1. ======== PLACE YOUR API KEY BELOW ================
  // Create your free key at https://openweathermap.org/api
  // For best experience, REPLACE THE STRING below with your own OpenWeatherMap API key.
  const API_KEY = "YOUR_API_KEY_HERE"; // <--- PUT YOUR API KEY HERE
  // =====================================================
  const CITY = "Chennai";
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    CITY
  )}&appid=${API_KEY}&units=metric`;

  // Emoji mapping for weather conditions based on OpenWeatherMap icon code or weather "main"
  const emojiForWeather = (main, icon = "") => {
    if (icon?.startsWith("01")) return "☀️";
    if (icon?.startsWith("02")) return "🌤️";
    if (icon?.startsWith("03") || icon?.startsWith("04")) return "☁️";
    if (icon?.startsWith("09") || icon?.startsWith("10")) return "🌧️";
    if (icon?.startsWith("11")) return "⛈️";
    if (icon?.startsWith("13")) return "❄️";
    if (icon?.startsWith("50")) return "🌫️";
    switch (main) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
      case "Drizzle":
        return "🌧️";
      case "Thunderstorm":
        return "⛈️";
      case "Snow":
        return "❄️";
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
      case "Tornado":
        return "🌫️";
      default:
        return "🌈";
    }
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    setWeatherData(null);

    // Defensive: Don't attempt API fetch if API_KEY missing.
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      setTimeout(() => {
        setFetchError(
          "No OpenWeatherMap API key provided! Please add your API key above in Weather.js."
        );
        setLoading(false);
      }, 350);
      return;
    }

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          // Try to parse error from OpenWeatherMap API
          return res.json().then((err) => {
            const msg = err?.message
              ? `OpenWeatherMap: ${err.message}`
              : "Failed to fetch weather data";
            throw new Error(msg);
          });
        }
        return res.json();
      })
      .then((data) => {
        // OpenWeatherMap will return .cod !== 200 for errors
        if (!data || data.cod !== 200) {
          throw new Error(
            typeof data?.message === "string"
              ? `OpenWeatherMap: ${data.message}`
              : "Weather data unavailable"
          );
        }
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        // Robust error message for user
        setFetchError(
          err?.message
            ? String(err.message)
            : "Unable to fetch weather for Chennai. Please try again later."
        );
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  // ---------- UI Rendering logic ----------
  let content = null;
  if (loading) {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "22px 0 13px 0",
        }}
      >
        Loading weather for Chennai&hellip;
      </div>
    );
  } else if (fetchError) {
    content = (
      <div
        style={{
          color: "var(--primary, #dc0000)",
          background: "rgba(220,0,0,0.08)",
          fontWeight: 600,
          borderRadius: 8,
          textAlign: "center",
          margin: "18px 0 13px 0",
          padding: "14px 8px",
          border: "1.2px solid var(--primary, #dc0000)",
        }}
      >
        <span role="img" aria-label="error" style={{ fontSize: "1.3em", marginRight: 4 }}>
          ⚠️
        </span>
        {fetchError}
      </div>
    );
  } else if (weatherData) {
    // Safe parse fields (OpenWeatherMap JSON)
    const w = weatherData;
    const tempC = typeof w.main?.temp === "number" ? Math.round(w.main?.temp) : "--";
    const tempF =
      typeof w.main?.temp === "number" ? Math.round(w.main.temp * (9 / 5) + 32) : "--";
    const weatherIcon = emojiForWeather(w.weather?.[0]?.main, w.weather?.[0]?.icon);
    const weatherMain = w.weather?.[0]?.main || "";
    const weatherDesc = w.weather?.[0]?.description
      ? w.weather[0].description.charAt(0).toUpperCase() +
        w.weather[0].description.slice(1)
      : "";
    const highC =
      typeof w.main?.temp_max === "number"
        ? Math.round(w.main?.temp_max)
        : undefined;
    const lowC =
      typeof w.main?.temp_min === "number"
        ? Math.round(w.main?.temp_min)
        : undefined;
    const highF =
      typeof highC === "number" ? Math.round(highC * (9 / 5) + 32) : undefined;
    const lowF =
      typeof lowC === "number" ? Math.round(lowC * (9 / 5) + 32) : undefined;
    const humidity =
      typeof w.main?.humidity === "number" ? `${w.main.humidity}%` : "--";
    const wind =
      typeof w.wind?.speed === "number"
        ? `${w.wind.speed} m/s`
        : "--";
    const cloudCover =
      typeof w.clouds?.all === "number" ? `${w.clouds.all}%` : null;
    const updated =
      w.dt && !isNaN(w.dt)
        ? new Date(w.dt * 1000).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

    content = (
      <div className="cch-weather-main">
        <span
          className="cch-weather-icon"
          aria-label="weather icon"
          style={{ fontSize: "3.0rem", marginRight: 10 }}
        >
          {weatherIcon}
        </span>
        <div>
          <div className="cch-weather-temp">
            {tempF !== "--" ? `${tempF}\u00b0F` : "--"}
            <span style={{ color: "var(--cch-text-muted)", fontSize: "0.98em", marginLeft: 7 }}>
              {tempC !== "--" && `(${tempC}\u00b0C)`}
            </span>
          </div>
          <div className="cch-weather-desc" style={{ color: "var(--accent)" }}>
            {weatherDesc || weatherMain}
          </div>
          <div className="cch-weather-details" style={{ color: "var(--secondary)", gap: 13 }}>
            {highF !== undefined && (
              <span>
                <b>H:</b> {highF}\u00b0F
              </span>
            )}
            {lowF !== undefined && (
              <span>
                <b>L:</b> {lowF}\u00b0F
              </span>
            )}
            {wind && (
              <span>
                <b>Wind:</b> {wind}
              </span>
            )}
            {humidity && (
              <span>
                <b>Humidity:</b> {humidity}
              </span>
            )}
            {cloudCover && (
              <span>
                <b>Clouds:</b> {cloudCover}
              </span>
            )}
          </div>
          <div
            style={{
              color: "var(--cch-text-muted)",
              fontSize: "0.96rem",
              marginTop: 8,
            }}
          >
            Last updated: {updated}
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "17px 0 8px 0",
        }}
      >
        Weather information not available.
      </div>
    );
  }

  // Main render
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section
        className="cch-section cch-weather"
        style={{
          maxWidth: 450,
          margin: "0 auto",
          background: "var(--cch-card, #23243a)",
          borderRadius: "var(--cch-radius, 13px)",
          boxShadow: "var(--cch-shadow, 0 4px 12px rgba(0,0,0,0.18))",
          border: "1.5px solid var(--cch-border, rgba(255,255,255,0.1))",
        }}
      >
        <h2 className="cch-section-title" style={{ color: "var(--accent, #0000dc)" }}>
          Weather — Chennai
        </h2>
        {content}
        <div
          style={{
            marginTop: 22,
            textAlign: "right",
            fontSize: "0.93rem",
            color: "var(--cch-text-muted)",
          }}
        >
          Data powered by{" "}
          <a
            href="https://openweathermap.org/"
            tabIndex={-1}
            style={{ color: "var(--primary, #dc0000)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeatherMap
          </a>
        </div>
      </section>
    </div>
  );
}

export default Weather;
