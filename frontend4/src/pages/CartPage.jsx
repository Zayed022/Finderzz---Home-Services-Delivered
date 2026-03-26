import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  Clock,
  Tag,
  CheckCircle2,
  Zap,
  ArrowLeft,
} from "lucide-react";

/* ── type label map ──────────────────────────────────────────── */
const typeLabel = {
  service: { text: "Service", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  inspection: { text: "Inspection", bg: "#fffbeb", color: "#d97706", border: "#fcd34d" },
};

/* ── single cart row ─────────────────────────────────────────── */
function CartItem({ item, dispatch }) {
  const meta = typeLabel[item.bookingType] ?? typeLabel.service;
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
              background: meta.bg, color: meta.color,
              border: `1px solid ${meta.border}`,
              borderRadius: 999, padding: "3px 10px",
            }}>
              {meta.text}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              <Clock size={11} /> {item.duration} mins
            </span>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>
            {item.name}
          </h3>

          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
            ₹{item.price} per unit
          </p>
        </div>

        {/* PRICE */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", fontFamily: "'Playfair Display', serif", letterSpacing: "-.3px" }}>
            ₹{lineTotal}
          </p>
          {item.quantity > 1 && (
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
              {item.quantity} × ₹{item.price}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <button
          onClick={() => dispatch(removeFromCart({
            subServiceId: item.subServiceId,
            serviceId: item.serviceId,
            bookingType: item.bookingType,
          }))}
          className="remove-btn"
        >
          <Trash2 size={13} /> Remove
        </button>

        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => dispatch(decreaseQty({
              subServiceId: item.subServiceId,
              serviceId: item.serviceId,
              bookingType: item.bookingType,
            }))}
          >
            <Minus size={13} />
          </button>
          <span className="qty-num">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => dispatch(increaseQty({
              subServiceId: item.subServiceId,
              serviceId: item.serviceId,
              bookingType: item.bookingType,
            }))}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);

  const total = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);

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
          --red:       #dc2626;
          --red-soft:  #fef2f2;
          --radius:    16px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.05);
          --shadow-md: 0 4px 24px rgba(0,0,0,.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--surface); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp .4s ease both; }

        /* header */
        .cart-header {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(10px);
        }
        .cart-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background .13s, color .13s;
        }
        .back-btn:hover { background: var(--surface); color: var(--ink); }
        .header-divider {
          width: 1px;
          height: 18px;
          background: var(--border);
        }
        .cart-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--ink);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .count-badge {
          background: var(--blue);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
          padding: 2px 8px;
          line-height: 1.6;
        }

        /* layout */
        .cart-body {
          max-width: 1060px;
          margin: 0 auto;
          padding: 32px 24px 120px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .cart-body { grid-template-columns: 1.7fr 1fr; align-items: start; }
          .cart-sidebar { display: block !important; }
          .cart-mobile-cta { display: none !important; }
        }

        /* section label */
        .section-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .09em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }

        /* cart item card */
        .cart-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 20px 22px;
          transition: box-shadow .2s, transform .2s;
          animation: fadeUp .4s ease both;
        }
        .cart-item:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        /* qty */
        .qty-control {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--blue);
          border-radius: 10px;
          overflow: hidden;
        }
        .qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 12px;
          color: var(--blue);
          display: flex;
          align-items: center;
          transition: background .12s;
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

        /* remove */
        .remove-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          padding: 5px 8px;
          border-radius: 7px;
          transition: background .13s, color .13s;
        }
        .remove-btn:hover { background: var(--red-soft); color: var(--red); }

        /* summary card */
        .summary-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .summary-top {
          padding: 20px 22px 16px;
          border-bottom: 1px solid var(--border);
        }
        .summary-bottom { padding: 18px 22px; }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--ink-soft);
          padding: 5px 0;
        }
        .summary-row span:last-child { font-weight: 600; color: var(--ink); }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          margin-top: 10px;
        }
        .total-label {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
        }
        .total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: var(--ink);
          letter-spacing: -.4px;
        }

        /* checkout btn */
        .checkout-btn {
          width: 100%;
          padding: 13px;
          background: var(--blue);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .1s;
          margin-top: 16px;
        }
        .checkout-btn:hover { background: #1e40af; transform: translateY(-1px); }
        .checkout-btn:active { transform: translateY(0); }

        /* trust strip */
        .trust-strip {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          margin-top: 14px;
        }
        .trust-line {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: var(--muted);
        }

        /* empty state */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }
        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .explore-btn {
          margin-top: 22px;
          padding: 12px 28px;
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
          gap: 8px;
          transition: background .15s, transform .1s;
        }
        .explore-btn:hover { background: #1e40af; transform: translateY(-1px); }

        /* mobile cta */
        .cart-mobile-cta {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          z-index: 50;
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="cart-header">
        <div className="cart-header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="header-divider" />
          <div className="cart-title">
            <ShoppingCart size={17} color="var(--blue)" />
            Your Cart
            {cartItems.length > 0 && (
              <span className="count-badge">{totalItems}</span>
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {cartItems.length} service{cartItems.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className="cart-body">

        {cartItems.length === 0 ? (
          <div className="empty-state fade-up">
            <div className="empty-icon-wrap">
              <ShoppingCart size={32} color="var(--muted)" style={{ opacity: .5 }} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>Your cart is empty</p>
            <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, maxWidth: 280, lineHeight: 1.6 }}>
              Browse our services and add them here to get started.
            </p>
            <button className="explore-btn" onClick={() => navigate("/")}>
              Explore Services <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* LEFT — items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="section-label">
                {cartItems.length} service{cartItems.length > 1 ? "s" : ""} in your cart
              </p>

              {cartItems.map((item, i) => (
                <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
                  <CartItem item={item} dispatch={dispatch} />
                </div>
              ))}

              {/* note */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 12, padding: "13px 16px",
                fontSize: 13, color: "#166534", marginTop: 4,
              }}>
                <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                All services include a satisfaction guarantee. Free cancellation up to 2 hrs before.
              </div>
            </div>

            {/* RIGHT — summary sidebar */}
            <div className="cart-sidebar" style={{ display: "none" }}>
              <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 }}>

                <div className="summary-card fade-up">
                  <div className="summary-top">
                    <p className="section-label" style={{ marginBottom: 14 }}>Order summary</p>

                    {cartItems.map((item, i) => (
                      <div key={i} className="summary-row">
                        <span style={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                          <span style={{ color: "var(--muted)", fontWeight: 400 }}> ×{item.quantity}</span>
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}

                    <div className="total-row">
                      <span className="total-label">Total</span>
                      <span className="total-amount">₹{total}</span>
                    </div>
                  </div>

                  <div className="summary-bottom">
                    <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                      Proceed to Checkout <ArrowRight size={15} />
                    </button>

                    <div className="trust-strip">
                      <div className="trust-line"><ShieldCheck size={13} color="var(--green)" /> Secure checkout</div>
                      <div className="trust-line"><CheckCircle2 size={13} color="var(--green)" /> Verified professionals</div>
                      <div className="trust-line"><Zap size={13} color="#d97706" /> Instant booking confirmation</div>
                    </div>
                  </div>
                </div>

                {/* promo hint */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 9,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "12px 14px",
                  fontSize: 12.5, color: "var(--muted)",
                }}>
                  <Tag size={13} color="var(--blue)" />
                  Have a promo code? Apply it at checkout.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── MOBILE CTA ─────────────────────────────── */}
      {cartItems.length > 0 && (
        <div className="cart-mobile-cta">
          <button className="checkout-btn" onClick={() => navigate("/checkout")} style={{ marginTop: 0 }}>
            Checkout · ₹{total} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </>
  );
}