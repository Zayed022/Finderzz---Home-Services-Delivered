import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditSubService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subService, setSubService] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workerPrice, setWorkerPrice] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [durationEstimate, setDurationEstimate] = useState("");

  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchSubService = async () => {
    try {
      const res = await API.get(`/subService/${id}`);
      const data = res.data.data;

      setSubService(data);

      setName(data.name || "");
      setDescription(data.description || "");

      setWorkerPrice(data.workerPrice || "");
      setPlatformFee(data.platformFee || "");

      setDurationEstimate(data.durationEstimate || "");

      setActive(data.active);
    } catch (err) {
      console.error("Fetch subservice failed", err);
    }
  };

  useEffect(() => {
    fetchSubService();
  }, []);

  /* ================= UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch(`/subService/${id}`, {
        name,
        description,
        workerPrice: Number(workerPrice),
        platformFee: Number(platformFee),
        durationEstimate: Number(durationEstimate),
        active,
      });

      navigate("/services");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!subService) {
    return <div className="p-8">Loading subservice...</div>;
  }

  const customerPrice =
    Number(workerPrice || 0) + Number(platformFee || 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Edit SubService
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Update pricing, details and availability
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              SubService Details
            </h2>

            <div>
              <label className="block text-sm mb-1">
                SubService Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pipe Leakage Repair, AC Cleaning"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this subservice includes..."
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>

          {/* PRICING */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Pricing
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm mb-1">
                  Worker Price (₹)
                </label>
                <input
                  type="number"
                  value={workerPrice}
                  onChange={(e) => setWorkerPrice(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Platform Fee (₹)
                </label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full border rounded-lg p-2"
                />
              </div>

            </div>

            {/* PRICE PREVIEW */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Customer Price (Auto Calculated)
              </p>
              <p className="text-xl font-bold text-blue-600">
                ₹{customerPrice}
              </p>
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm mb-1">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={durationEstimate}
              onChange={(e) => setDurationEstimate(e.target.value)}
              placeholder="e.g. 30"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">
              Status
            </h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active (visible to users)
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Updating SubService..." : "Update SubService"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}