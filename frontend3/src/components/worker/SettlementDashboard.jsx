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


<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

{/* HEADER */}

  <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">

```
<div>
  <h3 className="text-lg font-semibold text-gray-900">
    Worker Settlements
  </h3>

  <p className="text-sm text-gray-500 mt-1">
    Monitor payouts, platform earnings and settlement approvals
  </p>
</div>

<div className="flex items-center gap-3">

  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
    {filteredData.length} Records
  </div>

  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
    {filteredData.filter(x => x.status === "approved").length} Approved
  </div>

  <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
    {filteredData.filter(x => x.status === "pending").length} Pending
  </div>

</div>
```

  </div>

{/* DESKTOP TABLE */}

  <div className="hidden lg:block overflow-x-auto">


<table className="w-full">

  <thead className="sticky top-0 bg-gray-50 border-b z-10">

    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">

      <th className="px-6 py-4"></th>
      <th className="px-4 py-4">Booking</th>
      <th className="px-4 py-4">Date</th>
      <th className="px-4 py-4">Worker</th>
      <th className="px-4 py-4 text-center">Jobs</th>
      <th className="px-4 py-4 text-right">Total</th>
      <th className="px-4 py-4 text-right">Worker</th>
      <th className="px-4 py-4 text-right">Platform</th>
      <th className="px-4 py-4 text-center">Status</th>
      <th className="px-6 py-4 text-center">Action</th>

    </tr>

  </thead>

  <tbody>

    {loading ? (

      <tr>
        <td colSpan="10" className="py-20 text-center text-gray-500">
          Loading settlements...
        </td>
      </tr>

    ) : filteredData.length === 0 ? (

      <tr>
        <td colSpan="10" className="py-20 text-center">

          <div className="flex flex-col items-center">

            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              📄
            </div>

            <p className="font-medium text-gray-700">
              No settlements found
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Try changing filters or search criteria
            </p>

          </div>

        </td>
      </tr>

    ) : (

      filteredData.map((day,index)=>{

        const id = day.settlementId;

        return(

          <tr
            key={day.bookingId}
            className={`
              border-b transition-all duration-150
              hover:bg-blue-50/40
              ${selected.includes(id)
                ? "bg-blue-50"
                : index % 2 === 0
                ? "bg-white"
                : "bg-gray-50/30"}
            `}
          >

            <td className="px-6 py-4">

              {id && (

                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={()=>{
                    if(selected.includes(id)){
                      setSelected(prev=>prev.filter(x=>x!==id))
                    }else{
                      setSelected(prev=>
                        prev.includes(id)
                          ? prev
                          : [...prev,id]
                      )
                    }
                  }}
                />

              )}

            </td>

            <td className="px-4 py-4">

              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                #{String(day.bookingId).slice(-6)}
              </span>

            </td>

            <td className="px-4 py-4 font-medium">
              {day.date}
            </td>

            <td className="px-4 py-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                  {day.workerName?.charAt(0)}
                </div>

                <div>

                  <p className="font-medium text-gray-900">
                    {day.workerName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {day.workerPhone}
                  </p>

                </div>

              </div>

            </td>

            <td className="text-center font-medium">
              {day.jobs}
            </td>

            <td className="text-right font-semibold">
              ₹{day.totalCollected}
            </td>

            <td className="text-right font-semibold text-green-600">
              ₹{day.workerEarnings}
            </td>

            <td className="text-right font-semibold text-indigo-600">
              ₹{day.adminShare}
            </td>

            <td className="text-center">

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  day.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : day.status === "submitted"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {day.status}
              </span>

            </td>

            <td className="text-center">

              {day.status === "submitted" && id && (

                <button
                  onClick={()=>approveSettlement(id)}
                  disabled={approving===id}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                >
                  {approving===id
                    ? "Approving..."
                    : "Approve"}
                </button>

              )}

            </td>

          </tr>

        )

      })

    )}

  </tbody>

</table>


  </div>

{/* MOBILE */}

  <div className="lg:hidden divide-y">

```
{filteredData.map(day=>{

  const id = day.settlementId;

  return(

    <div
      key={day.bookingId}
      className="p-5 hover:bg-gray-50 transition"
    >

      <div className="flex items-start justify-between mb-4">

        <div>

          <h4 className="font-semibold text-gray-900">
            {day.workerName}
          </h4>

          <p className="text-sm text-gray-500">
            {day.workerPhone}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            #{String(day.bookingId).slice(-6)}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            day.status === "approved"
              ? "bg-green-100 text-green-700"
              : day.status === "submitted"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {day.status}
        </span>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <Metric title="Date" value={day.date}/>
        <Metric title="Jobs" value={day.jobs}/>
        <Metric title="Total" value={`₹${day.totalCollected}`}/>
        <Metric title="Platform" value={`₹${day.adminShare}`}/>
        <Metric title="Worker" value={`₹${day.workerEarnings}`}/>

      </div>

      {day.status === "submitted" && id && (

        <button
          onClick={()=>approveSettlement(id)}
          className="w-full mt-4 bg-black text-white py-3 rounded-xl font-medium"
        >
          Approve Settlement
        </button>

      )}

    </div>

  )

})}
```

  </div>

</div>




{/* MOBILE CARDS */}

<div className="md:hidden divide-y">

{filteredData.map(day=>{

const id=day.settlementId;

return(

<div key={day.bookingId} className="p-4">

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

{day.status=="submitted" && id && (

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


function Metric({ title, value }) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    );
  }