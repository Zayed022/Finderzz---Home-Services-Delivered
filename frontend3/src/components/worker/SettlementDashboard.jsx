import { useEffect, useState, useMemo } from "react";
import API from "../../api/api";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts";

export default function SettlementDashboard(){

const [settlements,setSettlements] = useState([]);
const [loading,setLoading] = useState(true);
const [search,setSearch] = useState("");
const [timeFilter,setTimeFilter] = useState("all");

const [selected,setSelected] = useState([]);
const [approving,setApproving] = useState(null);

useEffect(()=>{
fetchSettlements();
},[]);



const fetchSettlements = async()=>{

try{

setLoading(true);

const res = await API.get("/worker/all/status");

setSettlements(res.data.data || []);

}catch(err){
console.error(err);
}finally{
setLoading(false);
}

};



/* ---------- TIME FILTER ---------- */

const filteredData = useMemo(()=>{

let data = [...settlements];

if(search){
data = data.filter(d =>
d.workerName?.toLowerCase().includes(search.toLowerCase())
);
}

const now = new Date();

if(timeFilter==="today"){
data = data.filter(d =>
new Date(d.date).toDateString() === now.toDateString()
);
}

if(timeFilter==="week"){
const weekAgo = new Date();
weekAgo.setDate(now.getDate()-7);

data = data.filter(d =>
new Date(d.date) >= weekAgo
);
}

if(timeFilter==="month"){
const monthStart = new Date(now.getFullYear(),now.getMonth(),1);
data = data.filter(d => new Date(d.date) >= monthStart);
}

if(timeFilter==="year"){
const yearStart = new Date(now.getFullYear(),0,1);
data = data.filter(d => new Date(d.date) >= yearStart);
}

return data;

},[settlements,search,timeFilter]);



/* ---------- STATS ---------- */

const stats = useMemo(()=>{

let totalRevenue = 0;
let workerEarnings = 0;
let adminShare = 0;
let pending = 0;
let approved = 0;

filteredData.forEach(s=>{

totalRevenue += s.totalCollected;
workerEarnings += s.workerEarnings;
adminShare += s.adminShare;

if(s.status==="approved") approved++;
else pending++;

});

return {
totalRevenue,
workerEarnings,
adminShare,
pending,
approved
};

},[filteredData]);



/* ---------- APPROVAL ---------- */

const approveSettlement = async(id)=>{

try{

setApproving(id);

await API.patch(`/settlement/approve/${id}`);

fetchSettlements();

}catch(error){
console.error(error);
}finally{
setApproving(null);
}

};



/* ---------- BULK APPROVAL ---------- */

const approveBulk = async()=>{

try{

for(const id of selected){
await API.patch(`/settlement/approve/${id}`);
}

setSelected([]);

fetchSettlements();

}catch(err){
console.error(err);
}

};



/* ---------- CSV EXPORT ---------- */

const exportCSV = ()=>{

const headers=[
"Date","Worker","Phone","Jobs","Total","Worker Earnings","Platform","Status"
];

const rows=filteredData.map(r=>[
r.date,
r.workerName,
r.workerPhone,
r.jobs,
r.totalCollected,
r.workerEarnings,
r.adminShare,
r.status
]);

const csv=[headers,...rows]
.map(r=>r.join(","))
.join("\n");

const blob=new Blob([csv],{type:"text/csv"});
const url=URL.createObjectURL(blob);

const a=document.createElement("a");
a.href=url;
a.download="settlements.csv";
a.click();

};



return(

<div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">


{/* HEADER */}

<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">

<div>

<h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
Settlement Dashboard
</h1>

<p className="text-gray-500 text-sm">
Worker payout analytics & platform revenue
</p>

</div>

<div className="flex flex-wrap gap-3">

<input
placeholder="Search worker..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="border rounded-lg px-3 py-2 text-sm"
/>

<button
onClick={exportCSV}
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
>
Export CSV
</button>

{selected.length>0 && (
<button
onClick={approveBulk}
className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
>
Approve Selected ({selected.length})
</button>
)}

</div>

</div>



{/* TIME FILTER */}

<div className="flex flex-wrap gap-2 mb-6">

<TimeFilter label="All" active={timeFilter==="all"} onClick={()=>setTimeFilter("all")}/>
<TimeFilter label="Today" active={timeFilter==="today"} onClick={()=>setTimeFilter("today")}/>
<TimeFilter label="Weekly" active={timeFilter==="week"} onClick={()=>setTimeFilter("week")}/>
<TimeFilter label="Monthly" active={timeFilter==="month"} onClick={()=>setTimeFilter("month")}/>
<TimeFilter label="Yearly" active={timeFilter==="year"} onClick={()=>setTimeFilter("year")}/>

</div>



{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

<StatCard title="Total Revenue" value={stats.totalRevenue} color="blue"/>
<StatCard title="Worker Earnings" value={stats.workerEarnings} color="green"/>
<StatCard title="Platform Share" value={stats.adminShare} color="purple"/>
<StatCard title="Pending" value={stats.pending} color="yellow"/>

</div>



{/* REVENUE CHART */}

<div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8">

<h3 className="font-medium mb-4 text-gray-700">
Revenue Trend
</h3>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={filteredData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>
<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="adminShare"
stroke="#6366F1"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>



{/* TABLE CARD */}

<div className="bg-white rounded-xl shadow border overflow-hidden">


<div className="px-6 py-4 border-b flex justify-between items-center">

<h3 className="font-semibold text-gray-800">
Worker Settlements
</h3>

<span className="text-sm text-gray-500">
{filteredData.length} records
</span>

</div>



{/* TABLE DESKTOP */}

<div className="hidden md:block overflow-x-auto">

<table className="min-w-full text-sm">

<thead className="bg-gray-50 text-gray-600">

<tr>

<th className="px-6 py-3"></th>
<th>Date</th>
<th>Worker</th>
<th>Jobs</th>
<th>Total</th>
<th>Worker</th>
<th>Platform</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{loading ? (

<tr>
<td colSpan="9" className="text-center py-10">
Loading settlements...
</td>
</tr>

) : filteredData.map(day=>{

const id=day.settlementId;

return(

<tr key={id || `${day.workerId}_${day.date}`} className="border-t hover:bg-gray-50">

<td className="px-6 py-4">

{id && (
<input
type="checkbox"
checked={selected.includes(id)}
onChange={()=>{
if(selected.includes(id)){
setSelected(prev=>prev.filter(x=>x!==id))
}else{
setSelected(prev=>[...prev,id])
}
}}
/>
)}

</td>

<td>{day.date}</td>

<td>

<div className="flex items-center gap-3">

<div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
{day.workerName?.charAt(0)}
</div>

<div>

<p className="font-medium text-gray-800">
{day.workerName}
</p>

<p className="text-xs text-gray-500">
{day.workerPhone}
</p>

</div>

</div>

</td>

<td>{day.jobs}</td>

<td className="font-medium">
₹{day.totalCollected}
</td>

<td className="text-green-600 font-medium">
₹{day.workerEarnings}
</td>

<td className="text-indigo-600 font-medium">
₹{day.adminShare}
</td>

<td>

<span className={`px-2 py-1 text-xs rounded ${
day.status==="approved"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"
}`}>
{day.status}
</span>

</td>

<td>

{day.status!=="approved" && id && (

<button
onClick={()=>approveSettlement(id)}
disabled={approving===id}
className="bg-black text-white px-3 py-1 rounded text-xs"
>
{approving===id ? "Approving..." : "Approve"}
</button>

)}

</td>

</tr>

);

})}

</tbody>

</table>

</div>



{/* MOBILE CARDS */}

<div className="md:hidden divide-y">

{filteredData.map(day=>{

const id=day.settlementId;

return(

<div key={id || `${day.workerId}_${day.date}`} className="p-4">

<div className="flex justify-between mb-2">

<div>

<p className="font-medium text-gray-800">
{day.workerName}
</p>

<p className="text-xs text-gray-500">
{day.workerPhone}
</p>

</div>

<span className={`px-2 py-1 text-xs rounded ${
day.status==="approved"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"
}`}>
{day.status}
</span>

</div>

<div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">

<p>Date</p>
<p>{day.date}</p>

<p>Jobs</p>
<p>{day.jobs}</p>

<p>Total</p>
<p>₹{day.totalCollected}</p>

<p>Worker</p>
<p className="text-green-600">₹{day.workerEarnings}</p>

<p>Platform</p>
<p className="text-indigo-600">₹{day.adminShare}</p>

</div>

{day.status!=="approved" && id && (

<button
onClick={()=>approveSettlement(id)}
className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm"
>
Approve Settlement
</button>

)}

</div>

);

})}

</div>

</div>

</div>

);

}



function StatCard({title,value,color}){

const colors={
blue:"bg-blue-50 text-blue-600",
green:"bg-green-50 text-green-600",
purple:"bg-purple-50 text-purple-600",
yellow:"bg-yellow-50 text-yellow-600"
};

return(

<div className={`p-4 rounded-xl ${colors[color]}`}>

<p className="text-xs">{title}</p>

<p className="text-lg sm:text-xl font-semibold">
₹{value}
</p>

</div>

);

}



function TimeFilter({label,active,onClick}){

return(

<button
onClick={onClick}
className={`px-3 py-1.5 rounded-lg text-sm ${
active
? "bg-black text-white"
: "bg-white border hover:bg-gray-100"
}`}
>
{label}
</button>

);

}