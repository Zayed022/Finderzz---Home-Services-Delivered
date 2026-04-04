import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { clearCart } from "../store/cartSlice";
import AreaModal from "../components/AreaModal";
import {
  MapPin,
  User,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Home,
  Phone,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ── labelled input ──────────────────────────────────────────── */
function Field({ label, icon: Icon, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".04em", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 11.5, color: "var(--red)", display: "flex", alignItems: "center", gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── step header ─────────────────────────────────────────────── */
function StepCard({ step, title, icon: Icon, children }) {
  return (
    <div className="co-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "var(--blue-soft)", border: "1px solid var(--blue-mid)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={15} color="var(--blue)" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)" }}>Step {step}</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{title}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);
  const hasInspection = cartItems.some(
    (item) => item.bookingType === "inspection"
  );
  const { selectedArea, extraCharge } = useSelector((s) => s.area);

  const [openAreaModal, setOpenAreaModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "",
    houseNumber: "", street: "", city: "",
    date: "", timeSlot: "",
  });

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const total = subtotal + (extraCharge || 0);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = "Name is required";
    if (!form.phone.trim())       e.phone = "Phone is required";
    if (!form.houseNumber.trim()) e.houseNumber = "House number is required";
    if (!form.street.trim())      e.street = "Street is required";
    if (!form.city.trim())        e.city = "City is required";
    if (!form.date)               e.date = "Please select a date";
    if (!form.timeSlot)           e.timeSlot = "Please select a time";
    if (!selectedArea?._id)       e.area = "Please select your service area";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!cartItems.length) return;

    try {
      setLoading(true);
      const payload = {
        services: cartItems,
        areaId: selectedArea._id,
        address: { houseNumber: form.houseNumber, street: form.street, city: form.city },
        customerDetails: { name: form.name, phone: form.phone },
        scheduledDate: form.date,
        timeSlot: form.timeSlot,
      
        // ✅ NEW FIELDS
        requirements: requirements?.trim() || undefined,
        budget: budget ? Number(budget) : undefined,
      };
      const res = await API.post("/booking", payload);
      const existing = JSON.parse(localStorage.getItem("guest_bookings")) || [];
      localStorage.setItem("guest_bookings", JSON.stringify([res.data.data, ...existing]));
      dispatch(clearCart());
      navigate("/booking-success", { state: res.data.data });
    } catch {
      setErrors((e) => ({ ...e, submit: "Booking failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  /* today's date for min attr */
  const today = new Date().toISOString().split("T")[0];

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
          --shadow-sm: 0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04);
          --shadow-md: 0 4px 24px rgba(0,0,0,.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--surface); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .4s ease both; }

        /* header */
        .co-header {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 14px;
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(10px);
        }
        .co-back {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 500; color: var(--muted);
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          padding: 6px 10px; border-radius: 8px;
          transition: background .13s, color .13s;
        }
        .co-back:hover { background: var(--surface); color: var(--ink); }
        .co-hdivider { width: 1px; height: 18px; background: var(--border); }
        .co-htitle {
          font-size: 17px; font-weight: 700; color: var(--ink);
        }

        /* progress pills */
        .co-progress {
          display: flex; align-items: center; gap: 6px;
          padding: 0 24px; height: 48px;
          background: var(--white); border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }
        .co-pill {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 600;
          color: var(--muted); white-space: nowrap;
        }
        .co-pill.active { color: var(--blue); }
        .co-pill-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--surface); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: var(--muted);
          flex-shrink: 0;
        }
        .co-pill.active .co-pill-dot {
          background: var(--blue-soft); border-color: var(--blue-mid); color: var(--blue);
        }
        .co-pill-sep { color: var(--border); font-size: 16px; }

        /* body */
        .co-body {
          max-width: 1060px; margin: 0 auto;
          padding: 32px 24px 120px;
          display: grid; grid-template-columns: 1fr; gap: 24px;
        }
        @media (min-width: 1024px) {
          .co-body { grid-template-columns: 1.6fr 1fr; align-items: start; }
          .co-sidebar { display: block !important; }
          .co-mobile-cta { display: none !important; }
        }

        /* form cards */
        .co-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 22px 24px;
          animation: fadeUp .45s ease both;
        }

        /* inputs */
        .co-input {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          color: var(--ink);
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          outline: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color .15s, background .15s, box-shadow .15s;
          -webkit-appearance: none;
        }
        .co-input::placeholder { color: #94a3b8; }
        .co-input:focus {
          border-color: var(--blue);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(29,78,216,.1);
        }
        .co-input.error { border-color: var(--red); background: var(--red-soft); }
        .co-input:focus.error { box-shadow: 0 0 0 3px rgba(220,38,38,.1); }

        .co-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 560px) { .co-grid2 { grid-template-columns: 1fr; } }

        /* area card */
        .co-area-card {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          background: var(--white); border: 1px solid var(--border);
          border-radius: var(--radius); box-shadow: var(--shadow-sm);
          padding: 20px 22px;
          animation: fadeUp .45s ease both;
        }
        .co-area-card.has-error { border-color: var(--red); background: var(--red-soft); }
        .co-select-btn {
          font-size: 13px; font-weight: 600; color: var(--blue);
          background: var(--blue-soft); border: 1px solid var(--blue-mid);
          border-radius: 8px; padding: 7px 16px; cursor: pointer;
          font-family: 'Outfit', sans-serif; white-space: nowrap;
          transition: background .13s;
          flex-shrink: 0;
        }
        .co-select-btn:hover { background: var(--blue-mid); }

        /* summary */
        .co-summary-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        .co-summary-top { padding: 20px 22px 16px; border-bottom: 1px solid var(--border); }
        .co-summary-bottom { padding: 18px 22px; }
        .co-sum-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: var(--ink-soft); padding: 4px 0;
        }
        .co-sum-row span:last-child { font-weight: 600; color: var(--ink); }
        .co-divider { height: 1px; background: var(--border); margin: 10px 0; }
        .co-total-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-top: 12px; border-top: 1px solid var(--border); margin-top: 8px;
        }
        .co-total-label { font-size: 15px; font-weight: 700; color: var(--ink); }
        .co-total-amt {
          font-family: 'Playfair Display', serif;
          font-size: 28px; color: var(--ink); letter-spacing: -.4px;
        }
        .co-total-amt sup {
          font-size: 14px; vertical-align: super;
          font-family: 'Outfit', sans-serif; font-weight: 600;
        }

        /* confirm btn */
        .co-confirm-btn {
          width: 100%; padding: 14px;
          background: var(--blue); color: #fff;
          border: none; border-radius: 10px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s, transform .1s;
          margin-top: 16px;
        }
        .co-confirm-btn:hover:not(:disabled) { background: #1e40af; transform: translateY(-1px); }
        .co-confirm-btn:active:not(:disabled) { transform: translateY(0); }
        .co-confirm-btn:disabled { background: #93c5fd; cursor: not-allowed; }

        /* trust */
        .co-trust { display: flex; flex-direction: column; gap: 7px; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 14px; }
        .co-trust-line { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted); }

        /* mobile cta */
        .co-mobile-cta {
          position: fixed; bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(14px);
          border-top: 1px solid var(--border); z-index: 50;
        }

        /* error submit */
        .co-submit-err {
          display: flex; align-items: center; gap: 8px;
          background: var(--red-soft); border: 1px solid #fecaca;
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: var(--red); margin-top: 12px;
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="co-header">
        <button className="co-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="co-hdivider" />
        <span className="co-htitle">Checkout</span>
      </div>

      {/* ── PROGRESS ───────────────────────────────────── */}
      <div className="co-progress">
        {[["1", "Details", true], ["2", "Schedule", true], ["3", "Confirm", false]].map(([n, label, active], i) => (
          <span key={n} style={{ display: "contents" }}>
            <span className={`co-pill${active ? " active" : ""}`}>
              <span className="co-pill-dot">{n}</span> {label}
            </span>
            {i < 2 && <span className="co-pill-sep">›</span>}
          </span>
        ))}
      </div>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className="co-body">

        {/* ═══ LEFT ═══════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Customer */}
          <StepCard step={1} title="Your Details" icon={User}>
            <div className="co-grid2">
              <Field label="Full Name" icon={User} error={errors.name}>
                <input name="name" placeholder="Rahul Sharma" onChange={handleChange} value={form.name}
                  className={`co-input${errors.name ? " error" : ""}`} />
              </Field>
              <Field label="Phone Number" icon={Phone} error={errors.phone}>
                <input name="phone" placeholder="9876543210" onChange={handleChange} value={form.phone}
                  className={`co-input${errors.phone ? " error" : ""}`} />
              </Field>
            </div>
          </StepCard>

          {/* Area */}
          <div className={`co-area-card${errors.area ? " has-error" : ""}`} style={{ animationDelay: "60ms" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: selectedArea ? "#f0fdf4" : "var(--blue-soft)",
                border: `1px solid ${selectedArea ? "#bbf7d0" : "var(--blue-mid)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MapPin size={15} color={selectedArea ? "var(--green)" : "var(--blue)"} />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)" }}>Step 2</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Service Area</p>
                {selectedArea ? (
                  <div style={{ marginTop: 6 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-soft)" }}>{selectedArea.name}</p>
                    {extraCharge > 0 && (
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>+ ₹{extraCharge} area charge applied</p>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: errors.area ? "var(--red)" : "var(--muted)", marginTop: 4 }}>
                    {errors.area || "Select your service area to continue"}
                  </p>
                )}
              </div>
            </div>
            <button className="co-select-btn" onClick={() => setOpenAreaModal(true)}>
              {selectedArea ? "Change" : "Select Area"}
            </button>
          </div>

          <AreaModal isOpen={openAreaModal} onClose={() => setOpenAreaModal(false)} />

          {/* Address */}
          <StepCard step={3} title="Service Address" icon={Home} >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="co-grid2">
                <Field label="House / Flat No." error={errors.houseNumber}>
                  <input name="houseNumber" placeholder="B-204" onChange={handleChange} value={form.houseNumber}
                    className={`co-input${errors.houseNumber ? " error" : ""}`} />
                </Field>
                <Field label="City" error={errors.city}>
                  <input name="city" placeholder="Bhiwandi" onChange={handleChange} value={form.city}
                    className={`co-input${errors.city ? " error" : ""}`} />
                </Field>
              </div>
              <Field label="Street / Locality" error={errors.street}>
                <input name="street" placeholder="Kalyan Road, Near station" onChange={handleChange} value={form.street}
                  className={`co-input${errors.street ? " error" : ""}`} />
              </Field>
            </div>
          </StepCard>

          {/* Schedule */}
          <StepCard step={4} title="Schedule" icon={Calendar}>
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

    {/* DATE & TIME */}
    <div className="co-grid2">
      <Field label="Preferred Date" icon={Calendar} error={errors.date}>
        <input
          type="date"
          name="date"
          min={today}
          onChange={handleChange}
          value={form.date}
          className={`co-input${errors.date ? " error" : ""}`}
        />
      </Field>

      <Field label="Preferred Time" icon={Clock} error={errors.timeSlot}>
        <input
          type="time"
          name="timeSlot"
          onChange={handleChange}
          value={form.timeSlot}
          className={`co-input${errors.timeSlot ? " error" : ""}`}
        />
      </Field>
    </div>

    {/* ── REQUIREMENTS ───────────────────────── */}
    {hasInspection && (
  <>
    {/* ── REQUIREMENTS ───────────────────────── */}
    <Field label="Requirements (Scope of Work)">
      <textarea
        placeholder="Describe your issue, preferences or specific instructions..."
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        className="co-input"
        style={{ minHeight: 90, resize: "vertical" }}
      />
    </Field>

    {/* ── BUDGET ───────────────────────── */}
    <Field label="Your Budget (Optional)">
      <input
        type="number"
        placeholder="Enter your expected budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="co-input"
      />
    </Field>
  </>
)}

  </div>
</StepCard>

        </div>

        {/* ═══ SIDEBAR ════════════════════════════════ */}
        <div className="co-sidebar" style={{ display: "none" }}>
          <div style={{ position: "sticky", top: 120, display: "flex", flexDirection: "column", gap: 14 }}>

            <div className="co-summary-card">
              <div className="co-summary-top">
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                  Order summary
                </p>

                {cartItems.map((item, i) => (
                  <div key={i} className="co-sum-row">
                    <span style={{ maxWidth: 165, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name} <span style={{ color: "var(--muted)", fontWeight: 400 }}>×{item.quantity}</span>
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="co-divider" />

                <div className="co-sum-row">
                  <span style={{ fontWeight: 400, color: "var(--muted)" }}>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {selectedArea && extraCharge > 0 && (
                  <div className="co-sum-row">
                    <span style={{ fontWeight: 400, color: "var(--muted)" }}>Area charge ({selectedArea.name})</span>
                    <span>₹{extraCharge}</span>
                  </div>
                )}

                <div className="co-total-row">
                  <span className="co-total-label">Total</span>
                  <span className="co-total-amt"><sup>₹</sup>{total}</span>
                </div>
              </div>

              <div className="co-summary-bottom">
                {errors.submit && (
                  <div className="co-submit-err">
                    <AlertCircle size={14} /> {errors.submit}
                  </div>
                )}

                <button className="co-confirm-btn" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <><Loader2 size={15} style={{ animation: "spin .7s linear infinite" }} /> Processing…</>
                    : <>Confirm Booking <ArrowRight size={15} /></>
                  }
                </button>

                <div className="co-trust">
                  <div className="co-trust-line"><ShieldCheck size={13} color="var(--green)" /> Secure & encrypted booking</div>
                  <div className="co-trust-line"><CheckCircle2 size={13} color="var(--green)" /> Verified professionals only</div>
                  <div className="co-trust-line"><Zap size={13} color="#d97706" /> Instant confirmation via SMS</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE CTA ─────────────────────────────── */}
      <div className="co-mobile-cta">
        <button className="co-confirm-btn" onClick={handleSubmit} disabled={loading} style={{ marginTop: 0 }}>
          {loading
            ? <><Loader2 size={15} style={{ animation: "spin .7s linear infinite" }} /> Processing…</>
            : <>Confirm Booking · ₹{total} <ArrowRight size={14} /></>
          }
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}