import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function AddService() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  const [bannerImage, setBannerImage] = useState(null);
  const [icon, setIcon] = useState(null);

  // Inspection
  const [inspectionAvailable, setInspectionAvailable] = useState(false);
  const [inspectionWorkerPrice, setInspectionWorkerPrice] = useState("");
  const [inspectionPlatformFee, setInspectionPlatformFee] = useState("");
  const [inspectionDescription, setInspectionDescription] = useState("");
  const [inspectionDuration, setInspectionDuration] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/category").then((res) => setCategories(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isPopular", isPopular);

      formData.append("bannerImage", bannerImage);
      formData.append("icon", icon);

      formData.append("inspectionAvailable", inspectionAvailable);
      formData.append("inspectionWorkerPrice", inspectionWorkerPrice);
      formData.append("inspectionPlatformFee", inspectionPlatformFee);
      formData.append("inspectionDescription", inspectionDescription);
      formData.append("inspectionDuration", inspectionDuration);

      await API.post("/service", formData);

      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Add New Service
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Create a new service that users can book on Finderzz
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Basic Information</h2>

            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Service Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Plumbing, Electrician, Painting"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this service offers..."
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
              />
              Mark as Popular Service
            </label>
          </div>

          {/* MEDIA */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Media Upload</h2>

            <div>
              <label className="block text-sm mb-1">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerImage(e.target.files[0])}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Icon Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIcon(e.target.files[0])}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          </div>

          {/* INSPECTION */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Inspection Settings</h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inspectionAvailable}
                onChange={(e) => setInspectionAvailable(e.target.checked)}
              />
              Enable Inspection Service
            </label>

            {inspectionAvailable && (
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm mb-1">Worker Price (₹)</label>
                  <input
                    type="number"
                    value={inspectionWorkerPrice}
                    onChange={(e) => setInspectionWorkerPrice(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Platform Fee (₹)</label>
                  <input
                    type="number"
                    value={inspectionPlatformFee}
                    onChange={(e) => setInspectionPlatformFee(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={inspectionDuration}
                    onChange={(e) => setInspectionDuration(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">Inspection Description</label>
                  <textarea
                    value={inspectionDescription}
                    onChange={(e) => setInspectionDescription(e.target.value)}
                    placeholder="Explain what inspection includes..."
                    className="w-full border rounded-lg p-2"
                  />
                </div>

              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Service..." : "Create Service"}
          </button>

        </form>
      </div>
    </div>
  );
}