import { useState } from "react";

import toast from "react-hot-toast";
import API from "../../api/api";

export default function UpdateArea({ area, refresh, close }) {

  const [name, setName] = useState(area.name);
  const [extraCharge, setExtraCharge] = useState(area.extraCharge);
  const [loading, setLoading] = useState(false);

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch(`/area/${area._id}`, {
        name,
        extraCharge,
      });

      toast.success("Area updated");
      refresh();
      close();

    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Update Area</h2>

      <form onSubmit={updateHandler} className="space-y-4">

        <input
          className="w-full border p-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 rounded-lg"
          value={extraCharge}
          onChange={(e) => setExtraCharge(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded-lg">
          {loading ? "Updating..." : "Update Area"}
        </button>

      </form>
    </div>
  );
}