import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import API from "../../api/api";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (inject once)
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:        #0d0f14;
    --ink-soft:   #4a5060;
    --ink-muted:  #8a92a6;
    --surface:    #ffffff;
    --canvas:     #f4f5f8;
    --accent:     #1a56db;
    --accent-dim: #e8eefb;
    --success:    #059669;
    --success-dim:#d1fae5;
    --danger:     #dc2626;
    --danger-dim: #fee2e2;
    --warn:       #d97706;
    --warn-dim:   #fef3c7;
    --border:     #e2e5ee;
    --radius:     14px;
    --shadow-sm:  0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md:  0 4px 16px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.05);
    --shadow-lg:  0 20px 50px rgba(0,0,0,.14), 0 8px 20px rgba(0,0,0,.08);
  }

  .gaq-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .gaq-wrap { font-family: 'DM Sans', sans-serif; background: var(--canvas); min-height: 100vh; color: var(--ink); }

  .gaq-header { padding: 36px 40px 0; display: flex; align-items: flex-end; justify-content: space-between; }
  .gaq-header h1 { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; letter-spacing: -.5px; }
  .gaq-header p  { color: var(--ink-muted); font-size: 14px; margin-top: 4px; }
  .gaq-header-right { display: flex; align-items: center; gap: 20px; }
  .gaq-header-stat { text-align: right; }
  .gaq-header-stat span { font-size: 13px; color: var(--ink-muted); }
  .gaq-header-stat strong { display: block; font-size: 22px; font-weight: 600; color: var(--accent); }

  .btn-new-invoice {
    display: flex; align-items: center; gap: 8px;
    background: var(--accent); color: #fff;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    border-radius: 12px; padding: 11px 20px;
    transition: filter .15s, transform .1s, box-shadow .15s;
    box-shadow: 0 4px 14px rgba(26,86,219,.35);
    letter-spacing: .2px; white-space: nowrap;
  }
  .btn-new-invoice:hover { filter: brightness(1.1); box-shadow: 0 6px 20px rgba(26,86,219,.45); }
  .btn-new-invoice:active { transform: scale(.97); }
  .btn-new-invoice svg { flex-shrink: 0; }

  .gaq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 22px; padding: 28px 40px 48px; }

  .gaq-card { background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-sm); border: 1px solid var(--border); overflow: hidden; transition: box-shadow .2s, transform .2s; display: flex; flex-direction: column; }
  .gaq-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

  .gaq-card-img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .gaq-card-img-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, #e8eefb 0%, #dde3f0 100%); display: flex; align-items: center; justify-content: center; color: var(--ink-muted); font-size: 13px; }

  .gaq-card-body { padding: 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .gaq-card-body .worker { font-weight: 600; font-size: 15px; color: var(--ink); }
  .gaq-card-body .client { font-size: 13px; color: var(--ink-muted); }
  .gaq-card-body .desc   { font-size: 13px; color: var(--ink-soft); line-height: 1.55; flex: 1; margin-top: 4px; }

  .gaq-card-footer { padding: 14px 20px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); }
  .gaq-price { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; }
  .gaq-status-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: .4px; text-transform: uppercase; }
  .status-pending   { background: var(--warn-dim);    color: var(--warn); }
  .status-approved  { background: var(--success-dim); color: var(--success); }
  .status-rejected  { background: var(--danger-dim);  color: var(--danger); }
  .status-sent_to_customer { background: var(--accent-dim); color: var(--accent); }

  .gaq-card-actions { padding: 0 20px 18px; display: flex; gap: 10px; }
  .btn { border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; border-radius: 10px; padding: 10px 0; transition: filter .15s, transform .1s; letter-spacing: .2px; }
  .btn:active { transform: scale(.97); }
  .btn-approve  { flex:1; background: var(--success); color: #fff; }
  .btn-approve:hover  { filter: brightness(1.08); }
  .btn-reject   { flex:1; background: var(--danger);  color: #fff; }
  .btn-reject:hover   { filter: brightness(1.08); }
  .btn-invoice  { width: 100%; background: var(--accent); color: #fff; }
  .btn-invoice:hover  { filter: brightness(1.1); }

  .gaq-overlay { position: fixed; inset: 0; background: rgba(13,15,20,.55); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; animation: fadeIn .18s ease; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .gaq-modal { background: var(--surface); border-radius: 20px; width: 100%; max-width: 680px; max-height: 92vh; overflow-y: auto; box-shadow: var(--shadow-lg); animation: slideUp .22s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

  .modal-header { padding: 28px 32px 22px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--surface); z-index: 2; display: flex; align-items: center; justify-content: space-between; border-radius: 20px 20px 0 0; }
  .modal-header h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
  .modal-header .subtitle { color: var(--ink-muted); font-size: 13px; margin-top: 3px; }
  .modal-close { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; cursor: pointer; font-size: 16px; color: var(--ink-muted); display: flex; align-items: center; justify-content: center; transition: background .15s; }
  .modal-close:hover { background: var(--canvas); color: var(--ink); }

  .modal-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }

  .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-group label { font-size: 12px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: .6px; }
  .field-group input, .field-group textarea, .field-group select {
    width: 100%; border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    background: var(--surface); outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .field-group input:focus, .field-group textarea:focus, .field-group select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,86,219,.12);
  }
  .field-group textarea { resize: vertical; min-height: 80px; }

  .section-divider { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--ink-muted); display: flex; align-items: center; gap: 10px; }
  .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .items-header { display: grid; grid-template-columns: 1fr 80px 100px 36px; gap: 8px; padding: 0 4px 6px; }
  .items-header span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--ink-muted); }
  .item-row { display: grid; grid-template-columns: 1fr 80px 100px 36px; gap: 8px; align-items: center; }
  .item-row input { border: 1.5px solid var(--border); border-radius: 8px; padding: 9px 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink); outline: none; transition: border-color .15s; width: 100%; }
  .item-row input:focus { border-color: var(--accent); }
  .btn-remove { width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid var(--danger-dim); background: var(--danger-dim); color: var(--danger); font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s; }
  .btn-remove:hover { background: #fca5a5; }
  .btn-add-item { background: var(--canvas); border: 1.5px dashed var(--border); border-radius: 10px; padding: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--ink-muted); cursor: pointer; width: 100%; transition: border-color .15s, color .15s; }
  .btn-add-item:hover { border-color: var(--accent); color: var(--accent); }

  .total-row { display: flex; justify-content: flex-end; align-items: center; gap: 16px; padding: 14px 0 0; border-top: 1px solid var(--border); }
  .total-row .label { font-size: 13px; color: var(--ink-muted); }
  .total-row .amount { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--accent); }

  .modal-footer { padding: 20px 32px 28px; display: flex; gap: 12px; }
  .btn-pdf   { flex: 1; background: var(--ink); color: #fff; padding: 13px; border-radius: 12px; font-size: 14px; }
  .btn-pdf:hover   { filter: brightness(1.2); }
  .btn-cancel { flex: 1; background: var(--canvas); color: var(--ink-soft); border: 1.5px solid var(--border); padding: 13px; border-radius: 12px; font-size: 14px; }
  .btn-cancel:hover { background: var(--border); }

  .gaq-loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--ink-muted); gap: 10px; }
  .spinner { width: 20px; height: 20px; border: 2.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg) } }

  .gaq-empty { grid-column: 1/-1; text-align: center; padding: 64px 0; color: var(--ink-muted); font-size: 15px; }
  .gaq-empty svg { margin: 0 auto 16px; display: block; opacity: .3; }

  .modal-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--accent-dim); color: var(--accent);
    font-size: 11px; font-weight: 700; letter-spacing: .5px;
    text-transform: uppercase; padding: 4px 10px; border-radius: 20px;
    margin-bottom: 4px;
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const fmt    = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtPDF = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

