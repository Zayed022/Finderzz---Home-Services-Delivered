import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditService(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories,setCategories] = useState([]);
  const [service,setService] = useState(null);

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [categoryId,setCategoryId] = useState("");
  const [isPopular,setIsPopular] = useState(false);

  const [bannerPreview,setBannerPreview] = useState("");
  const [iconPreview,setIconPreview] = useState("");

  const [loading,setLoading] = useState(false);

  /* ================= FETCH DATA ================= */

  const fetchService = async()=>{
    const res = await API.get(`/service/${id}`);
    const data = res.data.data;

    setService(data);

    setName(data.name);
    setDescription(data.description || "");
    setCategoryId(data.categoryId);
    setIsPopular(data.isPopular || false);

    setBannerPreview(data.bannerImage);
    setIconPreview(data.icon);
  };

  const fetchCategories = async()=>{
    const res = await API.get("/category");
    setCategories(res.data.data);
  };

  useEffect(()=>{
    fetchService();
    fetchCategories();
  },[]);

  /* ================= UPDATE ================= */

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      await API.patch(`/service/${id}`,{
        name,
        description,
        categoryId,
        isPopular
      });

      navigate("/services");

    }catch(err){
      console.error("Update service failed",err);
      alert("Update failed");
    }
    finally{
      setLoading(false);
    }
  };

  if(!service) return <div className="p-8">Loading...</div>;

  return(

    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Edit Service
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CATEGORY */}

          <div>
            <label className="block text-sm mb-1">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e)=>setCategoryId(e.target.value)}
              className="w-full border rounded p-2"
            >

              {categories.map(cat=>(
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}

            </select>
          </div>

          {/* NAME */}

          <div>
            <label className="block text-sm mb-1">
              Service Name
            </label>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm mb-1">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full border rounded p-2"
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

          {/* BANNER PREVIEW */}

          {bannerPreview && (
            <div>
              <p className="text-sm mb-1">Banner</p>
              <img
                src={bannerPreview}
                className="h-32 rounded border"
              />
            </div>
          )}

          {/* ICON PREVIEW */}

          {iconPreview && (
            <div>
              <p className="text-sm mb-1">Icon</p>
              <img
                src={iconPreview}
                className="h-16 rounded border"
              />
            </div>
          )}

          {/* SUBMIT */}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Update Service"}
          </button>

        </form>

      </div>

    </div>

  );
}