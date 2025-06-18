import React from "react";

// PUBLIC_INTERFACE
function Home() {
  /**
   * Homepage featuring dark theme hero banner and color accent.
   */
  return (
    <div className="cch-content cch-home" style={{ paddingTop: 50 }}>
      <section
        className="cch-section"
        style={{
          background: "var(--cch-surface)",
          textAlign: "center",
          margin: "42px auto 45px auto",
          maxWidth: 630,
          boxShadow: "var(--cch-shadow)",
        }}
      >
        <div
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: 12,
            color: "var(--primary)",
            letterSpacing: 1.1,
          }}
        >
          Welcome to CommunityConnect Hub
        </div>
        <div
          style={{
            color: "var(--cch-text-muted)",
            fontSize: "1.18rem",
            marginBottom: 18,
          }}
        >
          Stay informed. Stay safe. Stay connected.<br />
          Your local resource for news, community events, weather, and emergency contacts.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 22,
          }}
        >
          <span
            style={{
              fontSize: "2.2rem",
              color: "var(--primary)",
              fontWeight: 700,
            }}
            aria-label="Community"
          >
            ●
          </span>
          <span
            style={{
              fontSize: "2.2rem",
              color: "var(--secondary)",
              fontWeight: 700,
            }}
            aria-label="Support"
          >
            ●
          </span>
          <span
            style={{
              fontSize: "2.2rem",
              color: "var(--accent)",
              fontWeight: 700,
            }}
            aria-label="Safety"
          >
            ●
          </span>
        </div>
      </section>
      <div style={{textAlign:'center', margin:"0 0 16px 0", color:"var(--cch-text-muted)"}}>
        © 2024 CommunityConnect Hub | For demonstration purposes only.
      </div>
    </div>
  );
}

export default Home;
