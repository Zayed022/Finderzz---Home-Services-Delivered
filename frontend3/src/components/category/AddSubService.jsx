import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


export default function AddSubService(){

  const navigate = useNavigate();

  const [services,setServices] = useState([]);

  const [serviceId,setServiceId] = useState("");
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");

  const [workerPrice,setWorkerPrice] = useState(0);
  const [platformFee,setPlatformFee] = useState(0);
  const [durationEstimate,setDurationEstimate] = useState("");

  const [inspectionAvailable,setInspectionAvailable] = useState(false);
  const [inspectionPrice,setInspectionPrice] = useState(0);
  const [inspectionDescription,setInspectionDescription] = useState("");
  const [inspectionDuration,setInspectionDuration] = useState("");

  const [loading,setLoading] = useState(false);

  /* ================= FETCH SERVICES ================= */

  const fetchServices = async()=>{
    try{

      const res = await API.get("/service/");

      setServices(res.data.data);

    }catch(err){
      console.error("Failed to fetch services",err);
    }
  };

  useEffect(()=>{
    fetchServices();
  },[]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      const payload = {
        serviceId,
        name,
        description,
        workerPrice: Number(workerPrice),
        platformFee: Number(platformFee),
      
        durationEstimate: durationEstimate
          ? Number(durationEstimate)
          : 0,
      
        inspectionAvailable,
      
        inspectionPrice: inspectionAvailable
          ? Number(inspectionPrice)
          : 0,
      
        inspectionDescription: inspectionAvailable
          ? inspectionDescription
          : "",
      
        inspectionDuration: inspectionAvailable
          ? Number(inspectionDuration)
          : 0
      };

      await API.post("/subService/",payload);

      navigate("/services");

    }catch(err){
      console.error("Create subservice failed",err);
      alert("Failed to create subservice");
    }finally{
      setLoading(false);
    }
  };

  const customerPrice = Number(workerPrice) + Number(platformFee);

  /* ================= UI ================= */

  return(

    <div className="p-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Add SubService
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >

        {/* SERVICE DROPDOWN */}

        <div>
          <label className="block mb-1 font-medium">
            Service
          </label>

          <select
            value={serviceId}
            onChange={(e)=>setServiceId(e.target.value)}
            className="w-full border rounded p-2"
            required
          >

            <option value="">
              Select Service
            </option>

            {services.map(service=>(
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}

          </select>
        </div>

        {/* NAME */}

        <div>
          <label className="block mb-1 font-medium">
            SubService Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        {/* PRICING */}

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-1 font-medium">
              Worker Price
            </label>

            <input
              type="number"
              value={workerPrice}
              onChange={(e)=>setWorkerPrice(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Platform Fee
            </label>

            <input
              type="number"
              value={platformFee}
              onChange={(e)=>setPlatformFee(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

        </div>

        {/* CUSTOMER PRICE PREVIEW */}

        <div className="bg-gray-100 p-3 rounded">
          Customer Price: <b>₹{customerPrice}</b>
        </div>

        {/* DURATION */}

        <div>
          <label className="block mb-1 font-medium">
            Duration Estimate
          </label>

          <input
            type="number"
            value={durationEstimate}
            onChange={(e)=>setDurationEstimate(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Example: 30 minutes"
          />
        </div>

        {/* INSPECTION TOGGLE */}

        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={inspectionAvailable}
            onChange={(e)=>setInspectionAvailable(e.target.checked)}
          />

          <label>
            Inspection Available
          </label>

        </div>

        {/* INSPECTION FIELDS */}

        {inspectionAvailable && (

          <div className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">
                Inspection Price
              </label>

              <input
                type="number"
                value={inspectionPrice}
                onChange={(e)=>setInspectionPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Inspection Duration
              </label>

              <input
                type="number"
                value={inspectionDuration}
                onChange={(e)=>setInspectionDuration(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Inspection Description
              </label>

              <textarea
                value={inspectionDescription}
                onChange={(e)=>setInspectionDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows="3"
              />

            </div>

          </div>

        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Creating..." : "Create SubService"}
        </button>

      </form>

    </div>
  );
}