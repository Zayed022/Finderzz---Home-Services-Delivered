import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import {
  Clock,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

/* ─── enrich helper (same logic as before) ───────────────────── */
const badges = ["Most Booked", "Recommended", "Top Rated", null];
const highlightsPool = [
  ["Professional staff", "Safe cleaning", "Quick service"],
  ["Eco-friendly products", "Trained experts"],
  ["Affordable pricing", "High quality"],
  ["Trusted by 1000+ users", "Instant booking"],
];
function enrichSubService(sub) {
  return {
    ...sub,
    rating: (Math.random() * (4.9 - 4.1) + 4.1).toFixed(1),
    bookings: Math.floor(Math.random() * 500) + 50,
    badge: badges[Math.floor(Math.random() * badges.length)],
    highlights: highlightsPool[Math.floor(Math.random() * highlightsPool.length)],
    isFast: sub.durationEstimate <= 30,
  };
}

/* ─── FAQ accordion ──────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{q}</span>
        <ChevronDown
          size={16}
          color="var(--muted)"
          style={{ flexShrink: 0, transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 200 : 0,
          transition: "max-height .3s ease",
        }}
      >
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, paddingBottom: 16 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── section wrapper ────────────────────────────────────────── */
function Section({ title, children, delay = 0 }) {
  return (
    <div
      className="ssd-section"
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && (
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SubServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const { data, isLoading } = useQuery({
    queryKey: ["subService", id],
    queryFn: async () => {
      const res = await API.get(`/subService/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const getItem = (sid) =>
    cartItems.find((i) => i.subServiceId === sid && i.bookingType === "service");

  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#fafafa" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2.5px solid #2563eb", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />
        <p style={{ fontSize: 13, color: "#9ca3af", letterSpacing: ".04em" }}>Loading service…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const sub = enrichSubService(data?.data);
  const item = getItem(sub._id);
  const cartTotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);

  const faqs = [
    { q: `What is the cost of ${sub?.name} in Bhiwandi?`, a: "Pricing depends on service type and inspection requirements. The listed price is the standard rate for this service." },
    { q: "Do you provide inspection before service?", a: "Yes, inspection services are available to give you accurate pricing and an honest assessment before work begins." },
    { q: "Are professionals verified?", a: "All professionals are background-checked, trained, and verified before they're listed on Finderzz." },
    { q: "Can I reschedule or cancel?", a: "Yes, you can reschedule or cancel up to 2 hours before your appointment — no questions asked, no penalty." },
  ];

  return (
    <>
      <Helmet>
        <title>{sub?.name} in Bhiwandi | Finderzz</title>
        <meta name="description" content={`Book ${sub?.name} in Bhiwandi starting at ₹${sub?.customerPrice}. Fast and verified home service.`} />
        <link rel="canonical" href={`https://finderzz.com/sub-service/${id}`} />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) })}</script>
      </Helmet>

      <style>{`
        :root {
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
          --amber:      #d97706;
          --radius:     16px;
          --shadow-sm:  0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.05);
          --shadow-md:  0 4px 20px rgba(0,0,0,.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ssd-section {
          animation: fadeUp .5s ease both;
        }

        /* hero */
        .ssd-hero {
          position: relative;
          height: 340px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%);
          overflow: hidden;
        }
        .ssd-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(99,179,237,.18) 0%, transparent 65%);
        }
        .ssd-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .ssd-hero-content {
          position: absolute;
          bottom: 36px;
          left: 36px;
          right: 36px;
        }
        .ssd-back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,.8);
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 10px;
          padding: 8px 14px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background .15s, color .15s;
          font-family: 'Outfit', sans-serif;
        }
        .ssd-back-btn:hover { background: rgba(255,255,255,.22); color: #fff; }
        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          background: rgba(255,255,255,.15);
          border: 1px solid rgba(255,255,255,.25);
          color: #fff;
          padding: 4px 12px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
          margin-bottom: 12px;
        }
        .ssd-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 40px);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .hero-meta {
          display: flex;
          gap: 18px;
          font-size: 13px;
          color: rgba(255,255,255,.75);
          flex-wrap: wrap;
        }
        .hero-meta span { display: flex; align-items: center; gap: 5px; }

        /* layout */
        .ssd-body {
          max-width: 1080px;
          margin: 0 auto;
          padding: 40px 24px 140px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 1024px) {
          .ssd-body { grid-template-columns: 1.6fr 1fr; align-items: start; }
          .ssd-sidebar { display: block !important; }
          .ssd-mobile-cta { display: none !important; }
        }

        /* cards */
        .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 24px;
        }
        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 16px;
        }

        /* stat chips */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .stat-chip {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
        }
        .stat-chip .label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .stat-chip .value {
          font-size: 16px;
          font-weight: 700;
          color: var(--ink);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .stat-chip.fast { background: #f0fdf4; border-color: #bbf7d0; }
        .stat-chip.fast .value { color: var(--green); }
        .stat-chip.price .value { color: var(--blue); }

        /* highlights */
        .highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink-soft);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 14px;
          transition: border-color .15s, color .15s;
        }
        .highlight-pill:hover { border-color: var(--blue-mid); color: var(--blue); }

        /* features */
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: var(--ink-soft);
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }
        .feature-item:last-child { border-bottom: none; }

        /* CTA sidebar card */
        .cta-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .cta-card-top {
          padding: 22px 22px 18px;
          border-bottom: 1px solid var(--border);
        }
        .cta-card-bottom { padding: 18px 22px; }
        .cta-price {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: var(--ink);
          letter-spacing: -.5px;
        }
        .cta-price sup { font-size: 16px; vertical-align: super; font-family: 'Outfit', sans-serif; font-weight: 600; }
        .add-btn {
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
        .add-btn:hover { background: #1e40af; transform: translateY(-1px); }
        .add-btn:active { transform: translateY(0); }
        .qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .qty-control {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid var(--blue);
          border-radius: 10px;
          overflow: hidden;
        }
        .qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 13px;
          color: var(--blue);
          display: flex;
          align-items: center;
          transition: background .12s;
          font-family: inherit;
        }
        .qty-btn:hover { background: var(--blue-soft); }
        .qty-num {
          font-size: 14px;
          font-weight: 700;
          color: var(--blue);
          padding: 0 10px;
          min-width: 28px;
          text-align: center;
        }
        .view-cart-btn {
          width: 100%;
          padding: 11px;
          background: var(--blue-soft);
          color: var(--blue);
          border: 1.5px solid var(--blue-mid);
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background .15s;
          margin-top: 10px;
        }
        .view-cart-btn:hover { background: var(--blue-mid); }
        .trust-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .trust-line {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--muted);
        }

        /* mobile CTA */
        .ssd-mobile-cta {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          z-index: 50;
        }
      `}</style>

      

      {/* ── HERO ──────────────────────────────────────── */}
      <div className="ssd-hero">
        <div className="ssd-hero-grid" />

        <button className="ssd-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="ssd-hero-content">
          {sub.badge && (
            <div className="badge-pill">
              <Star size={10} style={{ fill: "#fbbf24", color: "#fbbf24" }} />
              {sub.badge}
            </div>
          )}
          <h1 className="ssd-title">{sub.name} in Bhiwandi</h1>
          <div className="hero-meta">
            <span><Star size={13} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> {sub.rating} rating</span>
            <span>· {sub.bookings} bookings this month</span>
            {sub.isFast && <span><Zap size={13} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> Fast service</span>}
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div className="ssd-body">

        {/* ═══ LEFT COLUMN ════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Stat chips */}
          <Section delay={60}>
            <div className="stat-grid">
              <div className="stat-chip">
                <p className="label">Duration</p>
                <p className="value"><Clock size={14} color="var(--muted)" /> {sub.durationEstimate} min</p>
              </div>
              <div className="stat-chip price">
                <p className="label">Starting at</p>
                <p className="value">₹{sub.customerPrice}</p>
              </div>
              <div className={`stat-chip${sub.isFast ? " fast" : ""}`}>
                <p className="label">Speed</p>
                <p className="value">
                  {sub.isFast
                    ? <><Zap size={14} /> Express</>
                    : <><Clock size={14} /> Standard</>
                  }
                </p>
              </div>
            </div>
          </Section>

          {/* About */}
          <Section delay={120}>
            <div className="card">
              <p className="card-title">About this service</p>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75 }}>
                {sub.description}
              </p>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, marginTop: 12 }}>
                Looking for {sub.name} in Bhiwandi? Finderzz provides trusted and verified professionals for all your home service needs. Book instantly and get fast service at your doorstep.
              </p>
            </div>
          </Section>

          {/* Highlights */}
          <Section title="Highlights" delay={160}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {sub.highlights.map((h, i) => (
                <span key={i} className="highlight-pill">
                  <CheckCircle2 size={13} color="var(--green)" /> {h}
                </span>
              ))}
            </div>
          </Section>

          {/* ── OUR PROCESS ─────────────────────────── */}
{sub?.processId && sub.processId.steps?.length > 0 && (
  <Section title="Our Process" delay={180}>
    <div className="card" style={{ padding: "22px 20px" }}>
      <div style={{ position: "relative" }}>

        {/* Vertical Line */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 6,
            bottom: 6,
            width: 2,
            background: "#e5e7eb"
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {sub.processId.steps.map((step, index) => (
            <div key={index} style={{ display: "flex", gap: 14, position: "relative" }}>

              {/* STEP NUMBER CIRCLE */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  color: "#111827",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  flexShrink: 0
                }}
              >
                {step.stepNumber}
              </div>

              {/* CONTENT */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 4
                  }}
                >
                  {step.title}
                </p>

                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.6
                  }}
                >
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  </Section>
)}

          {/* Features */}
          {sub.features?.length > 0 && (
            <Section title="What's included" delay={200}>
              <div className="card" style={{ padding: "20px 24px" }}>
                {sub.features.map((f, i) => (
                  <div key={i} className="feature-item">
                    <CheckCircle2 size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* FAQ */}
          <Section title="Frequently asked questions" delay={240}>
            <div className="card" style={{ padding: "8px 24px" }}>
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </Section>
        </div>

        {/* ═══ SIDEBAR ════════════════════════════════ */}
        <div className="ssd-sidebar" style={{ display: "none" }}>
          <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* CTA card */}
            <div className="cta-card ssd-section" style={{ animationDelay: "80ms" }}>
              <div className="cta-card-top">
                <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                  Service price
                </p>
                <p className="cta-price"><sup>₹</sup>{sub.customerPrice}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {sub.durationEstimate} mins</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> {sub.rating}</span>
                </div>
              </div>

              <div className="cta-card-bottom">
                {item ? (
                  <>
                    <div className="qty-row">
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>In your cart</span>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => dispatch(decreaseQty({ subServiceId: sub._id, bookingType: "service" }))}>
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => dispatch(increaseQty({ subServiceId: sub._id, bookingType: "service" }))}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <button className="view-cart-btn" onClick={() => navigate("/cart")}>
                      <ShoppingCart size={14} /> View Cart · ₹{cartTotal} <ArrowRight size={13} />
                    </button>
                  </>
                ) : (
                  <button
                    className="add-btn"
                    onClick={() => dispatch(addToCart({ subServiceId: sub._id, name: sub.name, price: sub.customerPrice, duration: sub.durationEstimate, bookingType: "service" }))}
                  >
                    <ShoppingCart size={15} /> Add to Cart
                  </button>
                )}

                <div className="trust-row" style={{ marginTop: 16 }}>
                  <div className="trust-line"><ShieldCheck size={13} color="var(--green)" /> Verified professional</div>
                  <div className="trust-line"><CheckCircle2 size={13} color="var(--green)" /> 30-day service guarantee</div>
                  <div className="trust-line"><Zap size={13} color="var(--amber)" /> Instant booking confirmation</div>
                </div>
              </div>
            </div>

            {/* Why Finderzz */}
            <div style={{ padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>Why Finderzz?</p>
              {[
                "Background-verified professionals",
                "Transparent, upfront pricing",
                "Free cancellation up to 2 hrs",
              ].map((t) => (
                <p key={t} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span> {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE CTA ─────────────────────────────── */}
      <div className="ssd-mobile-cta">
        {item ? (
          <div style={{ display: "flex", gap: 10 }}>
            <div className="qty-control" style={{ flexShrink: 0 }}>
              <button className="qty-btn" onClick={() => dispatch(decreaseQty({ subServiceId: sub._id, bookingType: "service" }))}>
                <Minus size={13} />
              </button>
              <span className="qty-num">{item.quantity}</span>
              <button className="qty-btn" onClick={() => dispatch(increaseQty({ subServiceId: sub._id, bookingType: "service" }))}>
                <Plus size={13} />
              </button>
            </div>
            <button className="add-btn" onClick={() => navigate("/cart")} style={{ flex: 1 }}>
              View Cart · ₹{cartTotal} <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <button
            className="add-btn"
            onClick={() => dispatch(addToCart({ subServiceId: sub._id, name: sub.name, price: sub.customerPrice, duration: sub.durationEstimate, bookingType: "service" }))}
          >
            <ShoppingCart size={15} /> Add to Cart · ₹{sub.customerPrice}
          </button>
        )}

        
      </div>

      
    </>
  );
}