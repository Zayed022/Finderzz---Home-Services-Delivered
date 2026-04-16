import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api.js";

export default function EditSubService() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [services, setServices] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workerPrice, setWorkerPrice] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [durationEstimate, setDurationEstimate] = useState("");

  const [withMaterial, setWithMaterial] = useState(false);

  // ✅ PROCESS STATE
  const [enableProcess, setEnableProcess] = useState(false);
  const [processSteps, setProcessSteps] = useState([]);
  const [includedPoints, setIncludedPoints] = useState([]);
const [excludedPoints, setExcludedPoints] = useState([]);
const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // Load services
  useEffect(() => {
    API.get("/service").then((res) => setServices(res.data.data));
  }, []);

  // ✅ LOAD EXISTING SUBSERVICE
  useEffect(() => {
    if (!id) return;

    API.get(`/subService/${id}`).then((res) => {
      const data = res.data.data;

      setServiceId(data.serviceId);
      setName(data.name);
      setDescription(data.description);
      setWorkerPrice(data.workerPrice);
      setPlatformFee(data.platformFee);
      setDurationEstimate(data.durationEstimate);
      setWithMaterial(Boolean(data.withMaterial));
      setIncludedPoints(data.includedPoints || []);
setExcludedPoints(data.excludedPoints || []);

      // ✅ LOAD PROCESS
      if (data.processId?.steps?.length > 0) {
        setEnableProcess(true);
        setProcessSteps(data.processId.steps);
      }
    });
  }, [id]);

  // =========================
  // PROCESS HANDLERS
  // =========================
  const addStep = () => {
    setProcessSteps((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, title: "", description: "" },
    ]);
  };

  const removeStep = (index) => {
    const updated = processSteps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));

    setProcessSteps(updated);
  };

  const updateStep = (index, field, value) => {
    const updated = [...processSteps];
    updated[index][field] = value;
    setProcessSteps(updated);
  };

  // =========================
  // SUBMIT (UPDATE)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      const formData = new FormData();
  
      formData.append("serviceId", serviceId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("workerPrice", workerPrice);
      formData.append("platformFee", platformFee);
      formData.append("durationEstimate", durationEstimate);
      formData.append("withMaterial", withMaterial);
  
      formData.append("includedPoints", JSON.stringify(includedPoints));
      formData.append("excludedPoints", JSON.stringify(excludedPoints));
      formData.append(
        "processSteps",
        JSON.stringify(enableProcess ? processSteps : [])
      );
  
      if (image) {
        formData.append("image", image);
      }
  
      await API.put(`/subService/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Failed to update subservice");
    } finally {
      setLoading(false);
    }
  };

  const customerPrice =
    Number(workerPrice || 0) + Number(platformFee || 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Edit SubService
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Update subservice details
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SERVICE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border rounded-lg p-2"
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

          {/* BASIC */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">SubService Details</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Name"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2"
              rows="3"
            />
          </div>

          {/* PRICING */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={workerPrice}
              onChange={(e) => setWorkerPrice(e.target.value)}
              className="border rounded-lg p-2"
              placeholder="Worker Price"
            />

            <input
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              className="border rounded-lg p-2"
              placeholder="Platform Fee"
            />
          </div>

          <div>
  <h2 className="font-semibold text-gray-700 mb-2">Image</h2>

  {preview && (
    <img
      src={preview}
      alt="preview"
      className="w-40 h-40 object-cover rounded mb-2"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }}
  />
</div>

          <button
  type="button"
  onClick={() => setWithMaterial((prev) => prev === true ? false : true)}
  className={`px-4 py-2 rounded-lg border ${
    withMaterial
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-gray-100 border-gray-300 text-gray-600"
  }`}
>
  {withMaterial ? "Material Included" : "Without Material"}
</button>

          {/* DURATION */}
          <input
            type="number"
            value={durationEstimate}
            onChange={(e) => setDurationEstimate(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          {/* ========================= */}
          {/* PROCESS (NO UI CHANGE STYLE) */}
          {/* ========================= */}
          <div>
            <h2 className="font-semibold text-gray-700">Our Process</h2>

            <button
              type="button"
              onClick={() => setEnableProcess((p) => !p)}
              className="text-sm text-blue-600"
            >
              {enableProcess ? "Disable" : "Enable"} Process
            </button>

            {enableProcess && (
              <div className="space-y-4 mt-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="border p-3 rounded-lg">

                    <input
                      value={step.title}
                      onChange={(e) =>
                        updateStep(index, "title", e.target.value)
                      }
                      placeholder="Step Title"
                      className="w-full border p-2 mb-2"
                    />

                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        updateStep(index, "description", e.target.value)
                      }
                      placeholder="Step Description"
                      className="w-full border p-2"
                    />

                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-500 text-xs mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addStep}
                  className="text-blue-600 text-sm"
                >
                  + Add Step
                </button>
              </div>
            )}
          </div>

      {/* INCLUDED */}
<div>
  <h2 className="font-semibold text-gray-700">Included Points</h2>

  {includedPoints.map((point, i) => (
    <div key={i} className="flex gap-2 mb-2">
      <input
        value={point}
        onChange={(e) => {
          const updated = [...includedPoints];
          updated[i] = e.target.value;
          setIncludedPoints(updated);
        }}
        className="flex-1 border p-2 rounded"
      />

      <button
        type="button"
        onClick={() =>
          setIncludedPoints(
            includedPoints.filter((_, idx) => idx !== i)
          )
        }
      >
        ❌
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() => setIncludedPoints([...includedPoints, ""])}
    className="text-blue-600 text-sm"
  >
    + Add Point
  </button>
</div>

{/* EXCLUDED */}
<div>
  <h2 className="font-semibold text-gray-700">Excluded Points</h2>

  {excludedPoints.map((point, i) => (
    <div key={i} className="flex gap-2 mb-2">
      <input
        value={point}
        onChange={(e) => {
          const updated = [...excludedPoints];
          updated[i] = e.target.value;
          setExcludedPoints(updated);
        }}
        className="flex-1 border p-2 rounded"
      />

      <button
        type="button"
        onClick={() =>
          setExcludedPoints(
            excludedPoints.filter((_, idx) => idx !== i)
          )
        }
      >
        ❌
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() => setExcludedPoints([...excludedPoints, ""])}
    className="text-blue-600 text-sm"
  >
    + Add Point
  </button>
</div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Update SubService"}
          </button>
        </form>
      </div>
    </div>
  );
}