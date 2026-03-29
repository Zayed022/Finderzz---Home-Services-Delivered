import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function AddSubService() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workerPrice, setWorkerPrice] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [durationEstimate, setDurationEstimate] = useState("");
  const [withMaterial, setWithMaterial] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/service").then((res) => setServices(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/subService", {
        serviceId,
        name,
        description,
        workerPrice: Number(workerPrice),
        platformFee: Number(platformFee),
        durationEstimate: Number(durationEstimate),
        withMaterial,
      });

      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Failed to create subservice");
    } finally {
      setLoading(false);
    }
  };

  const customerPrice = Number(workerPrice || 0) + Number(platformFee || 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Add SubService
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Create a detailed service under a main service category
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SERVICE SELECTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose parent service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">SubService Details</h2>

            <div>
              <label className="block text-sm mb-1">SubService Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pipe Leakage Repair, Fan Installation"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
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
            <h2 className="font-semibold text-gray-700">Pricing</h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm mb-1">Worker Price (₹)</label>
                <input
                  type="number"
                  value={workerPrice}
                  onChange={(e) => setWorkerPrice(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Platform Fee (₹)</label>
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

          {/* MATERIAL TOGGLE */}
<div className="space-y-2">
  <h2 className="font-semibold text-gray-700">Material</h2>

  <div className="flex items-center justify-between border rounded-xl p-4 bg-gray-50">

    <div>
      <p className="text-sm font-medium text-gray-800">
        Include Material Cost
      </p>
      <p className="text-xs text-gray-500">
        Toggle if materials are included in the service price
      </p>
    </div>

    {/* Toggle Switch */}
    <button
      type="button"
      onClick={() => setWithMaterial((prev) => !prev)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        withMaterial ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          withMaterial ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  </div>

  {/* STATUS BADGE */}
  <div className="text-xs font-medium">
    {withMaterial ? (
      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full">
        Material Included
      </span>
    ) : (
      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full">
        Material Not Included
      </span>
    )}
  </div>
</div>

          {/* DURATION */}
          <div>
            <label className="block text-sm mb-1">Estimated Duration (minutes)</label>
            <input
              type="number"
              value={durationEstimate}
              onChange={(e) => setDurationEstimate(e.target.value)}
              placeholder="e.g. 30"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating SubService..." : "Create SubService"}
          </button>

        </form>
      </div>
    </div>
  );
}