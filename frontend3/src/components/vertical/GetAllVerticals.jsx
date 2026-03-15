import { useEffect,useState } from "react";
import API from "../../api/api";

export default function GetAllVerticals(){

const [verticals,setVerticals] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

fetchVerticals();

},[]);

const fetchVerticals = async ()=>{

try{

const res = await API.get("/vertical/verticals");

setVerticals(res.data.data);

}catch(error){

console.error(error);

}finally{

setLoading(false);

}

};

return(

<div className="p-6 bg-gray-50 min-h-screen">

<h1 className="text-2xl font-semibold mb-6">
All Verticals
</h1>

<div className="bg-white rounded-xl shadow border overflow-x-auto">

<table className="w-full text-sm min-w-[800px]">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">Icon</th>
<th className="p-4 text-left">Banner</th>
<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Description</th>
<th className="p-4 text-left">Active</th>
<th className="p-4 text-left">Created</th>

</tr>

</thead>

<tbody>

{verticals.map((v)=>(
<tr key={v._id} className="border-t">

<td className="p-4">
<img src={v.icon} className="w-10 h-10 rounded"/>
</td>

<td className="p-4">
<img src={v.bannerImage} className="w-32 h-16 object-cover rounded"/>
</td>

<td className="p-4 font-medium">
{v.name}
</td>

<td className="p-4 text-gray-500">
{v.description}
</td>

<td className="p-4">

<span className={`px-2 py-1 text-xs rounded ${
v.active
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-700"
}`}>
{v.active ? "Active" : "Inactive"}
</span>

</td>

<td className="p-4 text-gray-500">

{new Date(v.createdAt).toLocaleDateString()}

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

);

}