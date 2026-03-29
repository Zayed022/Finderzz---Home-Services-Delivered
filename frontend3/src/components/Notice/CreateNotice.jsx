import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

/* ─── options ───────────────────────────── */
const ICON_OPTIONS = ["info", "warning", "time", "alert", "shield"];
const TYPE_OPTIONS = ["info", "warning", "delay", "critical"];

export default function CreateNotice() {
  const navigate = useNavigate();

  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("info");
  const [type, setType] = useState("info");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/notice/", {
        heading,
        message,
        icon,
        type,
      });

      navigate("/notice"); // adjust if needed
    } catch (err) {
      console.error(err);
      alert("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  /* ─── preview styles ───────────────────── */
  const TYPE_STYLES = {
    info: { bg: "#eff6ff", border: "#bfdbfe" },
    warning: { bg: "#fefce8", border: "#fde68a" },
    delay: { bg: "#fff7ed", border: "#fdba74" },
    critical: { bg: "#fee2e2", border: "#fca5a5" },
  };

  const previewStyle = TYPE_STYLES[type] || TYPE_STYLES.info;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Notice
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Create a notice to inform users about delays, warnings or updates
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* HEADING */}
          <div>
            <label className="block text-sm mb-1">Heading</label>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Service Delay Notice"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain the notice clearly..."
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>

          {/* ICON */}
          <div>
            <label className="block text-sm mb-1">Icon</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* PREVIEW */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">Preview</h2>

            <div
              className="border rounded-xl p-4"
              style={{
                background: previewStyle.bg,
                borderColor: previewStyle.border,
              }}
            >
              <p className="text-sm font-bold text-gray-800">
                {heading || "Notice Heading"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {message || "Notice message will appear here..."}
              </p>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Notice..." : "Create Notice"}
          </button>

        </form>
      </div>
    </div>
  );
}