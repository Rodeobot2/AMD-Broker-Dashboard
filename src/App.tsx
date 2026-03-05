import { useState, useEffect } from "react";

// ── Lucide-style inline SVGs to avoid import issues ──────────────────────────
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id: 1, name: "Oak Street Commercial", units: 24, filled: 22, price: "$1.2M", status: "active", agent: "Sarah Johnson", type: "Commercial" },
  { id: 2, name: "Maple Heights", units: 12, filled: 11, price: "$845K", status: "active", agent: "Michael Chen", type: "Residential" },
  { id: 3, name: "Sunset Villa", units: 8, filled: 8, price: "$2.1M", status: "closed", agent: "Emma Davis", type: "Luxury" },
  { id: 4, name: "Pine Ridge Commercial #2B", units: 36, filled: 32, price: "$3.4M", status: "active", agent: "Robert Wilson", type: "Commercial" },
  { id: 5, name: "Harbor View", units: 16, filled: 15, price: "$1.8M", status: "active", agent: "Sarah Johnson", type: "Waterfront" },
  { id: 6, name: "Downtown Loft Complex", units: 20, filled: 14, price: "$950K", status: "pending", agent: "Michael Chen", type: "Mixed Use" },
  { id: 7, name: "Westfield Plaza", units: 30, filled: 28, price: "$4.2M", status: "active", agent: "Emma Davis", type: "Commercial" },
  { id: 8, name: "Riverside Estates", units: 10, filled: 7, price: "$1.5M", status: "review", agent: "Robert Wilson", type: "Residential" },
];

const CLIENTS = [
  { id: 1, name: "Sarah Johnson", email: "sarah@amdbrokers.com", listings: 12, revenue: "$128K", status: "active", joined: "Jan 2023" },
  { id: 2, name: "Michael Chen", email: "mchen@amdbrokers.com", listings: 8, revenue: "$94K", status: "active", joined: "Mar 2023" },
  { id: 3, name: "Emma Davis", email: "edavis@amdbrokers.com", listings: 15, revenue: "$201K", status: "active", joined: "Nov 2022" },
  { id: 4, name: "Robert Wilson", email: "rwilson@amdbrokers.com", listings: 6, revenue: "$72K", status: "inactive", joined: "Jun 2023" },
  { id: 5, name: "Jennifer Park", email: "jpark@amdbrokers.com", listings: 9, revenue: "$115K", status: "active", joined: "Feb 2023" },
  { id: 6, name: "David Martinez", email: "dmartinez@amdbrokers.com", listings: 4, revenue: "$48K", status: "pending", joined: "Aug 2023" },
];

const ACTIVITY = [
  { id: 1, avatar: "SJ", color: "#8B1A2B", title: "New listing added", tag: "pending", tagColor: "#E8A020", desc: "Oak Street Commercial – 24 units", name: "Sarah Johnson", time: "2 hours ago" },
  { id: 2, avatar: "MC", color: "#8B1A2B", title: "Payment received", tag: "completed", tagColor: "#1A8B4A", desc: "$2,850 — Maple Heights deal closed", name: "Michael Chen", time: "5 hours ago" },
  { id: 3, avatar: "ED", color: "#6B2A8B", title: "Document review needed", tag: "review", tagColor: "#8B6A1A", desc: "Inspection report – Sunset Villa", name: "Emma Davis", time: "1 day ago" },
  { id: 4, avatar: "RW", color: "#1A4A8B", title: "Listing agreement signed", tag: "completed", tagColor: "#1A8B4A", desc: "Pine Ridge Commercial #2B", name: "Robert Wilson", time: "2 days ago" },
  { id: 5, avatar: "JP", color: "#1A7A4A", title: "Client onboarded", tag: "new", tagColor: "#1A5A8B", desc: "Jennifer Park added to portfolio", name: "Jennifer Park", time: "3 days ago" },
  { id: 6, avatar: "SJ", color: "#8B1A2B", title: "Price adjustment", tag: "updated", tagColor: "#6B1A8B", desc: "Harbor View reduced to $1.8M", name: "Sarah Johnson", time: "4 days ago" },
];