const statusClass = (s) =>
  ({ pending: "status-pending", approved: "status-approved", rejected: "status-rejected", sent_to_customer: "status-sent_to_customer" }[s] || "status-pending");

const statusLabel = (s) =>
  ({ pending: "Pending", approved: "Approved", rejected: "Rejected", sent_to_customer: "Sent" }[s] || s);

/* ─────────────────────────────────────────────
   PDF GENERATOR  — fixed professional table
   Key fix: strict column x-coords + splitTextToSize
   for the description column so it NEVER overflows
   into QTY / UNIT PRICE / AMOUNT columns.
───────────────────────────────────────────── */
function buildPDF({
  quotation,
  serviceTitle,
  description,
  materialIncluded,
  materialDetails,
  items,
  extraCharge,
  notes,
  standalone = false,
  clientName = "",
  workerName = "",
  invoiceRef = "",
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const margin = 14;
  const tableX = margin;
  const tableW = W - margin * 2;          // 182 mm

  /* ── Column x-positions (absolute from left) ──────────────────
     DESC  : left-aligned, text wraps up to descMaxX
     QTY   : center-aligned at 126 mm
     UPRICE: center-aligned at 152 mm
     AMOUNT: right-aligned  at W-margin-2 = 194 mm
     
     Gap between descMaxX (111) and qty-center (126) = 15 mm → safe
  ─────────────────────────────────────────────────────────────── */
  const COL = {
    descX:    tableX + 4,   // text start
    descMaxX: 111,          // hard right wall for description text
    qtyX:     126,          // center
    upX:      155,          // center
    amtX:     W - margin - 3, // right edge
  };
  const descColWidth = COL.descMaxX - COL.descX; // ≈ 93 mm

  const pageHeight = doc.internal.pageSize.height;

function ensureSpace(requiredHeight) {
  if (y + requiredHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
}

  // Resolve names & reference
  const resolvedClient = standalone ? clientName : quotation?.clientName || "—";
  const resolvedWorker = standalone ? workerName : quotation?.workerName || "—";
  const resolvedRef    = standalone
    ? (invoiceRef ? `#${invoiceRef.toUpperCase()}` : "#INV-MANUAL")
    : `#INV-${quotation?._id?.slice(-6).toUpperCase() || "000000"}`;

  /* ══ BACKGROUND ══ */
  doc.setFillColor(248, 249, 252);
  doc.rect(0, 0, W, H, "F");

  /* ══ HEADER BAR ══ */
  doc.setFillColor(13, 15, 20);
  doc.rect(0, 0, W, 52, "F");

  /* ── Blue diagonal accent ── */
  doc.setFillColor(26, 86, 219);
  doc.triangle(0, 52, 72, 52, 0, 78, "F");

  /* ── Brand ── */
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FINDERZZ", margin, 24);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 175, 200);
  doc.text("PROFESSIONAL SERVICES INVOICE", margin, 32);

  /* ── INVOICE label + ref ── */
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", W - margin, 28, { align: "right" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 175, 200);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  doc.text(resolvedRef, W - margin, 36, { align: "right" });
  doc.text(`Date: ${today}`, W - margin, 43, { align: "right" });

  /* ══ PARTIES BLOCK ══ */
  const col2x = W / 2 + 4;
  let y = 66;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 110, 140);
  doc.text("BILLED TO", margin, y);
  doc.text("SERVICE PROVIDER", col2x, y);

  y += 7;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 15, 20);
  doc.text(resolvedClient || "—", margin, y);
  doc.text(resolvedWorker || "—", col2x, y);

  y += 6;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 100, 120);
  doc.text("Service Requested",    margin, y);
  doc.text("Assigned Professional", col2x, y);

  /* ── Horizontal divider ── */
  y = 92;
  doc.setDrawColor(220, 225, 238);
  doc.setLineWidth(0.35);
  doc.line(margin, y, W - margin, y);

  /* ══ SERVICE TITLE & DESCRIPTION ══ */
  y += 10;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 15, 20);
  doc.text(serviceTitle || "Service", margin, y);

  y += 7;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 90, 110);
  const descLines = doc.splitTextToSize(description || "—", tableW);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.8 + 5;

  /* ── Material pill ── */
  const matIncluded = materialIncluded === "yes";
  const pillColor   = matIncluded ? [5, 150, 105]   : [220, 38, 38];
  const pillBg      = matIncluded ? [209, 250, 229]  : [254, 226, 226];
  const pillLabel   = matIncluded ? "Material Included" : "Material Excluded";
  const pillW2      = matIncluded ? 40 : 42;

  doc.setFillColor(...pillBg);
  doc.roundedRect(margin, y, pillW2, 7, 3, 3, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...pillColor);
  doc.text(pillLabel, margin + 3, y + 5);

  if (matIncluded && materialDetails) {
    y += 11;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 90, 110);
    const matLines = doc.splitTextToSize(materialDetails, tableW);
    doc.text(matLines, margin, y);
    y += matLines.length * 4.5;
  }

  /* ══════════════════════════════════════════════════════════════
     TABLE — strict column widths, dynamic row height per item
  ══════════════════════════════════════════════════════════════ */
  y += 12;
  const headerH = 11;

  // Header background
  doc.setFillColor(13, 15, 20);
  doc.roundedRect(tableX, y - 6, tableW, headerH, 3, 3, "F");

  // Header labels
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SERVICE DESCRIPTION", COL.descX, y);
  doc.text("Sq.ft / Rft",        COL.qtyX, y, { align: "center" });
  doc.text("Rate", COL.upX,  y, { align: "center" });
  doc.text("AMOUNT",     COL.amtX, y, { align: "right"  });

  y += 8;

  let subtotal = 0;
  const LINE_H = 4.8;   // mm per text line
  const PAD_V  = 5;     // vertical padding inside row (top + bottom together)
  const MIN_ROW= 11;    // minimum row height in mm

  items.forEach((item, idx) => {
    const qty      = Number(item.qty   || 0);
    const price    = Number(item.price || 0);
    const rowTotal = qty * price;
    subtotal += rowTotal;

    // Wrap description within its dedicated column width
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const nameLines = doc.splitTextToSize(item.name || "—", descColWidth);
    const rowH      = Math.max(nameLines.length * LINE_H + PAD_V, MIN_ROW);

    // Alternating background
    doc.setFillColor(idx % 2 === 0 ? 243 : 248, idx % 2 === 0 ? 245 : 249, idx % 2 === 0 ? 250 : 252);
    doc.rect(tableX, y - 2, tableW, rowH, "F");

    // Vertical midpoint for single-line numeric cells
    const midY = y + (rowH - PAD_V) / 2 - LINE_H / 2;

    // ── Description (wraps, top-aligned) ──
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 24, 36);
    doc.text(nameLines, COL.descX, y + 3.5);

    // ── QTY ──
    doc.setFontSize(8.5);
    doc.setTextColor(60, 70, 90);
    doc.text(String(qty), COL.qtyX, midY + 4.5, { align: "center" });

    // ── Unit Price ──
    doc.setTextColor(90, 100, 120);
    doc.text(fmtPDF(price), COL.upX, midY + 4.5, { align: "center" });

    // ── Amount ──
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 15, 20);
    doc.text(fmtPDF(rowTotal), COL.amtX, midY + 4.5, { align: "right" });

    // Row bottom divider
    doc.setDrawColor(220, 225, 238);
    doc.setLineWidth(0.25);
    doc.line(tableX, y + rowH - 2, tableX + tableW, y + rowH - 2);

    y += rowH;
  });

  /* ══ TOTALS ══ */
  y += 6;
  doc.setDrawColor(200, 208, 225);
  doc.setLineWidth(0.35);
  doc.line(margin, y, W - margin, y);
  y += 7;

  const extra      = Number(extraCharge || 0);
  const grandTotal = subtotal + extra;
  const totLabelX  = COL.amtX - 35;

  // Subtotal
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 100, 120);
  doc.text("Subtotal", totLabelX, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 24, 36);
  doc.text(fmtPDF(subtotal), COL.amtX, y, { align: "right" });
  y += 7;

  // Extra charges (conditional)
  if (extra > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 100, 120);
    doc.text("Extra Charges", totLabelX, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 24, 36);
    doc.text(fmtPDF(extra), COL.amtX, y, { align: "right" });
    y += 7;
  }

  // Grand total pill (full-width)
  const gtPillH = 14;
