import React, { useEffect, useState } from "react";

/**
 * Weather.js — CommunityConnect Hub Live Weather Page
 * 
 * Fetches current weather from OpenWeatherMap based on user's geolocated position.
 * Handles permission, error, and loading states, with dark-theme palette.
 */

// PUBLIC_INTERFACE
function Weather() {
  /** 
   * Prompts for geolocation, retrieves live weather, and renders all UI states per dark theme.
   */
  const [coords, setCoords] = useState(null);          // { lat, lon }
  const [geoStatus, setGeoStatus] = useState("pending"); // "pending", "success", "denied", "unsupported", "error"
  const [weather, setWeather] = useState(null);        // OpenWeatherMap data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");              // error string, if any

  const API_KEY = "d0de3aed7ae9465a8c5e0342b340d5fd";

  // Map OpenWeather icon/main to simple emoji
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
      default:
        return "🌈";
    }
  };

  // Ask user for geolocation on mount
  useEffect(() => {
    let isMounted = true;
    setCoords(null);
    setGeoStatus("pending");
    setError("");
    setWeather(null);

    if (!navigator.geolocation) {
      setGeoStatus("unsupported");
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isMounted) return;
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoStatus("success");
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        if (
          err.code === 1 // PERMISSION_DENIED
        ) {
          setGeoStatus("denied");
          setError("Location access denied. Unable to retrieve weather for your area.");
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setGeoStatus("error");
          setError("Unable to determine your location (position unavailable).");
        } else if (err.code === 3) { // TIMEOUT
          setGeoStatus("error");
          setError("Location request timed out. Please try again.");
        } else {
          setGeoStatus("error");
          setError("Could not retrieve your location.");
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: false, 
        timeout: 10000,
        maximumAge: 1000,
      }
    );
    // Cleanup if component unmounts
    return () => { isMounted = false; };
  }, []);

  // Fetch weather after coords acquired
  useEffect(() => {
    let isMounted = true;
    if (!coords || geoStatus !== "success") return;

    setLoading(true);
    setError("");
    setWeather(null);

    const { lat, lon } = coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("OpenWeatherMap network error");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (!data || data.cod !== 200) {
          throw new Error(
            typeof data?.message === "string"
              ? `OpenWeatherMap: ${data.message}`
              : "Weather data unavailable."
          );
        }
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err?.message
            ? String(err.message)
            : "Unable to fetch weather. Please try again later."
        );
        setLoading(false);
      });
    // cleanup if component unmounts before fetch finishes
    return () => { isMounted = false; };
  }, [coords, geoStatus]);

  // ---------- UI Logic ----------
  let content = null;
  if (geoStatus === "pending" || (loading && !weather)) {
    content = (
      <div style={{
        color: "var(--cch-text-muted)", textAlign: "center", margin: "30px 0"
      }}>
        {geoStatus === "pending"
          ? "Initializing location and weather lookup…"
          : "Detecting your location and fetching live weather…"}
      </div>
    );
  } else if (geoStatus === "unsupported") {
    content = (
      <div style={{
        color: "var(--primary)", fontWeight: 600, background: "rgba(220,0,0,0.1)",
        borderRadius: 8, textAlign: "center", margin: "24px 0", padding: "16px 10px",
        border: "1.2px solid var(--primary)"
      }}>
        <span role="img" aria-label="denied" style={{ fontSize: "1.27em", marginRight: 6 }}>
          ⚠️
        </span>
        Geolocation is not supported on your device.
      </div>
    );
  } else if (geoStatus === "denied") {
    content = (
      <div style={{
        color: "var(--primary)", fontWeight: 600, background: "rgba(220,0,0,0.09)",
        borderRadius: 8, textAlign: "center", margin: "26px 0", padding: "17px 11px",
        border: "1.2px solid var(--primary)"
      }}>
        <span role="img" aria-label="denied" style={{ fontSize: "1.3em", marginRight: 6 }}>
          ⚠️
        </span>
        Location permission denied. Unable to show live weather.
      </div>
    );
  } else if (geoStatus === "error" && error) {
    content = (
      <div style={{
        color: "var(--primary)", fontWeight: 600, background: "rgba(220,0,0,0.12)",
        borderRadius: 8, textAlign: "center", margin: "19px 0", padding: "14px 9px",
        border: "1.2px solid var(--primary)"
      }}>
        <span role="img" aria-label="error" style={{ fontSize: "1.23em", marginRight: 5 }}>
          ⚠️
        </span>
        {error}
      </div>
    );
  } else if (error && !weather) {
    content = (
      <div style={{
        color: "var(--primary)", background: "rgba(220,0,0,0.09)", fontWeight: 600,
        borderRadius: 8, textAlign: "center", margin: "21px 0", padding: "11px 7px",
        border: "1.2px solid var(--primary)"
      }}>
        <span role="img" aria-label="error" style={{ fontSize: "1.22em", marginRight: 4 }}>
          ⚠️
        </span>
        {error}
      </div>
    );
  } else if (weather) {
    // Defensive access for OWM JSON:
    const w = weather;
    const tempC = typeof w.main?.temp === "number" ? Math.round(w.main.temp) : "--";
    const tempF = typeof w.main?.temp === "number" ? Math.round(w.main.temp * 9/5 + 32) : "--";
    const weatherIcon = emojiForWeather(w.weather?.[0]?.main, w.weather?.[0]?.icon);
    const weatherMain = w.weather?.[0]?.main || "";
    const weatherDesc = w.weather?.[0]?.description
        ? w.weather[0].description.charAt(0).toUpperCase() + w.weather[0].description.slice(1)
        : "";
    const highC = typeof w.main?.temp_max === "number" ? Math.round(w.main?.temp_max) : "--";
    const lowC = typeof w.main?.temp_min === "number" ? Math.round(w.main?.temp_min) : "--";
    const highF = highC !== "--" ? Math.round(highC * 9/5 + 32) : "--";
    const lowF = lowC !== "--" ? Math.round(lowC * 9/5 + 32) : "--";
    const humidity = typeof w.main?.humidity === "number" ? `${w.main.humidity}%` : "--";
    const wind = typeof w.wind?.speed === "number" ? `${w.wind.speed} m/s` : "--";
    const clouds = typeof w.clouds?.all === "number" ? `${w.clouds.all}%` : null;
    const updated =
      w.dt && !isNaN(w.dt)
        ? new Date(w.dt * 1000).toLocaleString(undefined, {
            hour: "2-digit", minute: "2-digit", hour12: true,
            day: "numeric", month: "short", year: "numeric"
          })
        : "";
    // fallback to display city/country or just 'your area'
    const location =
      (w.name && typeof w.name === "string" && w.name.length > 0 ? w.name : "your area") +
      (w.sys && typeof w.sys.country === "string" ? `, ${w.sys.country}` : "");

    content = (
      <div className="cch-weather-main">
        <span
          className="cch-weather-icon"
          aria-label="weather icon"
          style={{ fontSize: "2.9rem", marginRight: 12 }}
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
          <div style={{
            color: "var(--secondary)", fontSize: "0.97rem", marginTop: 4
          }}>
            {location}
          </div>
          <div className="cch-weather-details" style={{
            color: "var(--secondary)", gap: 13
          }}>
            {highF !== "--" && (
              <span>
                <b>H:</b> {highF}\u00b0F
              </span>
            )}
            {lowF !== "--" && (
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
            {clouds && (
              <span>
                <b>Clouds:</b> {clouds}
              </span>
            )}
          </div>
          <div style={{
            color: "var(--cch-text-muted)", fontSize: "0.97em", marginTop: 8,
          }}>
            Last updated: {updated}
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div style={{
        color: "var(--cch-text-muted)", textAlign: "center", margin: "19px 0"
      }}>
        Weather information not available.
      </div>
    );
  }

  // ---- Main render ----
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section
        className="cch-section cch-weather"
        style={{
          maxWidth: 470,
          margin: "0 auto",
          background: "var(--cch-card,#23243a)",
          borderRadius: "var(--cch-radius,13px)",
          boxShadow: "var(--cch-shadow,0 4px 12px rgba(0,0,0,0.18))",
          border: "1.5px solid var(--cch-border,rgba(255,255,255,0.1))"
        }}
      >
        <h2 className="cch-section-title" style={{ color: "var(--accent,#0000dc)" }}>
          Local Weather
        </h2>
        {content}
        <div style={{
          marginTop: 22, textAlign: "right",
          fontSize: "0.93rem",
          color: "var(--cch-text-muted)"
        }}>
          Data powered by{" "}
          <a
            href="https://openweathermap.org/"
            tabIndex={-1}
            style={{ color: "var(--primary,#dc0000)" }}
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
