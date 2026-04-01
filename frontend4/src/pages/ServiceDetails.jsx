import { useNavigate, useParams } from "react-router-dom";
import { useServiceDetails } from "../hooks/useServiceDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";
import { Clock, ShieldCheck, ChevronDown, ShoppingBag, ArrowRight, Minus, Plus, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

/* ─── tiny helpers ──────────────────────────────────────────── */
function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      {children}
    </span>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-gray-100 last:border-0"
      style={{ fontFamily: "inherit" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function ServiceDetails() {
  const { id } = useParams();
  const [showWithoutMaterial, setShowWithoutMaterial] = useState(false);
  const [expanded, setExpanded] = useState({});
  const { data, isLoading } = useServiceDetails(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  /* loading */
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 tracking-wide">Loading service…</p>
      </div>
    );
  }

  const { service, subServices } = data;
  const filteredSubServices = subServices.filter((sub) =>
    showWithoutMaterial
      ? sub.withMaterial === false
      : sub.withMaterial === true
  );

  const getItem = (subServiceId) =>
    cartItems.find(
      (item) =>
        item.subServiceId === subServiceId && item.bookingType === "service"
    );

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const faqs = [
    {
      question: `What is the cost of ${service.name}?`,
      answer:
        "Pricing depends on service type and requirements. You can see individual prices listed next to each service below.",
    },
    {
      question: "Are professionals verified?",
      answer:
        "Yes, all our professionals are background-checked, trained, and verified before they're listed on Finderzz.",
    },
    {
      question: "How do I reschedule or cancel?",
      answer:
        "You can reschedule or cancel up to 2 hours before the appointment from your bookings page — no questions asked.",
    },
    {
      question: "Is there a warranty on the service?",
      answer:
        "Most services come with a 30-day service guarantee. Check individual service details for specifics.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{service?.name} Services in Bhiwandi | Finderzz</title>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        :root {
          --blue: #2563eb;
          --blue-light: #eff6ff;
          --blue-mid: #dbeafe;
          --ink: #111827;
          --ink-soft: #374151;
          --muted: #6b7280;
          --border: #e5e7eb;
          --surface: #f9fafb;
          --white: #ffffff;
          --radius: 14px;
          --shadow-card: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
          --shadow-sticky: 0 4px 24px rgba(0,0,0,.10);
        }
        body { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .add-btn {
          background: var(--blue);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 6px 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background .15s, transform .1s;
          font-family: 'DM Sans', sans-serif;
        }
        .add-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .add-btn:active { transform: translateY(0); }
        .qty-control {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid var(--blue);
          border-radius: 8px;
          overflow: hidden;
        }
        .qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          color: var(--blue);
          display: flex;
          align-items: center;
          transition: background .12s;
        }
        .qty-btn:hover { background: var(--blue-light); }
        .qty-num {
          font-size: 13px;
          font-weight: 600;
          color: var(--blue);
          padding: 0 6px;
          min-width: 20px;
          text-align: center;
        }
        .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-card);
        }
        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: var(--muted);
          font-weight: 500;
          padding: 4px 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(14px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .45s ease both; }
        .fade-up-1 { animation-delay: .05s; }
        .fade-up-2 { animation-delay: .12s; }
        .fade-up-3 { animation-delay: .19s; }
        .inspection-card {
          background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
          border: 1px solid #bfdbfe;
          border-radius: var(--radius);
          padding: 20px 22px;
        }
        .sub-row {
          padding: 20px 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          transition: background .12s;
        }
        .sub-row:last-child { border-bottom: none; }
        .sub-row:hover { background: var(--surface); border-radius: 10px; padding-left: 10px; padding-right: 10px; margin-left: -10px; margin-right: -10px; }
        .price-tag {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -.3px;
        }
        .link-btn {
          font-size: 12.5px;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color .15s;
        }
        .link-btn:hover { color: var(--blue); }
        .sticky-sidebar {
          position: sticky;
          top: 88px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--ink-soft);
          padding: 6px 0;
        }
        .summary-item span:last-child { font-weight: 600; color: var(--ink); }
        .continue-btn {
          width: 100%;
          padding: 13px;
          background: var(--blue);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .1s;
        }
        .continue-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .continue-btn:active { transform: translateY(0); }
        .continue-btn:disabled { background: #93c5fd; cursor: not-allowed; transform: none; }
        .empty-cart {
          text-align: center;
          padding: 28px 0 20px;
          color: var(--muted);
        }
        .empty-cart svg { margin: 0 auto 10px; opacity: .35; }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
      `}</style>

      <Navbar />

      <div style={{ background: "var(--white)", minHeight: "100vh" }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 40px" }}>

            {/* Breadcrumb */}
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, letterSpacing: ".02em" }}>
              Home &nbsp;/&nbsp; Services &nbsp;/&nbsp;
              <span style={{ color: "var(--ink-soft)" }}>{service.name}</span>
            </p>

            <div className="fade-up">
              <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "var(--ink)", lineHeight: 1.2, marginBottom: 12 }}>
                {service.name}
              </h1>
              

              {/* Trust pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="trust-pill"><ShieldCheck size={13} color="#16a34a" /> Verified Professionals</span>
                <span className="trust-pill"><Star size={12} color="#f59e0b" style={{ fill: "#f59e0b" }} /> 4.8 Avg Rating</span>
                <span className="trust-pill"><Clock size={12} /> On-time Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ──────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 120px", display: "grid", gridTemplateColumns: "1fr", gap: 36 }}
          className="service-grid">

          <style>{`
            @media (min-width: 1024px) {
              .service-grid { grid-template-columns: 1.65fr 0.95fr !important; }
            }
          `}</style>

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div>

            {/* INSPECTION */}
            {service.inspection?.available && (
              <div className="inspection-card fade-up fade-up-1" style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <Badge><ShieldCheck size={11} /> Inspection Service</Badge>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginTop: 10, marginBottom: 4 }}>
                      Get a Professional Inspection First
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
                      <Clock size={13} /> {service.inspection.duration} mins
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, minWidth: 130 }}>
                    <span className="price-tag">₹{service.inspection.price}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        className="link-btn"
                        onClick={() =>
                          navigate(`/inspection/${service._id}`, {
                            state: {
                              serviceId: service._id,
                              name: service.name,
                              price: service.inspection.price,
                              description: service.inspection.description,
                              duration: service.inspection.duration,
                            },
                          })
                        }
                      >
                        View details
                      </button>
                      <button
                        className="add-btn"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              serviceId: service._id,
                              name: "Inspection",
                              price: service.inspection.price,
                              duration: service.inspection.duration,
                              bookingType: "inspection",
                            })
                          )
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MATERIAL TOGGLE ─────────────────────────── */}
            <div
  className="fade-up fade-up-2"
  style={{
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    border: "1px solid var(--border)",
    borderRadius: 12,
    background: "var(--surface)",
  }}
>
  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
    Filter by material
  </span>

  {/* SEGMENTED TOGGLE */}
  <div
    style={{
      display: "flex",
      background: "#eef2f7",
      borderRadius: 999,
      padding: 4,
      position: "relative",
      minWidth: 170,
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    {/* Sliding Indicator */}
    <div
      style={{
        position: "absolute",
        top: 4,
        bottom: 4,
        left: showWithoutMaterial ? "50%" : "4px",
        width: "calc(50% - 4px)",
        background: "#ffffff",
        borderRadius: 999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}
    />

    {/* WITH MATERIAL */}
    <div
      onClick={() => setShowWithoutMaterial(false)}
      style={{
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 600,
        padding: "6px 10px",
        zIndex: 2,
        color: !showWithoutMaterial ? "#111827" : "#6b7280",
        transition: "color 0.2s",
      }}
    >
      With Material
    </div>

    {/* WITHOUT MATERIAL */}
    <div
      onClick={() => setShowWithoutMaterial(true)}
      style={{
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 600,
        padding: "6px 10px",
        zIndex: 2,
        color: showWithoutMaterial ? "#111827" : "#6b7280",
        transition: "color 0.2s",
      }}
    >
      Without Material
    </div>
  </div>
</div>

            {/* SUB SERVICES */}
            {/* SUB SERVICES */}
            <div className="card fade-up delay-2" style={{ padding: "22px 24px 12px" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: 4,
                }}
              >
                Available Services
              </p>
              <p style={{ fontSize: 12.5, color: "#888", marginBottom: 18 }}>
                {filteredSubServices.length} service{filteredSubServices.length !== 1 ? "s" : ""} available
              </p>

              {filteredSubServices.map((sub) => {
                const item = getItem(sub._id);
                return (
                  <div key={sub._id} className="sub-row">

                    {/* Thumbnail */}
                    

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                        {sub.name}
                      </h3>

                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", letterSpacing: "-0.4px" }}>
                        ₹{sub.customerPrice}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#888" }}>
                          <Clock size={12} /> {sub.durationEstimate} mins
                        </span>

                        
                        {/* Fake review pill */}
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, color: "#f59e0b", fontWeight: 600 }}>
                          <Star size={11} style={{ fill: "#f59e0b" }} /> 4.8
                          <span style={{ color: "#bbb", fontWeight: 400 }}>(120)</span>
                        </span>
                      </div>

                      {sub.description && (
                        <p
                          style={{
                            fontSize: 12.5,
                            color: "#888",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: expanded[sub._id] ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {sub.description}
                        </p>
                      )}
                      {sub.description && sub.description.length > 80 && (
                        <button
                          onClick={() =>
                            setExpanded((prev) => ({ ...prev, [sub._id]: !prev[sub._id] }))
                          }
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "#3b5bdb",
                            fontWeight: 600,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {expanded[sub._id] ? "Show less ↑" : "Show more ↓"}
                        </button>

                      )}
                      <button
  className="link-btn"
  onClick={() => navigate(`/sub-service/${sub._id}`)}
  style={{
    fontSize: "13.5px",
    color: "var(--blue)",
    fontWeight: 600
  }}
>
  Details
</button>
                    </div>

                    {/* Right: price + action */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 10,
                        flexShrink: 0,
                      }}
                    >
                      {sub.image && (
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 12,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f3f4f6",
                          border: "1px solid #ebebeb",
                        }}
                      >
                        <img
                          src={sub.image}
                          alt={sub.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        {item ? (
                          <div className="qty-control">
                            <button
                              className="qty-btn"
                              onClick={() =>
                                dispatch(decreaseQty({ subServiceId: sub._id, bookingType: "service" }))
                              }
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() =>
                                dispatch(increaseQty({ subServiceId: sub._id, bookingType: "service" }))
                              }
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-btn"
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  subServiceId: sub._id,
                                  name: sub.name,
                                  price: sub.customerPrice,
                                  duration: sub.durationEstimate,
                                  bookingType: "service",
                                })
                              )
                            }
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ */}
            <div className="fade-up fade-up-3" style={{ marginTop: 28 }}>
              <p className="section-label">FAQs</p>
              <div className="card" style={{ padding: "4px 22px" }}>
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ─────────────────────────────── */}
          <div style={{ display: "none" }} className="sidebar-col">
            <style>{`@media (min-width: 1024px) { .sidebar-col { display: block !important; } }`}</style>

            <div className="sticky-sidebar">
              <div className="card" style={{ padding: "22px 22px 20px" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Booking Summary</h3>
                  {cartCount > 0 && (
                    <span style={{
                      background: "var(--blue)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: "2px 8px"
                    }}>
                      {cartCount} item{cartCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={28} />
                    <p style={{ fontSize: 13 }}>No services added yet</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>Select services from the list</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      {cartItems.map((item, i) => (
                        <div key={i} className="summary-item">
                          <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name} <span style={{ color: "var(--muted)", fontWeight: 400 }}>×{item.quantity}</span>
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </>
                )}

                <button
                  className="continue-btn"
                  onClick={() => navigate("/cart")}
                  disabled={cartItems.length === 0}
                >
                  {cartItems.length === 0 ? "Add services to continue" : (<>Continue to Checkout <ArrowRight size={15} /></>)}
                </button>

                <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
                  <ShieldCheck size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  Secure booking · Free cancellation
                </p>
              </div>

              {/* Trust card */}
              <div style={{ marginTop: 14, padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>Why Finderzz?</p>
                {[
                  ["✓", "Verified & trained professionals"],
                  ["✓", "Transparent, upfront pricing"],
                  ["✓", "30-day service guarantee"],
                ].map(([icon, text]) => (
                  <p key={text} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>
                    <span style={{ color: "#16a34a", fontWeight: 700, marginRight: 6 }}>{icon}</span>{text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE BOTTOM CTA ─────────────────────── */}
        <style>{`@media (min-width: 1024px) { .mobile-cta { display: none !important; } }`}</style>
        <div
          className="mobile-cta"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid var(--border)",
            zIndex: 50,
          }}
        >
          <button
            className="continue-btn"
            onClick={() => navigate("/cart")}
            disabled={cartItems.length === 0}
            style={{ padding: "14px" }}
          >
            {cartItems.length === 0
              ? "Add services to continue"
              : (<>Continue &nbsp;·&nbsp; ₹{total} <ArrowRight size={15} /></>)
            }
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}