ensureSpace(gtPillH + 10); 
  doc.setFillColor(26, 86, 219);
  doc.roundedRect(tableX, y - 4, tableW, gtPillH, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", tableX + 8, y + 5);
  doc.text(fmtPDF(grandTotal), W - margin - 8, y + 5, { align: "right" });
  y += gtPillH + 10;

  /* ══ NOTES ══ */
  if (notes) {
    doc.setFontSize(8.5);
    const noteLines = doc.splitTextToSize(notes, tableW - 16);
    const noteH = noteLines.length * 5 + 16;
  
    ensureSpace(noteH + 10); // 🔑 critical fix
  
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(tableX, y, tableW, noteH, 4, 4, "F");
  
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 86, 219);
    doc.text("NOTES", tableX + 8, y + 8);
  
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 60, 90);
    doc.text(noteLines, tableX + 8, y + 14);
  
    y += noteH + 10;
  }

  /* ══ FOOTER ══ */
  const footerY = H - 20;
  doc.setFillColor(13, 15, 20);
  doc.rect(0, footerY - 2, W, 24, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 175, 200);
  doc.text("Thank you for choosing Finderzz — Trusted Professionals, Every Time.", W / 2, footerY + 5, { align: "center" });
  doc.setFontSize(7.5);
  doc.setTextColor(100, 115, 145);
  doc.text("www.finderzz.com  •  support.finderzz@gmail.com", W / 2, footerY + 11, { align: "center" });

  const filename = standalone
    ? `Finderzz-Invoice-${resolvedRef.replace(/^#/, "")}.pdf`
    : `Finderzz-Invoice-${resolvedRef}.pdf`;
  doc.save(filename);
}

