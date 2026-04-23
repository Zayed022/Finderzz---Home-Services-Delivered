import { useEffect, useState } from "react";
import { Search, User, ChevronLeft, ChevronRight, MapPin, Calendar, Clock, Package, Wallet, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import API from "../api/api";

/* ─── status config ───────────────────────────────────────────── */
const STATUS_CONFIG = {
  pending:     { label: "Pending",     dot: "#D97706", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  confirmed:   { label: "Confirmed",   dot: "#2563EB", bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  assigned:    { label: "Assigned",    dot: "#7C3AED", bg: "#F5F3FF", text: "#4C1D95", border: "#DDD6FE" },
  in_progress: { label: "In Progress", dot: "#0891B2", bg: "#ECFEFF", text: "#164E63", border: "#A5F3FC" },
  completed:   { label: "Completed",   dot: "#16A34A", bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0" },
  cancelled:   { label: "Cancelled",   dot: "#DC2626", bg: "#FEF2F2", text: "#7F1D1D", border: "#FECACA" },
};

const ALL_STATUSES = ["all", "pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"];

const ACTION_STATUSES = ["confirmed", "assigned", "in_progress", "completed", "cancelled"];

/* ─── helpers ─────────────────────────────────────────────────── */
const formatDateOnly = (date) =>
  new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" });

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const actionStyle = (s) => {
  const map = {
    confirmed:   "text-blue-600 border-blue-200 hover:bg-blue-50",
    assigned:    "text-violet-600 border-violet-200 hover:bg-violet-50",
    in_progress: "text-cyan-600 border-cyan-200 hover:bg-cyan-50",
    completed:   "text-green-600 border-green-200 hover:bg-green-50",
    cancelled:   "text-red-500 border-red-200 hover:bg-red-50",
  };
  return map[s] || "";
};

/* ─── sub-components ──────────────────────────────────────────── */

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {};
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 10px",
        borderRadius: 20,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label || status}
    </span>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />}
      <div>
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    </div>
  );
}

