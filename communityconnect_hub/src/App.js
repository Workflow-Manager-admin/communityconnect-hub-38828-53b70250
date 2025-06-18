import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import News from "./pages/News";
import Events from "./pages/Events";
import Services from "./pages/Services";
import Emergency from "./pages/Emergency";

/**
 * Main App entry. Handles routing and top-level layout.
 */
function App() {
  return (
    <Router>
      <div className="app" style={{ background: "var(--cch-bg,#151622)", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/services" element={<Services />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;