import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchCategory = async () => {
    try {
      const res = await API.get(`/category/${id}`);
      const cat = res.data.data;

      setName(cat.name || "");
      setDescription(cat.description || "");
      setIcon(cat.icon || "");
      setOrder(cat.order || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  /* ================= UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch(`/category/${id}`, {
        name,
        description,
        icon,
        order,
      });

      navigate("/services");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Edit Category
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Update category details and organization
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cleaning, Repair, Electrical"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description about this category..."
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">
              Visual Identity
            </h2>

            <div>
              <label className="block text-sm mb-1">
                Icon URL
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Paste icon image URL (Cloudinary / CDN)"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ORDER */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">
              Display Settings
            </h2>

            <div>
              <label className="block text-sm mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Lower number = higher priority"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Example: 1 will appear before 2
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Updating Category..." : "Update Category"}
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