function WorkerAvatar({ name }) {
  const colors = [
    ["#DCFCE7", "#16A34A"],
    ["#DBEAFE", "#2563EB"],
    ["#EDE9FE", "#7C3AED"],
    ["#FEF9C3", "#CA8A04"],
  ];
  const [bg, fg] = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────── */

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [reassigningIds, setReassigningIds] = useState([]);

  /* fetch */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/booking?status=${status}&page=${page}&limit=10&search=${search}`
      );
      setBookings(res.data.data);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Fetch bookings failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/worker/approved");
      setWorkers(res.data.data);
    } catch (err) {
      console.error("Workers fetch failed", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, page]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  /* actions */
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await API.patch(`/booking/${id}/status`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const assignWorker = async (bookingId, workerId) => {
    if (!workerId) return;
    try {
      await API.patch(`/booking/${bookingId}/assign-worker`, { workerId });
      // Close the reassign dropdown after successful assignment
      setReassigningIds((prev) => prev.filter((id) => id !== bookingId));
      fetchBookings();
    } catch (err) {
      console.error("Assign worker failed", err);
    }
  };

  const unassignWorker = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/unassign`);
      setReassigningIds((prev) => prev.filter((id) => id !== bookingId));
      fetchBookings();
    } catch (err) {
      console.error("Unassign worker failed", err);
    }
  };

  const toggleReassign = (bookingId) => {
    setReassigningIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleFilterChange = (s) => {
    setStatus(s);
    setPage(1);
  };

  /* ── render ── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Booking Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage customer bookings and worker assignments
            </p>
          </div>

          {/* search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              placeholder="Search by phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBookings()}
              className="outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400 w-full sm:w-48"
            />
            <button
              onClick={fetchBookings}
              className="text-blue-600 text-xs font-medium hover:text-blue-700 flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* ── status filters ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isActive = status === s;
            return (
              <button
                key={s}
                onClick={() => handleFilterChange(s)}
                style={
                  isActive && cfg
                    ? { background: cfg.bg, color: cfg.text, borderColor: cfg.border }
                    : {}
                }
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? "border-current"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {s === "all" ? "All bookings" : s.replace("_", " ")}
              </button>
            );
          })}
        </div>

        {/* ── loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading bookings…</span>
          </div>
        )}

        {/* ── empty ── */}
        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Package size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">No bookings found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try changing the filter or search query
            </p>
          </div>
        )}

        {/* ── booking cards ── */}
        {!loading && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isUpdating = updatingId === booking._id;
              const isReassigning = reassigningIds.includes(booking._id);
              return (
                <div
                  key={booking._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  {/* card header */}
                  <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={15} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.customerDetails?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.customerDetails?.phone} · #{booking._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isUpdating && (
                        <Loader2 size={13} className="animate-spin text-gray-400" />
                      )}
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  {/* card body */}
                  <div className="px-5 py-4 space-y-4">

                    {/* booking info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <InfoItem
                        label="Area"
                        value={booking.areaId?.name}
                        icon={MapPin}
                      />
                      <InfoItem
                        label="Scheduled"
                        value={formatDateOnly(booking.scheduledDate)}
                        icon={Calendar}
                      />
                      <InfoItem
                        label="Time slot"
                        value={booking.timeSlot}
                        icon={Clock}
                      />
                      <InfoItem
                        label="Booked on"
                        value={formatDateTime(booking.createdAt)}
                        icon={Calendar}
                      />
                    </div>

                    {/* address */}
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">
                        Address
                      </p>
                      <p className="text-sm text-gray-700">
                        {booking.address?.houseNumber}, {booking.address?.buildingName}
                        {booking.address?.floorNumber && ` — Floor ${booking.address.floorNumber}`}
                      </p>
                      {booking.address?.landmark && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Near {booking.address.landmark}
                        </p>
                      )}
                      {booking.address?.fullAddress && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {booking.address.fullAddress}
                        </p>
                      )}
                    </div>

                    {/* services */}
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-2">
                        Services
                      </p>
                      <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                        {booking.services.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-4 py-2.5 bg-white"
                          >
                           <span className="text-sm text-gray-700">
  {s.bookingType === "inspection" ? (
    <>
      {s.serviceId?.name || s.subServiceId?.serviceId?.name || "Service"}
      <span className="text-gray-400"> — Inspection</span>
    </>
  ) : (
    <>
      <span className="font-medium">
        {s.subServiceId?.serviceId?.name || "Service"}
      </span>
      <span className="text-gray-400"> — </span>
      <span>
        {s.subServiceId?.name || "Sub-service"}
      </span>
    </>
  )}
</span>
                            <span className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5 font-medium">
                              ×{s.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* requirements / budget */}
                    {(booking.requirements || booking.budget) && (
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {booking.requirements && (
                          <span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mr-1">
                              Requirements
                            </span>
                            {booking.requirements}
                          </span>
                        )}
                        {booking.budget && (
                          <span className="flex items-center gap-1">
                            <Wallet size={12} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mr-0.5">
                              Budget
                            </span>
                            ₹{booking.budget}
                          </span>
                        )}
                      </div>
                    )}

                    {/* pricing */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Subtotal", value: `₹${booking.subtotal}`, highlight: false },
                        { label: "Area fee", value: `₹${booking.extraCharge}`, highlight: false },
                        { label: "Total", value: `₹${booking.totalPrice}`, highlight: true },
                      ].map(({ label, value, highlight }) => (
                        <div
                          key={label}
                          className={`rounded-xl px-4 py-3 ${
                            highlight ? "bg-blue-50 border border-blue-100" : "bg-gray-50"
                          }`}
                        >
                          <p className={`text-[11px] font-medium uppercase tracking-wide ${
                            highlight ? "text-blue-400" : "text-gray-400"
                          }`}>
                            {label}
                          </p>
                          <p className={`text-base font-semibold mt-0.5 ${
                            highlight ? "text-blue-600" : "text-gray-800"
                          }`}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* assigned worker */}
                    {booking.workerId && (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                        <WorkerAvatar name={booking.workerId.name} />
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-0.5">
                            Assigned worker
                          </p>
                          <p className="text-sm font-semibold text-green-800">
                            {booking.workerId.name}
                          </p>
                          <p className="text-xs text-green-600">{booking.workerId.phone}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => toggleReassign(booking._id)}
                            title="Reassign worker"
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                              isReassigning
                                ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                                : "bg-white border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                          >
                            <RefreshCw size={11} />
                            {isReassigning ? "Cancel" : "Reassign"}
                          </button>
                          <CheckCircle2 size={18} className="text-green-400" />
                        </div>
                      </div>
                    )}

                    {/* reassign worker dropdown — shown when reassign is toggled */}
                    {booking.workerId && isReassigning && (
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                          Select new worker
                        </p>
                        <select
                          defaultValue=""
                          onChange={(e) => assignWorker(booking._id, e.target.value)}
                          className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 transition"
                        >
                          <option value="" disabled>
                            Select a worker to reassign…
                          </option>
                          {workers
                            .filter((w) => w._id !== booking.workerId?._id)
                            .map((worker) => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name} ({worker.phone})
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* assign worker dropdown — shown on pending bookings with no worker */}
                    {booking.status === "pending" && !booking.workerId && (
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                          Assign worker
                        </p>
                        <select
                          defaultValue=""
                          onChange={(e) => assignWorker(booking._id, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                        >
                          <option value="" disabled>
                            Select a worker…
                          </option>
                          {workers.map((worker) => (
                            <option key={worker._id} value={worker._id}>
                              {worker.name} ({worker.phone})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* card footer — action bar */}
                  <div className="px-5 pb-4 pt-1 flex flex-wrap gap-2 border-t border-gray-50">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide self-center mr-1">
                      Move to
                    </span>
                    {ACTION_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(booking._id, s)}
                        disabled={isUpdating || booking.status === s}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          booking.status === s
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-default"
                            : actionStyle(s)
                        }`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={14} />
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}