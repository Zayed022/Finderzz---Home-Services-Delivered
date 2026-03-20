import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import API from "../api/api";

export default function ManageBookings(){

  const [bookings,setBookings] = useState([]);
  const [workers,setWorkers] = useState([]);

  const [status,setStatus] = useState("pending");

  const [page,setPage] = useState(1);
  const [pages,setPages] = useState(1);

  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);

  const statusColors = {
    pending:"bg-yellow-100 text-yellow-700",
    confirmed:"bg-blue-100 text-blue-700",
    assigned:"bg-purple-100 text-purple-700",
    in_progress:"bg-indigo-100 text-indigo-700",
    completed:"bg-green-100 text-green-700",
    cancelled:"bg-red-100 text-red-700"
  };

  /* ================= FETCH BOOKINGS ================= */

  const fetchBookings = async()=>{

    try{

      setLoading(true);

      const res = await API.get(
        `/booking?status=${status}&page=${page}&limit=10&search=${search}`
      );

      setBookings(res.data.data);
      setPages(res.data.pagination.pages);

    }catch(err){
      console.error("Fetch bookings failed",err);
    }finally{
      setLoading(false);
    }

  };

  /* ================= FETCH WORKERS ================= */

  const fetchWorkers = async()=>{

    try{

      const res = await API.get("/worker/approved");

      setWorkers(res.data.data);

    }catch(err){
      console.error("Workers fetch failed",err);
    }

  };

  useEffect(()=>{
    fetchBookings();
  },[status,page]);

  useEffect(()=>{
    fetchWorkers();
  },[]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async(id,newStatus)=>{

    try{

      await API.patch(`/booking/${id}/status`,{
        status:newStatus
      });

      fetchBookings();

    }catch(err){
      console.error("Status update failed",err);
    }

  };

  /* ================= ASSIGN WORKER ================= */

  const assignWorker = async(bookingId,workerId)=>{

    try{

      await API.patch(`/booking/${bookingId}/assign-worker`,{
        workerId
      });

      fetchBookings();

    }catch(err){
      console.error("Assign worker failed",err);
    }

  };

  /* ================= DATE FORMAT ================= */

  const formatDate = (date)=>{
    return new Date(date).toLocaleString("en-IN",{
      dateStyle:"medium",
      timeStyle:"short"
    });
  };

  /* ================= UI ================= */

  return(

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Booking Management
          </h1>

          <p className="text-gray-500 text-sm">
            Manage customer bookings and worker assignments
          </p>

        </div>

        {/* SEARCH */}

        <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg shadow-sm">

          <Search size={16}/>

          <input
            placeholder="Search phone..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="outline-none text-sm"
          />

          <button
            onClick={fetchBookings}
            className="text-blue-600 text-sm"
          >
            Search
          </button>

        </div>

      </div>


      {/* STATUS FILTER */}

      <div className="flex flex-wrap gap-2 mb-6">

        {[
          "all",
          "pending",
          "confirmed",
          "assigned",
          "in_progress",
          "completed",
          "cancelled"
        ].map(s=>(

          <button
            key={s}
            onClick={()=>{

              setStatus(s);
              setPage(1);

            }}
            className={`px-4 py-1 rounded-lg text-sm transition ${
              status===s
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >

            {s.replace("_"," ")}

          </button>

        ))}

      </div>


      {/* LOADING */}

      {loading && (

        <div className="text-center py-16 text-gray-500">
          Loading bookings...
        </div>

      )}


      {!loading && bookings.length===0 && (

        <div className="text-center py-16 text-gray-500">
          No bookings found
        </div>

      )}


      {/* BOOKINGS */}

      <div className="grid gap-6">

        {bookings.map(booking=>(

          <div
            key={booking._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >

            {/* HEADER */}

            <div className="flex justify-between items-start mb-4">

              <div>

                <p className="font-semibold text-lg">
                  Booking #{booking._id.slice(-6)}
                </p>

                <p className="text-xs text-gray-500">
                  {formatDate(booking.createdAt)}
                </p>

              </div>

              <span
                className={`px-3 py-1 text-xs rounded ${statusColors[booking.status]}`}
              >
                {booking.status.replace("_"," ")}
              </span>

            </div>


            {/* CUSTOMER */}

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">

              <div>

                <p>
                  <b>Customer:</b> {booking.customerDetails?.name}
                </p>

                <p>
                  <b>Phone:</b> {booking.customerDetails?.phone}
                </p>

              </div>

              <div>

                <p>
                  <b>Area:</b> {booking.areaId?.name}
                </p>

                <p>
                  <b>Date:</b> {formatDate(booking.scheduledDate)}
                </p>

                <p>
                  <b>Slot:</b> {booking.timeSlot}
                </p>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="text-sm mb-4">

              <b>Address:</b>

              <div className="text-gray-600 mt-1 space-y-1">

                <p>
                  {booking.address?.houseNumber}, {booking.address?.buildingName}
                </p>

                <p>
                  Floor: {booking.address?.floorNumber}
                </p>

                {booking.address?.landmark && (
                  <p>
                    Landmark: {booking.address?.landmark}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  {booking.address?.fullAddress}
                </p>

              </div>

            </div>


            {/* SERVICES */}

            <div className="mb-4">

              <p className="text-sm font-semibold mb-2">
                Services
              </p>

              <div className="space-y-1">

                {booking.services.map((s,i)=>(

                  <div
                    key={i}
                    className="text-sm text-gray-600 flex justify-between"
                  >

<span>
  {s.bookingType === "inspection"
    ? `${s.serviceId?.name || "Service"} (Inspection)`
    : s.subServiceId?.name || "Service"}
</span>

                    <span>
                      x{s.quantity}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* PRICE */}

            <div className="grid grid-cols-3 gap-4 text-sm mb-4">

              <div className="bg-gray-50 p-3 rounded">

                Subtotal

                <p className="font-medium">
                  ₹{booking.subtotal}
                </p>

              </div>

              <div className="bg-gray-50 p-3 rounded">

                Area Fee

                <p className="font-medium">
                  ₹{booking.extraCharge}
                </p>

              </div>

              <div className="bg-blue-50 p-3 rounded">

                Total

                <p className="font-semibold text-blue-600">
                  ₹{booking.totalPrice}
                </p>

              </div>

            </div>


            {/* WORKER */}

            {booking.workerId && (

              <div className="bg-green-50 p-3 rounded mb-4 text-sm">

                <p className="font-semibold text-green-700 flex items-center gap-2">
                  <User size={14}/> Assigned Worker
                </p>

                <p>
                  Name: {booking.workerId?.name}
                </p>

                <p>
                  Phone: {booking.workerId?.phone}
                </p>

              </div>

            )}


            {/* ASSIGN WORKER */}

            {booking.status==="pending" && (

              <div className="mb-4">

                <p className="text-sm font-medium mb-1">
                  Assign Worker
                </p>

                <select
                  onChange={(e)=>assignWorker(
                    booking._id,
                    e.target.value
                  )}
                  className="border rounded px-3 py-2 text-sm w-full"
                >

                  <option value="">
                    Select Worker
                  </option>

                  {workers.map(worker=>(
                    <option
                      key={worker._id}
                      value={worker._id}
                    >
                      {worker.name} ({worker.phone})
                    </option>
                  ))}

                </select>

              </div>

            )}


            {/* STATUS ACTION */}

            <div className="flex flex-wrap gap-2">

              {[
                "confirmed",
                "assigned",
                "in_progress",
                "completed",
                "cancelled"
              ].map(s=>(

                <button
                  key={s}
                  onClick={()=>updateStatus(booking._id,s)}
                  className="text-xs border px-3 py-1 rounded hover:bg-gray-100"
                >

                  {s.replace("_"," ")}

                </button>

              ))}

            </div>

          </div>

        ))}

      </div>


      {/* PAGINATION */}

      <div className="flex justify-center gap-2 mt-8">

        {[...Array(pages)].map((_,i)=>(

          <button
            key={i}
            onClick={()=>setPage(i+1)}
            className={`px-3 py-1 rounded ${
              page===i+1
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {i+1}
          </button>

        ))}

      </div>

    </div>

  );

}
