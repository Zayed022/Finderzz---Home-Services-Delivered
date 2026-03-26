import { useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Search,
  Wrench,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

/* ─── small reusable pieces ──────────────────────────────────── */
function CheckItem({ icon: Icon, iconColor = "#16a34a", children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <Icon size={15} color={iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="id-card">
      {label && (
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function InspectionDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  /* invalid state guard */
  if (!state) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <AlertCircle size={32} color="#f59e0b" />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Invalid inspection data. Please go back and try again.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 8, fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Go back
        </button>
      </div>
    );
  }

  const { serviceId, name, price, description, duration } = state;

  const item = cartItems.find(
    (i) => i.serviceId === serviceId && i.bookingType === "inspection"
  );
  const cartTotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);

  const benefits = [
    { icon: Search,       text: "Accurate problem diagnosis before any work begins" },
    { icon: Wrench,       text: "Avoid unnecessary or costly repairs" },
    { icon: BadgeCheck,   text: "Expert recommendations you can trust" },
    { icon: CheckCircle2, text: "Transparent pricing — no hidden charges" },
  ];

  const trustPoints = [
    { icon: ShieldCheck, color: "#16a34a", text: "Background-verified professionals" },
    { icon: CheckCircle2,color: "#16a34a", text: "30-day service guarantee on all work" },
    { icon: Zap,         color: "#d97706", text: "Instant booking confirmation" },
    { icon: Star,        color: "#d97706", text: "4.7 avg. rating across 2,000+ bookings" },
  ];

  return (
    <>
      <Helmet>
        <title>{name} Inspection | Finderzz</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        :root {
          --amber:      #d97706;
          --amber-soft: #fffbeb;
          --amber-mid:  #fde68a;
          --amber-border: #fcd34d;
          --blue:       #1d4ed8;
          --blue-soft:  #eff6ff;
          --blue-mid:   #bfdbfe;
          --ink:        #0f172a;
          --ink-soft:   #334155;
          --muted:      #64748b;
          --border:     #e2e8f0;
          --surface:    #f8fafc;
          --white:      #ffffff;
          --green:      #16a34a;
          --radius:     16px;
          --shadow-sm:  0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.05);
          --shadow-md:  0 4px 24px rgba(0,0,0,.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .id-anim { animation: fadeUp .45s ease both; }

        /* hero */
        .id-hero {
          position: relative;
          height: 320px;
          overflow: hidden;
          background: linear-gradient(135deg, #78350f 0%, #b45309 40%, #d97706 75%, #fbbf24 100%);
        }
        .id-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 75% 40%, rgba(255,255,255,.18) 0%, transparent 60%);
        }
        /* decorative circles */
        .id-hero::after {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.12);
        }
        .id-hero-ring {
          position: absolute;
          bottom: -120px;
          left: -60px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.08);
          pointer-events: none;
        }
        .id-back-btn {
          position: absolute;
          top: 22px;
          left: 22px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,.85);
          background: rgba(0,0,0,.2);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 10px;
          padding: 8px 14px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          font-family: 'Outfit', sans-serif;
          transition: background .15s;
        }
        .id-back-btn:hover { background: rgba(0,0,0,.35); }
        .id-hero-tag {
          position: absolute;
          top: 22px;
          right: 22px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: #78350f;
          background: rgba(255,255,255,.9);
          border-radius: 999px;
          padding: 5px 12px;
        }
        .id-hero-content {
          position: absolute;
          bottom: 32px;
          left: 32px;
          right: 32px;
        }
        .id-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 40px);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 14px;
          text-shadow: 0 2px 12px rgba(0,0,0,.2);
        }
        .id-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: rgba(255,255,255,.82);
        }
        .id-hero-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* body */
        .id-body {
          max-width: 1080px;
          margin: 0 auto;
          padding: 36px 24px 140px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .id-body { grid-template-columns: 1.55fr 1fr; align-items: start; }
          .id-sidebar { display: block !important; }
          .id-mobile-cta { display: none !important; }
        }

        /* cards */
        .id-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 22px 24px;
        }
        .id-card .check-item:last-child { border-bottom: none; }

        /* notice */
        .id-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--amber-soft);
          border: 1px solid var(--amber-border);
          border-radius: 14px;
          padding: 16px 18px;
          font-size: 13.5px;
          color: #92400e;
          line-height: 1.6;
        }

        /* sidebar CTA */
        .id-cta-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .id-cta-top {
          padding: 22px 22px 18px;
          background: linear-gradient(135deg, var(--amber-soft) 0%, #fff 100%);
          border-bottom: 1px solid var(--border);
        }
        .id-cta-price {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: var(--ink);
          letter-spacing: -.5px;
          line-height: 1;
        }
        .id-cta-price sup {
          font-size: 16px;
          vertical-align: super;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
        }
        .id-cta-bottom { padding: 18px 22px; }

        /* buttons */
        .id-add-btn {
          width: 100%;
          padding: 13px;
          background: var(--amber);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .1s;
        }
        .id-add-btn:hover { background: #b45309; transform: translateY(-1px); }
        .id-add-btn:active { transform: translateY(0); }
        .id-cart-btn {
          width: 100%;
          padding: 13px;
          background: var(--blue);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .1s;
        }
        .id-cart-btn:hover { background: #1e40af; transform: translateY(-1px); }
        .id-cart-btn:active { transform: translateY(0); }

        /* qty */
        .id-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .id-qty-control {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--amber);
          border-radius: 10px;
          overflow: hidden;
        }
        .id-qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 12px;
          color: var(--amber);
          display: flex;
          align-items: center;
          transition: background .12s;
        }
        .id-qty-btn:hover { background: var(--amber-soft); }
        .id-qty-num {
          font-size: 14px;
          font-weight: 700;
          color: var(--amber);
          padding: 0 10px;
          min-width: 28px;
          text-align: center;
        }
        .id-trust-row {
          padding-top: 14px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }
        .id-trust-line {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--muted);
        }

        /* mobile cta */
        .id-mobile-cta {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          z-index: 50;
        }
      `}</style>

      

      {/* ── HERO ───────────────────────────────────────── */}
      <div className="id-hero">
        <div className="id-hero-ring" />

        <button className="id-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="id-hero-tag">
          <Search size={11} /> Inspection
        </div>

        <div className="id-hero-content">
          <h1 className="id-hero-title">{name} Inspection</h1>
          <div className="id-hero-meta">
            <span><Clock size={13} /> {duration} mins</span>
            <span><Star size={13} style={{ fill: "rgba(255,255,255,.8)", color: "rgba(255,255,255,.8)" }} /> 4.7 rating</span>
            <span><Zap size={13} /> Fast service</span>
            <span><ShieldCheck size={13} /> Verified pro</span>
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className="id-body">

        {/* ═══ LEFT ═══════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* About */}
          <div className="id-card id-anim" style={{ animationDelay: "60ms" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
              About this inspection
            </p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75 }}>
              {description || "Our professional will inspect the issue and provide an accurate diagnosis along with repair recommendations."}
            </p>
          </div>

          {/* Benefits */}
          <div className="id-card id-anim" style={{ animationDelay: "110ms" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
              Why inspection is important
            </p>
            {benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "11px 0",
                  borderBottom: i < benefits.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "var(--amber-soft)", border: "1px solid var(--amber-mid)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <b.icon size={14} color="var(--amber)" />
                </div>
                <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55, paddingTop: 6 }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="id-card id-anim" style={{ animationDelay: "160ms" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
              Why choose Finderzz
            </p>
            {trustPoints.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 0",
                  borderBottom: i < trustPoints.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <t.icon size={14} color={t.color} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="id-notice id-anim" style={{ animationDelay: "200ms" }}>
            <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong style={{ fontWeight: 600 }}>Good to know:</strong> The inspection fee will be adjusted against your final service cost if you proceed with the repair — you only pay once.
            </span>
          </div>
        </div>

        {/* ═══ SIDEBAR ════════════════════════════════ */}
        <div className="id-sidebar" style={{ display: "none" }}>
          <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 14 }}>

            <div className="id-cta-card id-anim" style={{ animationDelay: "80ms" }}>
              <div className="id-cta-top">
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                  Inspection fee
                </p>
                <p className="id-cta-price"><sup>₹</sup>{price}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {duration} mins</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> 4.7
                  </span>
                </div>
              </div>

              <div className="id-cta-bottom">
                {item ? (
                  <>
                    <div className="id-qty-row">
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>In your cart</span>
                      <div className="id-qty-control">
                        <button className="id-qty-btn" onClick={() => dispatch(decreaseQty({ serviceId, bookingType: "inspection" }))}>
                          <Minus size={13} />
                        </button>
                        <span className="id-qty-num">{item.quantity}</span>
                        <button className="id-qty-btn" onClick={() => dispatch(increaseQty({ serviceId, bookingType: "inspection" }))}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <button className="id-cart-btn" onClick={() => navigate("/cart")}>
                      <ShoppingCart size={14} /> View Cart · ₹{cartTotal} <ArrowRight size={13} />
                    </button>
                  </>
                ) : (
                  <button
                    className="id-add-btn"
                    onClick={() => dispatch(addToCart({ serviceId, name: `${name} Inspection`, price, duration, bookingType: "inspection" }))}
                  >
                    <ShoppingCart size={15} /> Book Inspection
                  </button>
                )}

                <div className="id-trust-row">
                  <div className="id-trust-line"><ShieldCheck size={13} color="#16a34a" /> Verified professional assigned</div>
                  <div className="id-trust-line"><CheckCircle2 size={13} color="#16a34a" /> Fee adjusted in final cost</div>
                  <div className="id-trust-line"><Zap size={13} color="#d97706" /> Instant confirmation</div>
                </div>
              </div>
            </div>

            {/* note card */}
            <div style={{ padding: "14px 16px", background: "var(--amber-soft)", border: "1px solid var(--amber-border)", borderRadius: 14 }}>
              <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                <strong style={{ fontWeight: 600 }}>Fee offset:</strong> If you book a repair after inspection, ₹{price} is deducted from your total.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE CTA ─────────────────────────────── */}
      <div className="id-mobile-cta">
        {item ? (
          <div style={{ display: "flex", gap: 10 }}>
            <div className="id-qty-control" style={{ flexShrink: 0 }}>
              <button className="id-qty-btn" onClick={() => dispatch(decreaseQty({ serviceId, bookingType: "inspection" }))}>
                <Minus size={13} />
              </button>
              <span className="id-qty-num">{item.quantity}</span>
              <button className="id-qty-btn" onClick={() => dispatch(increaseQty({ serviceId, bookingType: "inspection" }))}>
                <Plus size={13} />
              </button>
            </div>
            <button className="id-cart-btn" onClick={() => navigate("/cart")} style={{ flex: 1 }}>
              View Cart · ₹{cartTotal} <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <button
            className="id-add-btn"
            onClick={() => dispatch(addToCart({ serviceId, name: `${name} Inspection`, price, duration, bookingType: "inspection" }))}
          >
            <ShoppingCart size={15} /> Book Inspection · ₹{price}
          </button>
        )}
      </div>

     
    </>
  );
}