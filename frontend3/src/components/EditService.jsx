
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [service, setService] = useState(null);

  // BASIC
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  // INSPECTION
  const [inspectionAvailable, setInspectionAvailable] = useState(false);
  const [inspectionWorkerPrice, setInspectionWorkerPrice] = useState(0);
  const [inspectionPlatformFee, setInspectionPlatformFee] = useState(0);
  const [inspectionDescription, setInspectionDescription] = useState("");
  const [inspectionDuration, setInspectionDuration] = useState(0);

  const [includedPoints, setIncludedPoints] = useState([]);
  const [excludedPoints, setExcludedPoints] = useState([]);

  // MEDIA
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchService = async () => {
    const res = await API.get(`/service/${id}`);
    const data = res.data.data;

    setService(data);

    // BASIC
    setName(data.name || "");
    setDescription(data.description || "");
    setCategoryId(data.categoryId || "");
    setIsPopular(data.isPopular || false);

    // MEDIA
    setBannerPreview(data.bannerImage);
    setIconPreview(data.icon);

    // INSPECTION
    setInspectionAvailable(data.inspectionAvailable || false);
    setInspectionWorkerPrice(data.inspectionWorkerPrice || 0);
    setInspectionPlatformFee(data.inspectionPlatformFee || 0);
    setInspectionDescription(data.inspectionDescription || "");
    setInspectionDuration(data.inspectionDuration || 0);

    setIncludedPoints(data.includedPoints || []);
    setExcludedPoints(data.excludedPoints || []);
  };

  const fetchCategories = async () => {
    const res = await API.get("/category");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchService();
    fetchCategories();
  }, []);

  /* ================= UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch(`/service/${id}`, {
        name,
        description,
        categoryId,
        isPopular,

        inspectionAvailable,
        inspectionWorkerPrice,
        inspectionPlatformFee,
        inspectionDescription,
        inspectionDuration,

        includedPoints: includedPoints.filter((p) => p.trim()),
        excludedPoints: excludedPoints.filter((p) => p.trim()),
      });

      navigate("/services");
    } catch (err) {
      console.error("Update service failed", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div className="p-8">Loading service...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Edit Service
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Update service details and inspection configuration
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Service Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          {/* SETTINGS */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Settings
            </h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
              />
              Mark as Popular Service
            </label>
          </div>

          {/* INSPECTION */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Inspection Details
            </h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inspectionAvailable}
                onChange={(e) =>
                  setInspectionAvailable(e.target.checked)
                }
              />
              Enable Inspection
            </label>

            {inspectionAvailable && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Worker Price"
                    value={inspectionWorkerPrice}
                    onChange={(e) =>
                      setInspectionWorkerPrice(Number(e.target.value))
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Platform Fee"
                    value={inspectionPlatformFee}
                    onChange={(e) =>
                      setInspectionPlatformFee(Number(e.target.value))
                    }
                    className="border p-2 rounded"
                  />
                </div>

                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={inspectionDuration}
                  onChange={(e) =>
                    setInspectionDuration(Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />

                <textarea
                  placeholder="Inspection Description"
                  value={inspectionDescription}
                  onChange={(e) =>
                    setInspectionDescription(e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />

                {/* INCLUDED */}
                <div>
                  <p className="text-sm font-medium">Included Points</p>
                  {includedPoints.map((point, i) => (
                    <input
                      key={i}
                      value={point}
                      onChange={(e) => {
                        const updated = [...includedPoints];
                        updated[i] = e.target.value;
                        setIncludedPoints(updated);
                      }}
                      className="w-full border p-2 rounded mb-2"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setIncludedPoints([...includedPoints, ""])
                    }
                    className="text-blue-600 text-sm"
                  >
                    + Add Point
                  </button>
                </div>

                {/* EXCLUDED */}
                <div>
                  <p className="text-sm font-medium">Excluded Points</p>
                  {excludedPoints.map((point, i) => (
                    <input
                      key={i}
                      value={point}
                      onChange={(e) => {
                        const updated = [...excludedPoints];
                        updated[i] = e.target.value;
                        setExcludedPoints(updated);
                      }}
                      className="w-full border p-2 rounded mb-2"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setExcludedPoints([...excludedPoints, ""])
                    }
                    className="text-blue-600 text-sm"
                  >
                    + Add Point
                  </button>
                </div>
              </>
            )}
          </div>

          {/* MEDIA */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Media Preview
            </h2>

            {bannerPreview && (
              <img
                src={bannerPreview}
                className="w-full h-40 object-cover rounded border"
              />
            )}

            {iconPreview && (
              <img
                src={iconPreview}
                className="h-16 w-16 object-contain rounded border"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Updating..." : "Update Service"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="flex-1 border py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
