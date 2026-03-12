import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditCategory(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [icon,setIcon] = useState("");
  const [order,setOrder] = useState(0);

  const [loading,setLoading] = useState(false);

  /* ================= FETCH CATEGORY ================= */

  const fetchCategory = async()=>{

    try{

      const res = await API.get(`/category/${id}`);

      const cat = res.data.data;

      setName(cat.name || "");
      setDescription(cat.description || "");
      setIcon(cat.icon || "");
      setOrder(cat.order || 0);

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchCategory();
  },[]);

  /* ================= UPDATE ================= */

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      await API.patch(`/category/${id}`,{
        name,
        description,
        icon,
        order
      });

      navigate("/services");

    }catch(err){
      console.error("Update failed",err);
      alert("Update failed");
    }finally{
      setLoading(false);
    }

  };

  /* ================= UI ================= */

  return(

    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Edit Category
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >

        <div>
          <label className="block mb-1 font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Icon
          </label>

          <input
            type="text"
            value={icon}
            onChange={(e)=>setIcon(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Order
          </label>

          <input
            type="number"
            value={order}
            onChange={(e)=>setOrder(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>

      </form>

    </div>

  );
}