import { useState } from "react";
import API from "../../api/api";

export default function CreateVertical() {

const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [bannerImage,setBannerImage] = useState(null);
const [icon,setIcon] = useState(null);

const [dynamicFields,setDynamicFields] = useState([]);

const [loading,setLoading] = useState(false);

const addField = () => {

setDynamicFields([
...dynamicFields,
{
label:"",
name:"",
type:"text",
required:false,
options:[]
}
]);

};

const updateField = (index,key,value) => {

const updated = [...dynamicFields];
updated[index][key] = value;
setDynamicFields(updated);

};

const removeField = (index) => {

setDynamicFields(dynamicFields.filter((_,i)=>i!==index));

};

const addOption = (index) => {

const updated = [...dynamicFields];
updated[index].options.push("");
setDynamicFields(updated);

};

const updateOption = (fieldIndex,optionIndex,value) => {

const updated = [...dynamicFields];
updated[fieldIndex].options[optionIndex] = value;
setDynamicFields(updated);

};

const handleSubmit = async (e) => {

e.preventDefault();

try{

setLoading(true);

const formData = new FormData();

formData.append("name",name);
formData.append("description",description);
formData.append("bannerImage",bannerImage);
formData.append("icon",icon);

formData.append("dynamicFields",JSON.stringify(dynamicFields));

await API.post("/vertical",formData);

alert("Vertical Created Successfully");

setName("");
setDescription("");
setDynamicFields([]);

}catch(error){

console.error(error);

}finally{

setLoading(false);

}

};

return(

<div className="p-6 md:p-10 bg-gray-50 min-h-screen">

<div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6">

<h1 className="text-2xl font-semibold mb-6">
Create Vertical
</h1>

<form onSubmit={handleSubmit} className="space-y-6">

{/* BASIC DETAILS */}

<div className="grid md:grid-cols-2 gap-4">

<input
placeholder="Vertical Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="border rounded-lg p-3"
/>

<input
type="file"
onChange={(e)=>setIcon(e.target.files[0])}
className="border rounded-lg p-3"
/>

</div>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border rounded-lg p-3 w-full"
/>

<input
type="file"
onChange={(e)=>setBannerImage(e.target.files[0])}
className="border rounded-lg p-3"
/>

{/* DYNAMIC FIELDS */}

<div>

<div className="flex justify-between items-center mb-3">

<h2 className="font-medium">
Dynamic Fields
</h2>

<button
type="button"
onClick={addField}
className="px-3 py-1 text-sm bg-black text-white rounded"
>
Add Field
</button>

</div>

<div className="space-y-4">

{dynamicFields.map((field,index)=>(
<div key={index} className="border rounded-lg p-4">

<div className="grid md:grid-cols-4 gap-3">

<input
placeholder="Label"
value={field.label}
onChange={(e)=>updateField(index,"label",e.target.value)}
className="border p-2 rounded"
/>

<input
placeholder="Name"
value={field.name}
onChange={(e)=>updateField(index,"name",e.target.value)}
className="border p-2 rounded"
/>

<select
value={field.type}
onChange={(e)=>updateField(index,"type",e.target.value)}
className="border p-2 rounded"
>
<option>text</option>
<option>textarea</option>
<option>date</option>
<option>time</option>
<option>number</option>
<option>select</option>
<option>image</option>
<option>location</option>
</select>

<label className="flex items-center gap-2">

<input
type="checkbox"
checked={field.required}
onChange={(e)=>updateField(index,"required",e.target.checked)}
/>

Required

</label>

</div>

{/* SELECT OPTIONS */}

{field.type === "select" && (

<div className="mt-3 space-y-2">

{field.options.map((opt,i)=>(
<input
key={i}
value={opt}
onChange={(e)=>updateOption(index,i,e.target.value)}
placeholder="Option"
className="border p-2 rounded w-full"
/>
))}

<button
type="button"
onClick={()=>addOption(index)}
className="text-sm text-blue-600"
>
Add Option
</button>

</div>

)}

<button
type="button"
onClick={()=>removeField(index)}
className="text-red-500 text-sm mt-3"
>
Remove Field
</button>

</div>
))}

</div>

</div>

<button
className="bg-black text-white px-6 py-2 rounded"
disabled={loading}
>
{loading ? "Creating..." : "Create Vertical"}
</button>

</form>

</div>

</div>

);

}