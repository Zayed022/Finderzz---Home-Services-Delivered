import { useQuery } from "@tanstack/react-query";
import { Info, AlertTriangle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import API from "../api/axios.js";

/* ─── Injected styles ─────────────────────────── */
const NOTICE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  .notice-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
    font-family: 'DM Sans', sans-serif;
  }

  .notice-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px 14px 14px;
    border-radius: 12px;
    overflow: hidden;
    animation: noticeSlideIn .4s cubic-bezier(.22,1,.36,1) both;
  }

  .notice-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3.5px;
    border-radius: 12px 0 0 12px;
  }

  /* Type accent bar colors */
  .notice-info::before    { background: #3b82f6; }
  .notice-warning::before { background: #f59e0b; }
  .notice-delay::before   { background: #f97316; }
  .notice-critical::before{ background: #ef4444; }

  /* Type backgrounds */
  .notice-info    { background: #f0f6ff; border: 1px solid #c7d9f9; }
  .notice-warning { background: #fffbeb; border: 1px solid #fde68a; }
  .notice-delay   { background: #fff7f0; border: 1px solid #fed7aa; }
  .notice-critical{ background: #fff5f5; border: 1px solid #fecaca; }

  /* Icon wrapper */
  .notice-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .notice-info     .notice-icon-wrap { background: #dbeafe; }
  .notice-warning  .notice-icon-wrap { background: #fef3c7; }
  .notice-delay    .notice-icon-wrap { background: #ffedd5; }
  .notice-critical .notice-icon-wrap { background: #fee2e2; }

  /* Type badge */
  .notice-badge {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .6px;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 20px;
    margin-bottom: 5px;
  }
  .notice-info     .notice-badge { background: #dbeafe; color: #1d4ed8; }
  .notice-warning  .notice-badge { background: #fef3c7; color: #92400e; }
  .notice-delay    .notice-badge { background: #ffedd5; color: #9a3412; }
  .notice-critical .notice-badge { background: #fee2e2; color: #b91c1c; }

  .notice-heading {
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin: 0 0 4px;
    letter-spacing: -.15px;
  }

  .notice-message {
    font-size: 12.5px;
    font-weight: 400;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }

  /* Shimmer loader */
  .notice-shimmer {
    border-radius: 12px;
    height: 66px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border: 1px solid #e2e8f0;
  }

  @keyframes noticeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function injectStyles() {
  if (typeof document !== "undefined" && !document.getElementById("notice-css")) {
    const el = document.createElement("style");
    el.id = "notice-css";
    el.textContent = NOTICE_CSS;
    document.head.appendChild(el);
  }
}

/* ─── Config maps ─────────────────────────────── */
const ICON_MAP = {
  info:    Info,
  warning: AlertTriangle,
  time:    Clock,
  alert:   AlertCircle,
  shield:  ShieldCheck,
};

const ICON_COLOR = {
  info:     "#2563eb",
  warning:  "#d97706",
  delay:    "#ea580c",
  critical: "#dc2626",
};

const TYPE_LABEL = {
  info:     "Info",
  warning:  "Warning",
  delay:    "Delay",
  critical: "Critical",
};

/* ─── Component ───────────────────────────────── */
export default function Notice() {
  injectStyles();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await API.get("/notice/active");
      return res.data.data;
    },
  });

  /* Loading — show skeleton */
  if (isLoading) {
    return (
      <div className="notice-stack">
        <div className="notice-shimmer" />
        <div className="notice-shimmer" style={{ opacity: 0.6 }} />
      </div>
    );
  }

  if (isError || !data || data.length === 0) return null;

  return (
    <div className="notice-stack">
      {data.map((notice, i) => {
        const Icon  = ICON_MAP[notice.icon] || Info;
        const type  = notice.type || "info";
        const color = ICON_COLOR[type] || ICON_COLOR.info;
        const label = TYPE_LABEL[type]  || "Notice";

        return (
          <div
            key={notice._id}
            className={`notice-item notice-${type}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Icon */}
            <div className="notice-icon-wrap">
              <Icon size={16} color={color} strokeWidth={2.2} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="notice-badge">{label}</span>
              <p className="notice-heading">{notice.heading}</p>
              <p className="notice-message">{notice.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}