import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

export default function EditNotice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    heading: "",
    message: "",
    icon: "info",
    type: "info",
    active: true,
  });

  useEffect(() => {
    API.get(`/notice/${id}`).then((res) =>
      setForm(res.data.data)
    );
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/notice/${id}`, form);
      navigate("/notice");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-8 flex justify-center bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-xl space-y-4"
      >
        <h1 className="text-lg font-bold">Edit Notice</h1>

        <input
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          placeholder="Heading"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Message"
          className="w-full border p-2 rounded"
        />

        <select
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="w-full border p-2"
        >
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="time">time</option>
          <option value="alert">alert</option>
          <option value="shield">shield</option>
        </select>

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border p-2"
        >
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="delay">delay</option>
          <option value="critical">critical</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({ ...form, active: e.target.checked })
            }
          />
          Active
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Notice
        </button>
      </form>
    </div>
  );
}