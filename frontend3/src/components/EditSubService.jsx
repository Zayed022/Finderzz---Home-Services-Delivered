import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditSubService(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [subService,setSubService] = useState(null);

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");

  const [workerPrice,setWorkerPrice] = useState(0);
  const [platformFee,setPlatformFee] = useState(0);

  const [durationEstimate,setDurationEstimate] = useState("");

  const [inspectionAvailable,setInspectionAvailable] = useState(false);
  const [inspectionPrice,setInspectionPrice] = useState(0);
  const [inspectionDescription,setInspectionDescription] = useState("");
  const [inspectionDuration,setInspectionDuration] = useState("");

  const [active,setActive] = useState(true);

  const [loading,setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchSubService = async()=>{

    try{

      const res = await API.get(`/subService/${id}`);
      const data = res.data.data;

      setSubService(data);

      setName(data.name);
      setDescription(data.description || "");

      setWorkerPrice(data.workerPrice);
      setPlatformFee(data.platformFee);

      setDurationEstimate(data.durationEstimate || "");

      setInspectionAvailable(data.inspectionAvailable);
      setInspectionPrice(data.inspectionPrice || 0);
      setInspectionDescription(data.inspectionDescription || "");
      setInspectionDuration(data.inspectionDuration || "");

      setActive(data.active);

    }catch(err){
      console.error("Fetch subservice failed",err);
    }

  };

  useEffect(()=>{
    fetchSubService();
  },[]);


  /* ================= UPDATE ================= */

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      setLoading(true);

      await API.patch(`/subService/${id}`,{

        name,
        description,

        workerPrice:Number(workerPrice),
        platformFee:Number(platformFee),

        durationEstimate,

        inspectionAvailable,
        inspectionPrice:Number(inspectionPrice),
        inspectionDescription,
        inspectionDuration,

        active

      });

      navigate("/services");

    }catch(err){

      console.error("Update failed",err);
      alert("Update failed");

    }finally{

      setLoading(false);

    }

  };


  if(!subService) return <div className="p-8">Loading...</div>;

  const customerPrice =
    Number(workerPrice) + Number(platformFee);


  return(

    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Edit SubService
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}

          <div>

            <label className="text-sm block mb-1">
              Name
            </label>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border rounded p-2"
            />

          </div>


          {/* DESCRIPTION */}

          <div>

            <label className="text-sm block mb-1">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full border rounded p-2"
            />

          </div>


          {/* PRICES */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm block mb-1">
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

              <label className="text-sm block mb-1">
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


          {/* CUSTOMER PRICE */}

          <div className="bg-gray-100 p-3 rounded text-sm">

            Customer Price :
            <span className="font-semibold ml-2 text-blue-600">
              ₹{customerPrice}
            </span>

          </div>


          {/* DURATION */}

          <div>

            <label className="text-sm block mb-1">
              Duration Estimate (minutes)
            </label>

            <input
              type="number"
              value={durationEstimate}
              onChange={(e)=>setDurationEstimate(e.target.value)}
              className="w-full border rounded p-2"
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

            <div className="bg-purple-50 p-4 rounded space-y-3">

              <div>

                <label className="text-sm block mb-1">
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

                <label className="text-sm block mb-1">
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

                <label className="text-sm block mb-1">
                  Inspection Description
                </label>

                <textarea
                  value={inspectionDescription}
                  onChange={(e)=>setInspectionDescription(e.target.value)}
                  className="w-full border rounded p-2"
                />

              </div>

            </div>

          )}


          {/* ACTIVE */}

          <div className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={active}
              onChange={(e)=>setActive(e.target.checked)}
            />

            <label>
              Active
            </label>

          </div>


          {/* BUTTON */}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >

            {loading ? "Updating..." : "Update SubService"}

          </button>

        </form>

      </div>

    </div>

  );

}