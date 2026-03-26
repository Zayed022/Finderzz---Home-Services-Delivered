import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  User,
  FileText,
  Clock,
  MapPin,
  Phone,
  Download,
  Home,
  ArrowRight,
  Copy,
  CheckCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";

/* ── tiny helpers ────────────────────────────────────────────── */
function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--muted)" }}>
        {label}
      </p>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", fontFamily: mono ? "monospace" : "inherit", fontWeight: mono ? 600 : 400 }}>
        {value}
      </p>
    </div>
  );
}

function DetailCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bs-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: iconBg, border: `1px solid ${iconColor}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={15} color={iconColor} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  /* invalid state */
  if (!state) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "sans-serif" }}>
        <p style={{ color: "#6b7280" }}>Invalid booking data. Please check your bookings page.</p>
        <button onClick={() => navigate("/")} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Go Home
        </button>
      </div>
    );
  }

  const { _id, services, subtotal, extraCharge, totalPrice, areaId, customerDetails, scheduledDate, timeSlot, invoice } = state;

  const formattedDate = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })
    : scheduledDate;

  const shortId = _id?.slice(-8)?.toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        :root {
          --blue:      #1d4ed8;
          --blue-soft: #eff6ff;
          --blue-mid:  #bfdbfe;
          --ink:       #0f172a;
          --ink-soft:  #334155;
          --muted:     #64748b;
          --border:    #e2e8f0;
          --surface:   #f8fafc;
          --white:     #ffffff;
          --green:     #16a34a;
          --green-soft:#f0fdf4;
          --green-mid: #bbf7d0;
          --radius:    16px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04);
          --shadow-md: 0 4px 24px rgba(0,0,0,.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--surface); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(.6); }
          70%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .fade-up { animation: fadeUp .45s ease both; }

        /* hero */
        .bs-hero {
          background: linear-gradient(160deg, #052e16 0%, #064e3b 45%, #065f46 100%);
          padding: 60px 24px 56px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .bs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(74,222,128,.18) 0%, transparent 65%);
        }
        /* decorative rings */
        .bs-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.07);
          pointer-events: none;
        }
        .bs-icon-wrap {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(255,255,255,.12);
          border: 2px solid rgba(255,255,255,.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          animation: popIn .55s cubic-bezier(.34,1.56,.64,1) both;
        }
        .bs-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 38px);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 8px;
          animation: fadeUp .4s ease .1s both;
        }
        .bs-hero-sub {
          font-size: 14px; color: rgba(255,255,255,.7);
          animation: fadeUp .4s ease .18s both;
          margin-bottom: 20px;
        }
        /* booking id pill */
        .bs-id-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 999px;
          padding: 7px 16px;
          font-size: 12.5px; color: rgba(255,255,255,.85);
          cursor: pointer;
          backdrop-filter: blur(6px);
          font-family: 'Outfit', sans-serif;
          transition: background .15s;
          animation: fadeUp .4s ease .25s both;
        }
        .bs-id-pill:hover { background: rgba(255,255,255,.18); }
        .bs-id-pill span { font-weight: 700; letter-spacing: .04em; font-family: monospace; }

        /* status strip */
        .bs-status-strip {
          background: var(--green-soft);
          border-bottom: 1px solid var(--green-mid);
          padding: 10px 24px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: var(--green);
        }

        /* body */
        .bs-body {
          max-width: 1060px; margin: 0 auto;
          padding: 32px 24px 60px;
          display: grid; grid-template-columns: 1fr; gap: 20px;
        }
        @media (min-width: 1024px) {
          .bs-body { grid-template-columns: 1.6fr 1fr; align-items: start; }
          .bs-sidebar { display: block !important; }
        }

        /* cards */
        .bs-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 22px 24px;
          animation: fadeUp .45s ease both;
        }

        /* info grid */
        .bs-info-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        @media (max-width: 480px) { .bs-info-grid { grid-template-columns: 1fr; } }

        /* service rows */
        .bs-service-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          padding: 11px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 13.5px;
        }
        .bs-service-name {
          color: var(--ink-soft); font-weight: 500;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .bs-service-price {
          font-weight: 700; color: var(--ink); white-space: nowrap;
          font-family: 'Playfair Display', serif; font-size: 15px;
        }

        /* invoice card */
        .bs-inv-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          animation: fadeUp .45s ease .05s both;
        }
        .bs-inv-top { padding: 20px 22px 16px; border-bottom: 1px solid var(--border); }
        .bs-inv-bottom { padding: 18px 22px; }
        .bs-inv-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: var(--ink-soft); padding: 5px 0;
        }
        .bs-inv-row span:last-child { font-weight: 600; color: var(--ink); }
        .bs-total-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-top: 12px; border-top: 1px solid var(--border); margin-top: 8px;
        }
        .bs-total-label { font-size: 15px; font-weight: 700; color: var(--ink); }
        .bs-total-amt {
          font-family: 'Playfair Display', serif;
          font-size: 28px; color: var(--green); letter-spacing: -.4px;
        }
        .bs-total-amt sup {
          font-size: 14px; vertical-align: super;
          font-family: 'Outfit', sans-serif; font-weight: 600;
        }

        /* buttons */
        .bs-btn-primary {
          width: 100%; padding: 13px;
          background: var(--blue); color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s, transform .1s;
          margin-top: 14px;
        }
        .bs-btn-primary:hover { background: #1e40af; transform: translateY(-1px); }
        .bs-btn-primary:active { transform: translateY(0); }
        .bs-btn-secondary {
          width: 100%; padding: 11px;
          background: var(--surface); color: var(--ink-soft);
          border: 1px solid var(--border); border-radius: 10px;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background .13s, border-color .13s;
          text-decoration: none; margin-top: 10px;
        }
        .bs-btn-secondary:hover { background: var(--border); border-color: #cbd5e1; }

        /* trust */
        .bs-trust { display: flex; flex-direction: column; gap: 7px; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 14px; }
        .bs-trust-line { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="bs-hero">
        {/* rings */}
        <div className="bs-ring" style={{ width: 420, height: 420, top: -160, right: -140 }} />
        <div className="bs-ring" style={{ width: 280, height: 280, bottom: -120, left: -80 }} />

        <div className="bs-icon-wrap">
          <CheckCircle2 size={38} color="#4ade80" strokeWidth={2} />
        </div>

        <h1 className="bs-hero-title">Booking Confirmed!</h1>
        <p className="bs-hero-sub">Your service has been successfully scheduled. We'll send updates via SMS.</p>

        <button className="bs-id-pill" onClick={handleCopy}>
          Booking ID: <span>#{shortId}</span>
          {copied
            ? <CheckCheck size={13} color="#4ade80" />
            : <Copy size={12} color="rgba(255,255,255,.6)" />
          }
        </button>
      </div>

      {/* ── STATUS STRIP ───────────────────────────── */}
      <div className="bs-status-strip">
        <CheckCircle2 size={15} />
        Confirmed — a professional will be assigned shortly
      </div>

      {/* ── BODY ───────────────────────────────────── */}
      <div className="bs-body">

        {/* ═══ LEFT ═══════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Customer + Schedule */}
          <div className="bs-card" style={{ animationDelay: "60ms" }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
              Booking details
            </p>
            <div className="bs-info-grid">
              <InfoRow label="Customer Name" value={customerDetails?.name} />
              <InfoRow label="Phone" value={customerDetails?.phone} icon={Phone} />
              <InfoRow
                label="Scheduled Date"
                value={formattedDate}
              />
              <InfoRow label="Time Slot" value={timeSlot} />
              {areaId?.name && <InfoRow label="Service Area" value={areaId.name} />}
              <InfoRow label="Booking ID" value={`#${shortId}`} mono />
            </div>
          </div>

          {/* Services */}
          <div className="bs-card" style={{ animationDelay: "100ms" }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
              Services booked · {services?.length} item{services?.length > 1 ? "s" : ""}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {services?.map((item, i) => {
                const name = item.subServiceId?.name || item.serviceId?.name || item.name || "Service";
                return (
                  <div key={i} className="bs-service-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: ".05em",
                        padding: "2px 8px", borderRadius: 999,
                        background: item.bookingType === "inspection" ? "#fffbeb" : "var(--blue-soft)",
                        color: item.bookingType === "inspection" ? "#d97706" : "var(--blue)",
                        border: `1px solid ${item.bookingType === "inspection" ? "#fcd34d" : "var(--blue-mid)"}`,
                        flexShrink: 0, textTransform: "capitalize",
                      }}>
                        {item.bookingType}
                      </span>
                      <span className="bs-service-name">{name} × {item.quantity}</span>
                    </div>
                    <span className="bs-service-price">₹{item.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What happens next */}
          <div className="bs-card" style={{ animationDelay: "140ms", background: "linear-gradient(135deg, var(--green-soft) 0%, #fff 100%)", borderColor: "var(--green-mid)" }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--green)", marginBottom: 14 }}>
              What happens next?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                [Zap,          "#d97706", "#fffbeb", "Professional assigned",    "We'll match you with a verified expert shortly."],
                [Phone,        "var(--blue)", "var(--blue-soft)", "Confirmation call", "Our team will call to confirm your appointment time."],
                [CheckCircle2, "var(--green)", "var(--green-soft)", "Service completed",  "Your service is performed with a 30-day guarantee."],
              ].map(([Icon, ic, ib, title, desc], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: ib, border: `1px solid ${ic}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon size={13} color={ic} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{title}</p>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ═══ SIDEBAR ════════════════════════════ */}
        <div className="bs-sidebar" style={{ display: "none" }}>
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Invoice */}
            <div className="bs-inv-card">
              <div className="bs-inv-top">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-soft)", border: "1px solid var(--blue-mid)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={14} color="var(--blue)" />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Payment Summary</p>
                </div>

                <div className="bs-inv-row">
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>Service charges</span>
                  <span>₹{subtotal}</span>
                </div>
                {extraCharge > 0 && (
                  <div className="bs-inv-row">
                    <span style={{ color: "var(--muted)", fontWeight: 400 }}>Area charge ({areaId?.name})</span>
                    <span>₹{extraCharge}</span>
                  </div>
                )}

                <div className="bs-total-row">
                  <span className="bs-total-label">Total Paid</span>
                  <span className="bs-total-amt"><sup>₹</sup>{totalPrice}</span>
                </div>
              </div>

              <div className="bs-inv-bottom">
                {invoice?.invoiceUrl && (
                  <a
                    href={`https://finderzz-home-services-delivered.onrender.com${invoice.invoiceUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bs-btn-secondary"
                  >
                    <Download size={14} /> Download Invoice
                  </a>
                )}

                <button className="bs-btn-primary" onClick={() => navigate("/")}>
                  <Home size={15} /> Back to Home <ArrowRight size={14} />
                </button>

                <div className="bs-trust">
                  <div className="bs-trust-line"><ShieldCheck size={13} color="var(--green)" /> Verified professional assigned</div>
                  <div className="bs-trust-line"><CheckCircle2 size={13} color="var(--green)" /> 30-day service guarantee</div>
                  <div className="bs-trust-line"><Zap size={13} color="#d97706" /> Updates via SMS / Call</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE invoice + CTA ───────────────────── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px 60px" }} className="bs-sidebar-mobile">
        <style>{`@media (min-width: 1024px) { .bs-sidebar-mobile { display: none; } }`}</style>

        <div className="bs-inv-card" style={{ marginBottom: 16 }}>
          <div className="bs-inv-top">
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
              Payment summary
            </p>
            <div className="bs-inv-row">
              <span style={{ color: "var(--muted)", fontWeight: 400 }}>Service charges</span>
              <span>₹{subtotal}</span>
            </div>
            {extraCharge > 0 && (
              <div className="bs-inv-row">
                <span style={{ color: "var(--muted)", fontWeight: 400 }}>Area charge</span>
                <span>₹{extraCharge}</span>
              </div>
            )}
            <div className="bs-total-row">
              <span className="bs-total-label">Total Paid</span>
              <span className="bs-total-amt"><sup>₹</sup>{totalPrice}</span>
            </div>
          </div>
          <div className="bs-inv-bottom">
            {invoice?.invoiceUrl && (
              <a
                href={`https://finderzz-home-services-delivered.onrender.com${invoice.invoiceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bs-btn-secondary"
              >
                <Download size={14} /> Download Invoice
              </a>
            )}
            <button className="bs-btn-primary" onClick={() => navigate("/")}>
              <Home size={15} /> Back to Home <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}