const DOCUMENTS = [
  { id: 1, name: "Oak Street Inspection Report.pdf", type: "Inspection", listing: "Oak Street Commercial", date: "Mar 1, 2026", status: "pending", size: "2.4 MB" },
  { id: 2, name: "Maple Heights Purchase Agreement.pdf", type: "Agreement", listing: "Maple Heights", date: "Feb 28, 2026", status: "signed", size: "1.1 MB" },
  { id: 3, name: "Sunset Villa Closing Docs.zip", type: "Closing", listing: "Sunset Villa", date: "Feb 25, 2026", status: "completed", size: "8.7 MB" },
  { id: 4, name: "Pine Ridge Listing Agreement.pdf", type: "Agreement", listing: "Pine Ridge Commercial #2B", date: "Feb 20, 2026", status: "signed", size: "0.9 MB" },
  { id: 5, name: "Harbor View Appraisal.pdf", type: "Appraisal", listing: "Harbor View", date: "Feb 18, 2026", status: "review", size: "3.2 MB" },
];

const MEETINGS = [
  { id: 1, title: "Oak Street Walkthrough", client: "Sarah Johnson", date: "Mar 5, 2026", time: "10:00 AM", location: "On-site", status: "upcoming" },
  { id: 2, title: "Maple Heights Closing", client: "Michael Chen", date: "Mar 7, 2026", time: "2:00 PM", location: "Office", status: "upcoming" },
  { id: 3, title: "Pine Ridge Inspection", client: "Robert Wilson", date: "Mar 10, 2026", time: "11:30 AM", location: "On-site", status: "upcoming" },
  { id: 4, title: "Harbor View Showing", client: "Sarah Johnson", date: "Mar 12, 2026", time: "3:00 PM", location: "On-site", status: "upcoming" },
  { id: 5, title: "Q1 Portfolio Review", client: "All Agents", date: "Mar 15, 2026", time: "9:00 AM", location: "Boardroom", status: "upcoming" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fillPct = (l) => Math.round((l.filled / l.units) * 100);
const statusColors = {
  active: { bg: "#E8F5EE", text: "#1A7A40" },
  closed: { bg: "#EEE8F5", text: "#5A1A7A" },
  pending: { bg: "#FFF3E0", text: "#E8A020" },
  review: { bg: "#FFF8E1", text: "#8B6A1A" },
  completed: { bg: "#E8F5EE", text: "#1A7A40" },
  signed: { bg: "#E8F0FF", text: "#1A3A8B" },
  new: { bg: "#E8F0FF", text: "#1A3A8B" },
  updated: { bg: "#F0E8FF", text: "#6B1A8B" },
  inactive: { bg: "#F5E8E8", text: "#7A1A1A" },
  upcoming: { bg: "#E8F0FF", text: "#1A3A8B" },
};
const sc = (s) => statusColors[s] || { bg: "#F0F0F0", text: "#666" };

// ── Sub-components ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, change, icon }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", flex: 1, minWidth: 160, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0ECEC" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ background: "#F8F3F3", borderRadius: 8, padding: 8, color: "#8B1A2B" }}>{icon}</div>
      <span style={{ fontSize: 12, color: "#1A7A40", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
        <span>↗</span>{change}
      </span>
    </div>
    <div style={{ marginTop: 16, fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", marginTop: 4, fontFamily: "'Georgia', serif" }}>{value}</div>
  </div>
);

const Badge = ({ status }) => {
  const { bg, text } = sc(status);
  return (
    <span style={{ background: bg, color: text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
      {status}
    </span>
  );
};

const FillBar = ({ pct }) => (
  <div style={{ background: "#F0ECEC", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, background: pct === 100 ? "#1A7A40" : "#8B1A2B", height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
  </div>
);

const Avatar = ({ initials, color = "#8B1A2B", size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.34, flexShrink: 0, fontFamily: "Georgia, serif" }}>
    {initials}
  </div>
);

// ── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    onClick={onClose}>
    <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 520, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#999", lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const FormField = ({ label, type = "text", value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E0E0", borderRadius: 8, fontSize: 14, color: "#1A1A1A", background: "#fff", outline: "none" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E0E0", borderRadius: 8, fontSize: 14, color: "#1A1A1A", outline: "none", boxSizing: "border-box" }} />
    )}
  </div>
);

// ── PAGES ────────────────────────────────────────────────────────────────────

// Dashboard
const DashboardPage = ({ listings, activity, onViewAll }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 800, color: "#1A1A1A" }}>Dashboard</h1>
        <p style={{ margin: "6px 0 0", color: "#888", fontSize: 14 }}>Welcome back — here's your portfolio overview</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onViewAll} style={{ border: "1.5px solid #D0C8C8", background: "#fff", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#444", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={15} /> View All
        </button>
        <button style={{ background: "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          + Quick Add
        </button>
      </div>
    </div>

    <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
      <StatCard label="Total Listings" value="247" change="+4.9% vs last month"
        icon={<Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" size={18} />} />
      <StatCard label="Active Clients" value="89" change="+3.4% vs last month"
        icon={<Icon d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} size={18} />} />
      <StatCard label="Monthly Revenue" value="$342,890" change="+8.2% vs last month"
        icon={<Icon d={["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} size={18} />} />
      <StatCard label="Closing Rate" value="94.2%" change="+2.1% vs last month"
        icon={<Icon d={["M22 12h-4l-3 9L9 3l-3 9H2"]} size={18} />} />
    </div>

    <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
      {/* Recent Activity */}
      <div style={{ flex: 2, background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #F0ECEC", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, fontFamily: "Georgia, serif" }}>Recent Activity</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#999" }}>Latest updates across your portfolio</p>
          </div>
          <button style={{ background: "none", border: "1.5px solid #D0C8C8", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#444" }}>View All</button>
        </div>
        {activity.slice(0, 5).map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #F8F4F4" }}>
            <Avatar initials={a.avatar} color={a.color} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{a.title}</span>
                <Badge status={a.tag} />
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{a.desc}</div>
              <div style={{ fontSize: 11, color: "#BBB", marginTop: 2 }}>{a.name}</div>
            </div>
            <span style={{ fontSize: 11, color: "#BBB", whiteSpace: "nowrap" }}>{a.time}</span>
          </div>
        ))}
      </div>

      {/* Listing Activity */}
      <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #F0ECEC", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, fontFamily: "Georgia, serif" }}>Listing Activity</h3>
        <p style={{ margin: "0 0 20px", fontSize: 12, color: "#999" }}>Current fill rates</p>
        {listings.slice(0, 5).map(l => (
          <div key={l.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{l.name}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: fillPct(l) === 100 ? "#1A7A40" : "#8B1A2B" }}>{fillPct(l)}%</span>
            </div>
            <FillBar pct={fillPct(l)} />
            <div style={{ fontSize: 11, color: "#BBB", marginTop: 3 }}>{l.filled}/{l.units} units</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Listings
const ListingsPage = ({ listings, onAdd }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = listings.filter(l =>
    (filter === "all" || l.status === filter) &&
    l.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800 }}>Listings</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>{listings.length} total properties</p>
        </div>
        <button onClick={onAdd} style={{ background: "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Add Listing</button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings…"
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", border: "1.5px solid #E8E0E0", borderRadius: 8, fontSize: 14, outline: "none" }} />
        {["all", "active", "pending", "closed", "review"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              borderColor: filter === s ? "#8B1A2B" : "#E0DADA", background: filter === s ? "#8B1A2B" : "#fff", color: filter === s ? "#fff" : "#555" }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #F0ECEC", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAF7F7" }}>
              {["Property", "Type", "Units", "Fill Rate", "Price", "Agent", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={l.id} style={{ borderTop: "1px solid #F5F0F0", background: i % 2 === 0 ? "#fff" : "#FDFBFB" }}>
                <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{l.name}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{l.type}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{l.filled}/{l.units}</td>
                <td style={{ padding: "14px 16px", minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FillBar pct={fillPct(l)} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#8B1A2B", minWidth: 32 }}>{fillPct(l)}%</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{l.price}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{l.agent}</td>
                <td style={{ padding: "14px 16px" }}><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Clients
const ClientsPage = ({ clients, onAdd }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800 }}>Clients</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>{clients.length} registered agents & clients</p>
      </div>
      <button onClick={onAdd} style={{ background: "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Add Client</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {clients.map(c => (
        <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #F0ECEC", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Avatar initials={c.name.split(" ").map(n => n[0]).join("")} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{c.email}</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Badge status={c.status} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: "#FAF7F7", borderRadius: 8, padding: 12 }}>
            {[["Listings", c.listings], ["Revenue", c.revenue], ["Joined", c.joined]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#8B1A2B", fontFamily: "Georgia, serif" }}>{v}</div>
                <div style={{ fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Documents
const DocumentsPage = ({ docs }) => {
  const [selected, setSelected] = useState([]);
  const [printed, setPrinted] = useState(false);

  const allSelected = selected.length === docs.length;

  const toggleAll = () => setSelected(allSelected ? [] : docs.map(d => d.id));
  const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handlePrintAll = () => {
    const selectedDocs = docs.filter(d => selected.includes(d.id));
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>AMD Custom Business Brokers — Document Print</title>
          <style>
            body { font-family: Georgia, serif; padding: 40px; color: #1A1A1A; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            .subtitle { color: #888; font-size: 13px; margin-bottom: 32px; font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; padding: 8px 12px; border-bottom: 2px solid #E0DADA; }
            td { padding: 12px; border-bottom: 1px solid #F0ECEC; font-size: 13px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; background: #F0ECEC; color: #8B1A2B; }
            .footer { margin-top: 40px; font-size: 11px; color: #BBB; font-family: sans-serif; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>AMD Custom Business Brokers</h1>
          <div class="subtitle">Document Package — Printed ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · ${selectedDocs.length} document${selectedDocs.length !== 1 ? "s" : ""}</div>
          <table>
            <thead><tr><th>#</th><th>Document Name</th><th>Type</th><th>Listing</th><th>Date</th><th>Size</th><th>Status</th></tr></thead>
            <tbody>
              ${selectedDocs.map((d, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${d.name}</strong></td>
                  <td>${d.type}</td>
                  <td>${d.listing}</td>
                  <td>${d.date}</td>
                  <td>${d.size}</td>
                  <td><span class="badge">${d.status}</span></td>
                </tr>`).join("")}
            </tbody>
          </table>
          <div class="footer">Generated by AMD Custom Business Brokers SaaS Platform</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2500);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800 }}>Documents</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>{docs.length} files in your portfolio</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {selected.length > 0 && (
            <button onClick={handlePrintAll}
              style={{ background: printed ? "#1A7A40" : "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.3s" }}>
              <Icon d="M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z" size={15} stroke="#fff" />
              {printed ? "Sent to Printer!" : `Print Selected (${selected.length})`}
            </button>
          )}
          <button style={{ background: "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Upload</button>
        </div>
      </div>

      {/* Select all bar */}
      <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", border: "1px solid #F0ECEC", borderBottom: "none", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <input type="checkbox" checked={allSelected} onChange={toggleAll}
          style={{ width: 16, height: 16, accentColor: "#8B1A2B", cursor: "pointer" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {selected.length === 0 ? "Select All" : `${selected.length} of ${docs.length} selected`}
        </span>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])}
            style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 12, color: "#AAA", cursor: "pointer", fontWeight: 600 }}>
            Clear selection
          </button>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", border: "1px solid #F0ECEC", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {docs.map((d, i) => {
          const isSelected = selected.includes(d.id);
          return (
            <div key={d.id} onClick={() => toggleOne(d.id)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < docs.length - 1 ? "1px solid #F5F0F0" : "none", cursor: "pointer", background: isSelected ? "#FDF5F6" : "#fff", transition: "background 0.15s" }}>
              <input type="checkbox" checked={isSelected} onChange={() => toggleOne(d.id)}
                onClick={e => e.stopPropagation()}
                style={{ width: 16, height: 16, accentColor: "#8B1A2B", cursor: "pointer", flexShrink: 0 }} />
              <div style={{ background: isSelected ? "#F8E8EA" : "#F8F3F3", borderRadius: 8, padding: 10, color: "#8B1A2B", transition: "background 0.15s" }}>
                <Icon d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{d.listing} · {d.type} · {d.size}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge status={d.status} />
                <div style={{ fontSize: 11, color: "#BBB", marginTop: 4 }}>{d.date}</div>
              </div>
              <button onClick={e => e.stopPropagation()}
                style={{ background: "none", border: "1.5px solid #E0DADA", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#555" }}>
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Meetings
const MeetingsPage = ({ meetings }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800 }}>Meetings</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>{meetings.length} scheduled</p>
      </div>
      <button style={{ background: "#8B1A2B", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Schedule</button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {meetings.map(m => (
        <div key={m.id} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #F0ECEC", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ background: "#8B1A2B", borderRadius: 10, padding: "10px 14px", textAlign: "center", color: "#fff", minWidth: 52 }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Georgia, serif", lineHeight: 1 }}>{m.date.split(" ")[1].replace(",", "")}</div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>{m.date.split(" ")[0].toUpperCase()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{m.title}</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{m.client} · {m.time} · {m.location}</div>
          </div>
          <Badge status={m.status} />
        </div>
      ))}
    </div>
  </div>
);

// Financial
const FinancialPage = () => {
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const revenue = [210000, 245000, 290000, 318000, 295000, 342890, 0];
  const maxRev = Math.max(...revenue.filter(Boolean));
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800 }}>Financial</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>Revenue & performance overview</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[["YTD Revenue", "$1.7M", "+12.4%"], ["Avg Deal Size", "$148K", "+6.1%"], ["Commission Earned", "$51K", "+9.2%"], ["Pending Payments", "$12.4K", ""]].map(([l, v, c]) => (
          <div key={l} style={{ flex: 1, minWidth: 160, background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #F0ECEC", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", marginTop: 6, fontFamily: "Georgia, serif" }}>{v}</div>
            {c && <div style={{ fontSize: 12, color: "#1A7A40", fontWeight: 600, marginTop: 4 }}>↗ {c}</div>}
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, border: "1px solid #F0ECEC", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 24px", fontFamily: "Georgia, serif", fontSize: 16 }}>Monthly Revenue Trend</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180 }}>
          {months.map((m, i) => {
            const h = revenue[i] ? Math.round((revenue[i] / maxRev) * 160) : 0;
            const isCurrent = i === 5;
            return (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {revenue[i] > 0 && <div style={{ fontSize: 10, color: isCurrent ? "#8B1A2B" : "#AAA", fontWeight: isCurrent ? 700 : 400 }}>
                  ${(revenue[i] / 1000).toFixed(0)}K
                </div>}
                <div style={{ width: "100%", height: h || 4, background: isCurrent ? "#8B1A2B" : revenue[i] ? "#F0C8CE" : "#F0F0F0", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease" }} />
                <div style={{ fontSize: 11, color: isCurrent ? "#8B1A2B" : "#AAA", fontWeight: isCurrent ? 700 : 400 }}>{m}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [listings, setListings] = useState(LISTINGS);
  const [clients, setClients] = useState(CLIENTS);
  const [activity] = useState(ACTIVITY);
  const [modal, setModal] = useState(null); // "addListing" | "addClient" | null
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);

  // New listing form state
  const [newListing, setNewListing] = useState({ name: "", type: "Commercial", units: "", price: "", agent: "Sarah Johnson", status: "pending" });
  const [newClient, setNewClient] = useState({ name: "", email: "", status: "active" });

  const addListing = () => {
    if (!newListing.name || !newListing.units) return;
    setListings(prev => [...prev, { id: Date.now(), ...newListing, units: parseInt(newListing.units), filled: 0 }]);
    setModal(null);
    setNewListing({ name: "", type: "Commercial", units: "", price: "", agent: "Sarah Johnson", status: "pending" });
  };

  const addClient = () => {
    if (!newClient.name) return;
    setClients(prev => [...prev, { id: Date.now(), ...newClient, listings: 0, revenue: "$0", joined: "Mar 2026" }]);
    setModal(null);
    setNewClient({ name: "", email: "", status: "active" });
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    { id: "listings", label: "Listings", d: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" },
    { id: "clients", label: "Clients", d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
    { id: "documents", label: "Documents", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" },
    { id: "workorders", label: "Work Orders", d: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
    { id: "meetings", label: "Meetings", d: "M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.893L15 14v-4z M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z", zoom: true },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F5F0F0", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: 212, background: "#1C1A1A", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #2E2A2A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#8B1A2B", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, fontFamily: "Georgia, serif" }}>A</span>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 11, letterSpacing: 1.5, lineHeight: 1 }}>AMD CUSTOM</div>
              <div style={{ color: "#8B1A2B", fontWeight: 700, fontSize: 9, letterSpacing: 2, lineHeight: 1.4, textTransform: "uppercase" }}>Business Brokers</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
          {navItems.map(n => n.zoom ? (
            <a key={n.id} href="https://us02web.zoom.us/j/89994092602" target="_blank" rel="noreferrer"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2, textDecoration: "none",
                background: "transparent", color: "#999", fontWeight: 500, fontSize: 14, transition: "all 0.15s" }}>
              <Icon d={n.d} size={16} stroke="#777" />
              {n.label}
              <Icon d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" size={11} stroke="#555" />
            </a>
          ) : (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
                background: page === n.id ? "#8B1A2B" : "transparent",
                color: page === n.id ? "#fff" : "#999", fontWeight: page === n.id ? 700 : 500, fontSize: 14, transition: "all 0.15s" }}>
              <Icon d={n.d} size={16} stroke={page === n.id ? "#fff" : "#777"} />
              {n.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 16px 20px", borderTop: "1px solid #2E2A2A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar initials="JA" size={34} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>John Agent</div>
              <div style={{ color: "#777", fontSize: 11 }}>AMD Broker</div>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", padding: "4px 0" }}>
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} stroke="#666" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #EDE8E8", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1A7A40" }} />
            <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>All systems operational</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[["247", "Listings", "#1A1A1A"], ["$342.8K", "Revenue", "#8B1A2B"], ["94.2%", "Close Rate", "#1A1A1A"]].map(([v, l, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: "Georgia, serif", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10, color: "#BBB", textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
              </div>
            ))}
            <div style={{ position: "relative" }}>
              <button onClick={() => { setNotifOpen(!notifOpen); setNotifCount(0); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", position: "relative", display: "flex", alignItems: "center" }}>
                <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" size={20} />
                {notifCount > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: "#8B1A2B", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifCount}</span>}
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 34, background: "#fff", borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", padding: 16, width: 280, zIndex: 100, border: "1px solid #EDE8E8" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: "#1A1A1A" }}>Notifications</div>
                  {ACTIVITY.slice(0, 3).map(a => (
                    <div key={a.id} style={{ padding: "8px 0", borderBottom: "1px solid #F5F0F0", fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: "#1A1A1A" }}>{a.title}</div>
                      <div style={{ color: "#AAA", marginTop: 2 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Avatar initials="JA" size={32} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }} onClick={() => notifOpen && setNotifOpen(false)}>
          {page === "dashboard" && <DashboardPage listings={listings} activity={activity} onViewAll={() => setPage("listings")} />}
          {page === "listings" && <ListingsPage listings={listings} onAdd={() => setModal("addListing")} />}
          {page === "clients" && <ClientsPage clients={clients} onAdd={() => setModal("addClient")} />}
          {page === "documents" && <DocumentsPage docs={DOCUMENTS} />}
          {page === "workorders" && (
            <div style={{ textAlign: "center", paddingTop: 80, color: "#888" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Work Orders</h2>
              <p>Work order management coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "addListing" && (
        <Modal title="Add New Listing" onClose={() => setModal(null)}>
          <FormField label="Property Name" value={newListing.name} onChange={v => setNewListing(p => ({ ...p, name: v }))} />
          <FormField label="Type" value={newListing.type} onChange={v => setNewListing(p => ({ ...p, type: v }))} options={["Commercial", "Residential", "Luxury", "Waterfront", "Mixed Use"]} />
          <FormField label="Total Units" type="number" value={newListing.units} onChange={v => setNewListing(p => ({ ...p, units: v }))} />
          <FormField label="Price" value={newListing.price} onChange={v => setNewListing(p => ({ ...p, price: v }))} />
          <FormField label="Assigned Agent" value={newListing.agent} onChange={v => setNewListing(p => ({ ...p, agent: v }))} options={CLIENTS.map(c => c.name)} />
          <FormField label="Status" value={newListing.status} onChange={v => setNewListing(p => ({ ...p, status: v }))} options={["active", "pending", "review", "closed"]} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", border: "1.5px solid #E0DADA", borderRadius: 8, background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14, color: "#444" }}>Cancel</button>
            <button onClick={addListing} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#8B1A2B", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Add Listing</button>
          </div>
        </Modal>
      )}
      {modal === "addClient" && (
        <Modal title="Add New Client" onClose={() => setModal(null)}>
          <FormField label="Full Name" value={newClient.name} onChange={v => setNewClient(p => ({ ...p, name: v }))} />
          <FormField label="Email" type="email" value={newClient.email} onChange={v => setNewClient(p => ({ ...p, email: v }))} />
          <FormField label="Status" value={newClient.status} onChange={v => setNewClient(p => ({ ...p, status: v }))} options={["active", "pending", "inactive"]} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", border: "1.5px solid #E0DADA", borderRadius: 8, background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14, color: "#444" }}>Cancel</button>
            <button onClick={addClient} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#8B1A2B", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Add Client</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
