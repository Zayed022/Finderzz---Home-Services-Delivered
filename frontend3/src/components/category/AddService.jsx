import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


export default function AddService(){

  const navigate = useNavigate();

  const [categories,setCategories] = useState([]);

  const [categoryId,setCategoryId] = useState("");
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [isPopular,setIsPopular] = useState(false);

  const [bannerImage,setBannerImage] = useState(null);
  const [icon,setIcon] = useState(null);

  const [loading,setLoading] = useState(false);

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async ()=>{
    try{

      const res = await API.get("/category/");

      setCategories(res.data.data);

    }catch(err){
      console.error("Failed to fetch categories",err);
    }
  };

  useEffect(()=>{
    fetchCategories();
  },[]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async(e)=>{
    e.preventDefault();

    if(!categoryId || !name){
      alert("Category and name are required");
      return;
    }

    try{

      setLoading(true);

      const formData = new FormData();

      formData.append("categoryId",categoryId);
      formData.append("name",name);
      formData.append("description",description);
      formData.append("isPopular",isPopular);

      formData.append("bannerImage",bannerImage);
      formData.append("icon",icon);

      await API.post("/service/",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      navigate("/services");

    }catch(err){
      console.error("Create service failed",err);
      alert("Failed to create service");
    }finally{
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return(

    <div className="p-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Add Service
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >

        {/* CATEGORY */}

        <div>
          <label className="block mb-1 font-medium">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e)=>setCategoryId(e.target.value)}
            className="w-full border rounded p-2"
          >

            <option value="">
              Select Category
            </option>

            {categories.map(cat=>(
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}

          </select>
        </div>

        {/* SERVICE NAME */}

        <div>
          <label className="block mb-1 font-medium">
            Service Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Service name"
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        {/* POPULAR */}

        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={isPopular}
            onChange={(e)=>setIsPopular(e.target.checked)}
          />

          <label>
            Mark as Popular
          </label>

        </div>

        {/* BANNER IMAGE */}

        <div>
          <label className="block mb-1 font-medium">
            Banner Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setBannerImage(e.target.files[0])}
          />
        </div>

        {/* ICON */}

        <div>
          <label className="block mb-1 font-medium">
            Icon Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setIcon(e.target.files[0])}
          />
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>

      </form>

    </div>

  );
}