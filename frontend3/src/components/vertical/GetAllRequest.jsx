import { useEffect,useState } from "react";
import API from "../../api/api";

export default function GetAllRequest(){

const [requests,setRequests] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

fetchRequests();

},[]);

const fetchRequests = async ()=>{

try{

const res = await API.get("/vertical/get");

setRequests(res.data.data);

}catch(error){

console.error(error);

}finally{

setLoading(false);

}

};

return(

<div className="p-6 bg-gray-50 min-h-screen">

<h1 className="text-2xl font-semibold mb-6">
All Requests
</h1>

<div className="bg-white rounded-xl shadow border overflow-x-auto">

<table className="w-full text-sm min-w-[900px]">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">Request</th>
<th className="p-4 text-left">Budget</th>
<th className="p-4 text-left">Vertical</th>
<th className="p-4 text-left">Phone</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Created</th>

</tr>

</thead>

<tbody>

{requests.map((r)=>(
<tr key={r._id} className="border-t">

<td className="p-4 font-mono text-xs">
{r.responses.description}
</td>

<td className="p-4 font-mono text-xs">
{r.responses.budget}
</td>

<td className="p-4">
{r.verticalId?.name || "N/A"}
</td>

<td className="p-4">
{r.phone || "Guest"}
</td>

<td className="p-4">

<span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
{r.status}
</span>

</td>

<td className="p-4 text-gray-500">

{new Date(r.createdAt).toLocaleDateString()}

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

);

}