import { useEffect, useState } from "react";
import API from "../../api/api";


export default function ManageBookings(){

const [bookings,setBookings] = useState([]);
const [status,setStatus] = useState("pending");
const [page,setPage] = useState(1);
const [pages,setPages] = useState(1);
const [loading,setLoading] = useState(false);

const fetchBookings = async()=>{

  try{

    setLoading(true);

    const res = await API.get(
      `/admin/bookings?status=${status}&page=${page}`
    );

    setBookings(res.data.data);
    setPages(res.data.pagination.pages);

  }finally{
    setLoading(false);
  }

};

useEffect(()=>{
 fetchBookings();
},[status,page]);

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">
Bookings Management
</h1>

{/* STATUS FILTER */}

<div className="flex gap-3 mb-6">

{[
"pending",
"confirmed",
"assigned",
"in_progress",
"completed",
"cancelled"
].map((s)=>(
  
<button
key={s}
onClick={()=>{setStatus(s);setPage(1)}}
className={`px-4 py-2 rounded ${
 status===s
 ? "bg-blue-600 text-white"
 : "border"
}`}
>

{s}

</button>

))}

</div>

{/* TABLE */}

<div className="bg-white shadow rounded-xl overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">
Customer
</th>

<th className="p-3 text-left">
Services
</th>

<th className="p-3 text-left">
Area
</th>

<th className="p-3 text-left">
Schedule
</th>

<th className="p-3 text-left">
Total
</th>

<th className="p-3 text-left">
Status
</th>

</tr>

</thead>

<tbody>

{loading && (
<tr>
<td colSpan="6" className="p-6 text-center">
Loading bookings...
</td>
</tr>
)}

{bookings.map((booking)=>(
  
<tr key={booking._id} className="border-t">

<td className="p-3">

<div className="font-medium">
{booking.customerDetails?.name}
</div>

<div className="text-sm text-gray-500">
{booking.customerDetails?.phone}
</div>

</td>

<td className="p-3">

{booking.services.map((s,i)=>(
  
<div key={i} className="text-sm">

{s.subServiceId?.name}

</div>

))}

</td>

<td className="p-3">
{booking.areaId?.name}
</td>

<td className="p-3 text-sm">

<div>
{new Date(booking.scheduledDate).toLocaleDateString()}
</div>

<div className="text-gray-500">
{booking.timeSlot}
</div>

</td>

<td className="p-3 font-semibold">
₹{booking.totalPrice}
</td>

<td className="p-3">

<span className="px-2 py-1 text-sm rounded bg-gray-200">

{booking.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* PAGINATION */}

<div className="flex justify-center mt-6 gap-2">

{[...Array(pages)].map((_,i)=>(
  
<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 rounded ${
 page===i+1
 ? "bg-blue-600 text-white"
 : "border"
}`}
>

{i+1}

</button>

))}

</div>

</div>

);

}