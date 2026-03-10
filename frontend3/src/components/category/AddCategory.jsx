import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


export default function AddCategory(){

  const navigate = useNavigate();

  const [name,setName] = useState("");

  const submit = async(e)=>{
    e.preventDefault();

    await API.post("/category",{name});

    navigate("/services");
  };

  return(

    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Add Category
      </h2>

      <form onSubmit={submit} className="flex flex-col gap-4 max-w-md">

        <input
          placeholder="Category name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Create Category
        </button>

      </form>

    </div>

  );
}