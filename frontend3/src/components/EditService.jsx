import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [service, setService] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchService = async () => {
    const res = await API.get(`/service/${id}`);
    const data = res.data.data;

    setService(data);
    setName(data.name || "");
    setDescription(data.description || "");
    setCategoryId(data.categoryId);
    setIsPopular(data.isPopular || false);

    setBannerPreview(data.bannerImage);
    setIconPreview(data.icon);
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
          Update service details and visibility
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
                placeholder="e.g. Plumbing, Electrician"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this service includes..."
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
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

          {/* MEDIA PREVIEW */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Media Preview
            </h2>

            {bannerPreview && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Banner Image
                </p>
                <img
                  src={bannerPreview}
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}

            {iconPreview && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Icon Image
                </p>
                <img
                  src={iconPreview}
                  className="h-16 w-16 object-contain rounded border"
                />
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Updating Service..." : "Update Service"}
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