/* ─────────────────────────────────────────────
   REUSABLE INVOICE FORM FIELDS
───────────────────────────────────────────── */
const InvoiceFormFields = ({
  standalone,
  clientName, setClientName,
  workerName, setWorkerName,
  invoiceRef, setInvoiceRef,
  serviceTitle, setServiceTitle,
  description, setDescription,
  materialIncluded, setMaterialIncluded,
  materialDetails, setMaterialDetails,
  items, addItem, removeItem, updateItem,
  extraCharge, setExtraCharge,
  notes, setNotes,
  totalAmount,
}) => (
  <>
    {standalone && (
      <>
        <div className="field-row-2">
          <div className="field-group">
            <label>Client Name</label>
            <input placeholder="e.g. Rahul Sharma" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Service Provider</label>
            <input placeholder="e.g. Amit Patil" value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
          </div>
        </div>
        <div className="field-group">
          <label>Invoice Reference / Number</label>
          <input placeholder="e.g. INV-2024-001  (optional)" value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} />
        </div>
        <div className="section-divider">Invoice Details</div>
      </>
    )}

    <div className="field-group">
      <label>Service Title</label>
      <input placeholder="e.g. Plumbing Repair" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} />
    </div>
    <div className="field-group">
      <label>Description</label>
      <textarea placeholder="Describe the work performed…" value={description} onChange={(e) => setDescription(e.target.value)} />
    </div>
    <div className="field-group">
      <label>Material</label>
      <select value={materialIncluded} onChange={(e) => setMaterialIncluded(e.target.value)}>
        <option value="yes">Material Included in Price</option>
        <option value="no">Material Not Included</option>
      </select>
    </div>
    {materialIncluded === "yes" && (
      <div className="field-group">
        <label>Material Details</label>
        <textarea placeholder="List materials used…" value={materialDetails} onChange={(e) => setMaterialDetails(e.target.value)} />
      </div>
    )}

    <div className="section-divider">Services Breakdown</div>
    <div>
      <div className="items-header">
        <span>Service</span><span>Sq.ft / Rft</span><span>Rate</span><span />
      </div>
      {items.map((item, i) => (
        <div className="item-row" key={i} style={{ marginBottom: 8 }}>
          <input placeholder="Service name" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
          <input type="number" min="1" value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
          <input type="number" min="0" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
          <button className="btn-remove" onClick={() => removeItem(i)}>−</button>
        </div>
      ))}
      <button className="btn-add-item" onClick={addItem}>+ Add Service Line</button>
    </div>

    <div className="field-group mt-10">
      <label>Extra Charges (₹)</label>
      <input type="number" min="0" placeholder="0" value={extraCharge} onChange={(e) => setExtraCharge(e.target.value)} />
    </div>
    <div className="total-row mt-10">
      <span className="label">Grand Total</span>
      <span className="amount">{fmt(totalAmount)}</span>
    </div>
    <div className="field-group mt-10">
      <label>Notes</label>
      <textarea placeholder="Payment terms, warranties, or any additional information…" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </div>
  </>
);

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const GetAllQuotation = () => {
  const [quotations, setQuotations]               = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal]                 = useState(false);
  const [previewImage, setPreviewImage]           = useState(null);
  const [showStandaloneModal, setShowStandaloneModal] = useState(false);

  const [serviceTitle,     setServiceTitle]     = useState("");
  const [description,      setDescription]      = useState("");
  const [materialIncluded, setMaterialIncluded] = useState("yes");
  const [materialDetails,  setMaterialDetails]  = useState("");
  const [items,            setItems]            = useState([{ name: "", qty: 1, price: 0 }]);
  const [extraCharge,      setExtraCharge]      = useState("");
  const [notes,            setNotes]            = useState("");

  const [standaloneClientName, setStandaloneClientName] = useState("");
  const [standaloneWorkerName, setStandaloneWorkerName] = useState("");
  const [standaloneInvoiceRef, setStandaloneInvoiceRef] = useState("");

  useEffect(() => {
    if (!document.getElementById("gaq-styles")) {
      const el = document.createElement("style");
      el.id = "gaq-styles";
      el.textContent = STYLE;
      document.head.appendChild(el);
    }
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await API.get("/quotation/admin");
      setQuotations(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchQuotations(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/quotation/${id}/status`, { status });
      fetchQuotations();
    } catch (e) { console.error(e); }
  };

  const addItem    = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i][field] = value;
    setItems(next);
  };

  const subtotal    = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
  const totalAmount = subtotal + Number(extraCharge || 0);

  const resetForm = () => {
    setServiceTitle(""); setDescription("");
    setMaterialIncluded("yes"); setMaterialDetails("");
    setItems([{ name: "", qty: 1, price: 0 }]);
    setExtraCharge(""); setNotes("");
  };

  const openModal = (q) => { setSelectedQuotation(q); resetForm(); setShowModal(true); };
  const openStandaloneModal = () => {
    setStandaloneClientName(""); setStandaloneWorkerName(""); setStandaloneInvoiceRef("");
    resetForm();
    setShowStandaloneModal(true);
  };

  if (loading) {
    return (
      <div className="gaq-loading">
        <div className="spinner" />
        Loading quotations…
      </div>
    );
  }

  const formProps = {
    serviceTitle, setServiceTitle, description, setDescription,
    materialIncluded, setMaterialIncluded, materialDetails, setMaterialDetails,
    items, addItem, removeItem, updateItem,
    extraCharge, setExtraCharge, notes, setNotes, totalAmount,
  };

  const pdfProps = { serviceTitle, description, materialIncluded, materialDetails, items, extraCharge, notes };

  return (
    <div className="gaq-wrap">

      {/* ── Header ── */}
      <div className="gaq-header">
        <div>
          <h1>Quotation Requests</h1>
          <p>Review, approve or create invoices for incoming service requests</p>
        </div>
        <div className="gaq-header-right">
          <button className="btn-new-invoice" onClick={openStandaloneModal}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            New Invoice
          </button>
          <div className="gaq-header-stat">
            <span>Total requests</span>
            <strong>{quotations.length}</strong>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="gaq-grid">
        {quotations.length === 0 && (
          <div className="gaq-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            No quotation requests yet.
          </div>
        )}

        {quotations.map((q) => (
          <div key={q._id} className="gaq-card">
            {q.quotationImages
              ? <img src={q.quotationImages} alt="quotation" className="gaq-card-img" onClick={() => setPreviewImage(q.quotationImages)} style={{ cursor: "zoom-in" }} />
              : <div className="gaq-card-img-placeholder">No image</div>
            }
            <div className="gaq-card-body">
              <p className="worker">{q.workerName}</p>
              <p className="client">{q.clientName}</p>
              {q.description && <p className="desc">{q.description}</p>}
            </div>
            <div className="gaq-card-footer">
              <span className="gaq-price">{fmt(q.estimatedPrice)}</span>
              <span className={`gaq-status-badge ${statusClass(q.status)}`}>{statusLabel(q.status)}</span>
            </div>
            {q.status === "pending" && (
              <div className="gaq-card-actions">
                <button className="btn btn-approve" onClick={() => updateStatus(q._id, "approved")}>✓ Approve</button>
                <button className="btn btn-reject"  onClick={() => updateStatus(q._id, "rejected")}>✕ Reject</button>
              </div>
            )}
            {q.status === "approved" && (
              <div className="gaq-card-actions">
                <button className="btn btn-invoice" onClick={() => openModal(q)}>↓ Create Invoice</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Quotation-linked modal ── */}
      {showModal && (
        <div className="gaq-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="gaq-modal">
            <div className="modal-header">
              <div>
                <h2>Create Invoice</h2>
                <p className="subtitle">{selectedQuotation?.clientName} · {selectedQuotation?.workerName}</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <InvoiceFormFields standalone={false} {...formProps} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-pdf" onClick={() => buildPDF({ quotation: selectedQuotation, ...pdfProps, standalone: false })}>
                ↓ Download PDF Invoice
              </button>
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Standalone modal ── */}
      {showStandaloneModal && (
        <div className="gaq-overlay" onClick={(e) => e.target === e.currentTarget && setShowStandaloneModal(false)}>
          <div className="gaq-modal">
            <div className="modal-header">
              <div>
                <span className="modal-tag">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Invoice
                </span>
                <h2>Create Invoice</h2>
                <p className="subtitle">Fill in all the details manually</p>
              </div>
              <button className="modal-close" onClick={() => setShowStandaloneModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <InvoiceFormFields
                standalone={true}
                clientName={standaloneClientName} setClientName={setStandaloneClientName}
                workerName={standaloneWorkerName} setWorkerName={setStandaloneWorkerName}
                invoiceRef={standaloneInvoiceRef} setInvoiceRef={setStandaloneInvoiceRef}
                {...formProps}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-pdf" onClick={() =>
                buildPDF({ quotation: null, ...pdfProps, standalone: true, clientName: standaloneClientName, workerName: standaloneWorkerName, invoiceRef: standaloneInvoiceRef })
              }>
                ↓ Download PDF Invoice
              </button>
              <button className="btn btn-cancel" onClick={() => setShowStandaloneModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image preview ── */}
      {previewImage && (
        <div className="gaq-overlay" onClick={() => setPreviewImage(null)}>
          <div style={{ maxWidth: "95vw", maxHeight: "95vh", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Full preview" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} />
            <button onClick={() => setPreviewImage(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default GetAllQuotation;