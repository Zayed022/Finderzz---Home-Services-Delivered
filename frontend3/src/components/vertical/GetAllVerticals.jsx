import { useEffect, useState } from "react";
import API from "../../api/api";

export default function GetAllVerticals() {
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const [icon, setIcon] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    fetchVerticals();
  }, []);

  const fetchVerticals = async () => {
    try {
      const res = await API.get("/vertical/verticals");
      setVerticals(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vertical?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/vertical/${id}`);

      setVerticals((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete vertical");
    }
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEdit = (item) => {
    setEditing(item);

    setName(item.name || "");
    setDescription(item.description || "");
    setActive(item.active ?? true);

    setIcon(null);
    setBannerImage(null);
  };

  /* =========================
     UPDATE
  ========================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("active", active);

      if (icon) {
        formData.append("icon", icon);
      }

      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }

      await API.put(`/vertical/${editing._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditing(null);
      fetchVerticals();
    } catch (error) {
      console.error(error);
      alert("Failed to update vertical");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Verticals</h1>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm min-w-[950px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Icon</th>
              <th className="p-4 text-left">Banner</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Active</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {verticals.map((v) => (
              <tr key={v._id} className="border-t">
                <td className="p-4">
                  <img
                    src={v.icon}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>

                <td className="p-4">
                  <img
                    src={v.bannerImage}
                    alt=""
                    className="w-32 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">{v.name}</td>

                <td className="p-4 text-gray-500 max-w-xs">
                  {v.description}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      v.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {new Date(v.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(v._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {verticals.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No verticals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          EDIT MODAL
      ========================= */}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Vertical</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border rounded-lg p-3"
                required
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows="4"
                className="w-full border rounded-lg p-3"
              />

              <div>
                <label className="text-sm font-medium block mb-1">
                  Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIcon(e.target.files[0])}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerImage(e.target.files[0])}
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Active
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}