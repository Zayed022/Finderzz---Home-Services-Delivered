import { useState } from "react";

import toast from "react-hot-toast";
import API from "../../api/api";

export default function AddArea({ refresh, close }) {
  const [name, setName] = useState("");
  const [extraCharge, setExtraCharge] = useState(0);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/area/", {
        name,
        extraCharge,
      });

      toast.success("Area created");
      refresh();
      close();

    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Add Area</h2>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          type="text"
          placeholder="Area Name"
          className="w-full border rounded-lg p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Extra Charge"
          className="w-full border rounded-lg p-2"
          value={extraCharge}
          onChange={(e) => setExtraCharge(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Area"}
        </button>
      </form>
    </div>
  );
}