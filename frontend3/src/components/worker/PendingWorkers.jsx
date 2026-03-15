import { useEffect, useState } from "react";
import API from "../../api/api";

export default function PendingWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
const [rejectReason, setRejectReason] = useState("");


  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/worker/pending");
      setWorkers(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveWorker = async () => {
    try {
      setActionLoading(true);
  
      await API.patch(`/worker/approve/${selectedWorker._id}`);
  
      setWorkers((prev) =>
        prev.filter((w) => w._id !== selectedWorker._id)
      );
  
      setSelectedWorker(null);
  
    } catch (error) {
      console.error(error);
      alert("Failed to approve worker");
    } finally {
      setActionLoading(false);
    }
  };
    
  const rejectWorker = async () => {
    try {
  
      if (!rejectReason.trim()) {
        alert("Please provide rejection reason");
        return;
      }
  
      setActionLoading(true);
  
      await API.patch(`/worker/reject/${selectedWorker._id}`, {
        reason: rejectReason
      });
  
      setWorkers((prev) =>
        prev.filter((w) => w._id !== selectedWorker._id)
      );
  
      setSelectedWorker(null);
      setRejectReason("");
  
    } catch (error) {
      console.error(error);
      alert("Failed to reject worker");
    } finally {
      setActionLoading(false);
    }
  };
  

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(",").map((s) => s.trim());
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Pending Worker Registrations
        </h1>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
          {workers.length} Pending
        </span>
      </div>


      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      )}


      {/* EMPTY */}
      {!loading && workers.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          No pending worker registrations
        </div>
      )}


      {/* WORKERS GRID */}
      {!loading && workers.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">

          {workers.map((worker) => {

            const skills = parseSkills(worker.skills);

            return (
              <div
                key={worker._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5"
              >

                {/* PROFILE */}
                <div className="flex items-center gap-4 mb-4">

                  <img
                    src={worker.profileImage}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {worker.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {worker.phone}
                    </p>
                  </div>

                </div>


                {/* SKILLS */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Skills</p>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>


                {/* ADDRESS */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {worker.address}
                </p>

                



                {/* BUTTON */}
                <button
                  onClick={() => setSelectedWorker(worker)}
                  className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition"
                >
                  Review Details
                </button>

              </div>
            );
          })}
        </div>
      )}


      {/* MODAL */}
      {selectedWorker && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg w-[720px] max-h-[90vh] overflow-y-auto p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-lg font-semibold">
                Worker Verification
              </h2>

              <button
                onClick={() => setSelectedWorker(null)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>

            </div>


            {/* PROFILE */}
            <div className="flex items-center gap-4 mb-6">

              <img
                src={selectedWorker.profileImage}
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div>

                <p className="font-semibold text-gray-800">
                  {selectedWorker.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedWorker.phone}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Worker ID: {selectedWorker._id}
                </p>

              </div>

            </div>


            {/* DOCUMENTS */}
            <div className="grid grid-cols-2 gap-6 mb-6">

              <Document
                title="Aadhaar Card"
                image={selectedWorker.aadhaarImage}
                number={selectedWorker.aadhaarNumber}
              />

              <Document
                title="PAN Card"
                image={selectedWorker.panImage}
                number={selectedWorker.panNumber}
              />

            </div>

            <div className="mb-6">

              <h3 className="text-sm font-medium mb-1">
                Aadhaar Number
              </h3>

              <p className="text-sm text-gray-600">
                {selectedWorker.aadhaarNumber}
              </p>

            </div>
            
            {/* SKILLS */}
            <div className="mb-6">

              <h3 className="text-sm font-medium mb-2">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">

                {parseSkills(selectedWorker.skills).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>


            {/* ADDRESS */}
            <div className="mb-6">

              <h3 className="text-sm font-medium mb-1">
                Address
              </h3>

              <p className="text-sm text-gray-600">
                {selectedWorker.address}
              </p>

            </div>

            <div className="mb-6">

  <label className="text-sm font-medium block mb-1">
    Rejection Reason
  </label>

  <textarea
    value={rejectReason}
    onChange={(e) => setRejectReason(e.target.value)}
    placeholder="Enter reason if rejecting worker"
    className="w-full border rounded-md p-2 text-sm"
  />

</div>


            {/* ACTIONS */}
            <div className="flex justify-end gap-3">

  <button
    onClick={rejectWorker}
    disabled={actionLoading}
    className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
  >
    {actionLoading ? "Processing..." : "Reject"}
  </button>

  <button
    onClick={approveWorker}
    disabled={actionLoading}
    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
  >
    {actionLoading ? "Processing..." : "Approve Worker"}
  </button>

</div>


          </div>

        </div>
      )}

    </div>
  );
}


/* ---------- DOCUMENT CARD ---------- */

function Document({ title, image, number }) {

  return (
    <div className="border rounded-lg p-4">

      <p className="text-sm font-medium mb-2">
        {title}
      </p>

      <a href={image} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover rounded mb-2 cursor-pointer hover:opacity-90"
        />
      </a>

      <p className="text-xs text-gray-500 break-all">
        {number}
      </p>

    </div>
  );
}
