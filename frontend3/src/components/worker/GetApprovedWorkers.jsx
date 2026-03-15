import { useEffect, useState } from "react";
import API from "../../api/api";

export default function GetApprovedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
const [workerProfile, setWorkerProfile] = useState(null);
const [earnings, setEarnings] = useState(null);
const [history, setHistory] = useState([]);
const [profileLoading, setProfileLoading] = useState(false);
const [settlements, setSettlements] = useState([]);
const [settlementLoading, setSettlementLoading] = useState(false);
const [approvingSettlement, setApprovingSettlement] = useState(null);



  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, workers]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/worker/approved");

      setWorkers(res.data.data || []);
      setFilteredWorkers(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (!value) {
      setFilteredWorkers(workers);
      return;
    }

    const filtered = workers.filter(
      (worker) =>
        worker.name?.toLowerCase().includes(value.toLowerCase()) ||
        worker.phone?.includes(value)
    );

    setFilteredWorkers(filtered);
  };

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(",").map((s) => s.trim());
  };

  const fetchWorkerProfile = async (workerId) => {
    try {
      setProfileLoading(true);
  
      const res = await API.get(`/worker/profile/${workerId}`);
  
      setWorkerProfile(res.data.worker);
  
    } catch (error) {
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchWorkerEarnings = async (workerId) => {
    try {
  
      const res = await API.get(`/worker/earnings/${workerId}`);
  
      setEarnings(res.data.earnings);
  
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkerHistory = async (workerId) => {
    try {
  
      const res = await API.get(`/worker/history/${workerId}`);
  
      setHistory(res.data.jobs || []);
  
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkerSettlement = async (workerId) => {
    try {
  
      setSettlementLoading(true);
  
      const res = await API.get(`/worker/settlement/${workerId}`);
  
      setSettlements(res.data.data || []);
  
    } catch (error) {
      console.error(error);
    } finally {
      setSettlementLoading(false);
    }
  };

  const approveSettlement = async (settlementId) => {

    try {
  
      setApprovingSettlement(settlementId);
  
      await API.patch(`/worker/approve/${settlementId}`);
  
      setSettlements(prev =>
        prev.map(s =>
          s.settlementId === settlementId
            ? { ...s, status: "approved" }
            : s
        )
      );
  
    } catch (error) {
  
      console.error(error);
  
    } finally {
  
      setApprovingSettlement(null);
  
    }
  
  };
  
  

  const openWorkerDetails = async (worker) => {

    setSelectedWorker(worker);
  
    await fetchWorkerProfile(worker._id);
    await fetchWorkerEarnings(worker._id);
    await fetchWorkerHistory(worker._id);
    await fetchWorkerSettlement(worker._id);
  
  };
  

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Approved Workers
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage all active professionals in the platform
          </p>
        </div>

        <div className="flex items-center gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border bg-white rounded-lg px-4 py-2 text-sm w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Worker count */}
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
            {workers.length} Active
          </div>

        </div>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}

        </div>
      )}


      {/* EMPTY */}
      {!loading && filteredWorkers.length === 0 && (
        <div className="text-center py-24 text-gray-500 bg-white rounded-xl shadow-sm">
          No approved workers found
        </div>
      )}


      {/* TABLE */}
      {!loading && filteredWorkers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600">

              <tr>
                <th className="px-6 py-4 text-left font-medium">Worker</th>
                <th className="px-6 py-4 text-left font-medium">Phone</th>
                <th className="px-6 py-4 text-left font-medium">Worker ID</th>
                <th className="px-6 py-4 text-left font-medium">Skills</th>
                <th className="px-6 py-4 text-left font-medium">Address</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>

              </tr>

            </thead>


            {/* BODY */}
            <tbody>

              {filteredWorkers.map((worker) => {

                const skills = parseSkills(worker.skills);

                return (
                  <tr
                    key={worker._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* Worker */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={
                            worker.profileImage ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(worker.name || "Worker")
                          }
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border"
                        />

                        <div>

                          <p className="font-medium text-gray-800">
                            {worker.name || "Unknown Worker"}
                          </p>

                          <p className="text-xs text-gray-400">
                            Active Worker
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600">
                      {worker.phone || "-"}
                    </td>


                    {/* ID */}
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      {worker._id}
                    </td>


                    {/* Skills */}
                    <td className="px-6 py-4">

                      <div className="flex flex-wrap gap-2">

                        {skills.length > 0 ? (
                          skills.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No skills
                          </span>
                        )}

                      </div>

                    </td>


                    {/* Address */}
                    <td className="px-6 py-4 text-gray-600 max-w-[250px] truncate">
                      {worker.address || "-"}
                    </td>

                    <td className="px-6 py-4">
  <button
    onClick={() => openWorkerDetails(worker)}
    className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
  >
    View
  </button>
</td>


                  </tr>
                );
              })}

            </tbody>

          </table>
          {selectedWorker && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">

{/* HEADER */}

<div className="flex justify-between mb-6">

<h2 className="text-xl font-semibold">
Worker Details
</h2>

<button
onClick={()=>{
setSelectedWorker(null);
setWorkerProfile(null);
setEarnings(null);
setHistory([]);
}}
>
✕
</button>

</div>


{/* PROFILE */}

{workerProfile && (

<div className="flex items-center gap-4 mb-6">

<img
src={
workerProfile.profileImage ||
"https://ui-avatars.com/api/?name=" +
encodeURIComponent(workerProfile.name)
}
className="w-16 h-16 rounded-full object-cover"
/>

<div>

<p className="font-semibold text-lg">
{workerProfile.name}
</p>

<p className="text-sm text-gray-500">
{workerProfile.phone}
</p>

<p className="text-sm text-gray-500">
{workerProfile.address}
</p>

</div>

</div>

)}


{/* EARNINGS */}

{earnings && (

<div className="grid grid-cols-4 gap-4 mb-8">

<EarningCard title="Total" value={earnings.totalEarnings} />

<EarningCard title="Today" value={earnings.todayEarnings} />

<EarningCard title="Weekly" value={earnings.weeklyEarnings} />

<EarningCard title="Monthly" value={earnings.monthlyEarnings} />

</div>

)}


{/* JOB HISTORY */}

{/* BOOKING HISTORY */}

<div className="mt-8">

<h3 className="font-semibold text-gray-800 mb-4">
Worker Booking History
</h3>

{history.length === 0 ? (

<div className="text-center text-gray-500 py-10 border rounded-lg">
No completed bookings
</div>

) : (

<div className="space-y-4">

{history.map((job) => (

<div
key={job._id}
className="border rounded-xl p-4 bg-white shadow-sm"
>

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

<div>

<p className="font-medium text-gray-800">
Booking ID
</p>

<p className="text-xs text-gray-500 font-mono">
{job._id}
</p>

</div>

<div className="text-sm text-gray-600">

<p>
Scheduled:
</p>

<p className="font-medium text-gray-800">
{new Date(job.scheduledDate).toLocaleDateString()} • {job.timeSlot}
</p>

</div>

<span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
{job.status}
</span>

</div>



{/* CUSTOMER */}

<div className="grid md:grid-cols-2 gap-4 mb-4">

<div className="bg-gray-50 p-3 rounded-lg">

<p className="text-xs text-gray-500 mb-1">
Customer
</p>

<p className="font-medium text-gray-800">
{job.customerDetails?.name}
</p>

<p className="text-sm text-gray-600">
{job.customerDetails?.phone}
</p>

</div>


<div className="bg-gray-50 p-3 rounded-lg">

<p className="text-xs text-gray-500 mb-1">
Area
</p>

<p className="font-medium text-gray-800">
{job.areaId?.name}
</p>

<p className="text-xs text-gray-500">
Extra charge ₹{job.areaId?.extraCharge}
</p>

</div>

</div>



{/* ADDRESS */}

<div className="mb-4">

<p className="text-xs text-gray-500 mb-1">
Address
</p>

<p className="text-sm text-gray-700">
{job.address?.houseNumber}, {job.address?.buildingName}, Floor {job.address?.floorNumber}
</p>

<p className="text-xs text-gray-500">
{job.address?.landmark}
</p>

<p className="text-xs text-gray-500">
{job.address?.fullAddress}
</p>

</div>



{/* SERVICES */}

<div className="mb-4">

<p className="text-xs text-gray-500 mb-2">
Services Performed
</p>

<div className="border rounded-lg overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-gray-100 text-gray-600">

<tr>

<th className="px-3 py-2 text-left">Service</th>
<th className="px-3 py-2 text-left">Type</th>
<th className="px-3 py-2 text-left">Qty</th>
<th className="px-3 py-2 text-left">Price</th>

</tr>

</thead>

<tbody>

{job.services.map((service,i)=>{

const sub = service.subServiceId

return(

<tr key={i} className="border-t">

<td className="px-3 py-2">
{sub?.name}
</td>

<td className="px-3 py-2 text-xs">

<span className={`px-2 py-1 rounded text-xs ${
service.bookingType === "inspection"
? "bg-purple-100 text-purple-700"
: "bg-blue-100 text-blue-700"
}`}>
{service.bookingType}
</span>

</td>

<td className="px-3 py-2">
{service.quantity}
</td>

<td className="px-3 py-2">
₹{service.price}
</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>



{/* PRICING */}

<div className="grid grid-cols-3 gap-4">

<div className="bg-gray-50 p-3 rounded-lg">

<p className="text-xs text-gray-500">
Subtotal
</p>

<p className="font-medium">
₹{job.subtotal}
</p>

</div>


<div className="bg-gray-50 p-3 rounded-lg">

<p className="text-xs text-gray-500">
Area Charge
</p>

<p className="font-medium">
₹{job.extraCharge}
</p>

</div>


<div className="bg-gray-50 p-3 rounded-lg">

<p className="text-xs text-gray-500">
Total
</p>

<p className="font-semibold text-green-600">
₹{job.totalPrice}
</p>

</div>

</div>

</div>

))}

</div>

)}

</div>

{/* DAILY SETTLEMENT */}

<div className="mt-8">

<h3 className="font-medium mb-3">
Daily Settlement
</h3>

<div className="border rounded-lg overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="px-4 py-3 text-left">Date</th>
<th className="px-4 py-3 text-left">Jobs</th>
<th className="px-4 py-3 text-left">Collected</th>
<th className="px-4 py-3 text-left">Worker Earnings</th>
<th className="px-4 py-3 text-left">Admin Share</th>
<th className="px-4 py-3 text-left">Status</th>
<th className="px-4 py-3 text-left">Action</th>

</tr>

</thead>

<tbody>

{settlements.map(day => (

<tr key={day.date} className="border-t">

<td className="px-4 py-3">
{day.date}
</td>

<td className="px-4 py-3">
{day.jobs}
</td>

<td className="px-4 py-3">
₹{day.totalCollected}
</td>

<td className="px-4 py-3 text-green-600">
₹{day.workerEarnings}
</td>

<td className="px-4 py-3 text-blue-600">
₹{day.adminShare}
</td>

<td className="px-4 py-3">

<span
className={`text-xs px-2 py-1 rounded
${
day.status === "approved"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"
}`}
>

{day.status}

</span>

</td>

<td className="px-4 py-3">

{day.status !== "approved" && day.settlementId && (

<button
onClick={()=>approveSettlement(day.settlementId)}
className="text-xs px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
disabled={approvingSettlement === day.settlementId}
>

{approvingSettlement === day.settlementId
? "Approving..."
: "Approve"}

</button>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>


</div>

</div>

)}


        </div>
      )}
    </div>
  );
}

function EarningCard({ title, value }) {

    return(
    
    <div className="bg-gray-50 p-4 rounded-lg">
    
    <p className="text-xs text-gray-500">
    {title}
    </p>
    
    <p className="text-lg font-semibold">
    ₹{value || 0}
    </p>
    
    </div>
    
    )
    
    }
    
