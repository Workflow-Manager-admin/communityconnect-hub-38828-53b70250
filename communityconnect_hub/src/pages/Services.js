import React from "react";

// PUBLIC_INTERFACE
function Services() {
  /**
   * Services page - demo content, modern card layout, dark themed.
   */
  const services = [
    {
      name: "Lost & Found",
      desc: "Report and search for lost items in your neighborhood.",
      icon: "🔎",
    },
    {
      name: "Community Bulletin Board",
      desc: "Post announcements or needs to connect with neighbors.",
      icon: "📌",
    },
    {
      name: "City Hall Concierge",
      desc: "Quick guidance on city forms, permits, and assistance lines.",
      icon: "🏛️",
    },
  ];
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 className="cch-section-title" style={{ color: "var(--accent)" }}>
          Community Services
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {services.map((srv, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--cch-bg, #151622)",
                borderLeft: "4px solid var(--accent)",
                borderRadius: 7,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 2,
                boxShadow: "var(--cch-shadow, 0 2px 10px rgba(0,0,0,0.13))",
              }}
            >
              <span style={{ fontSize: "2rem" }} aria-label={srv.name}>
                {srv.icon}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "1.10rem", marginBottom: 4, color: "var(--accent)" }}>
                  {srv.name}
                </div>
                <div style={{ color: "var(--cch-text-muted)", fontSize: "1rem" }}>{srv.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
