import { useState } from "react";
import API from "../../api/api"
import toast from "react-hot-toast";

export default function AddBanner({ refresh, close }) {

  const [title,setTitle] = useState("");
  const [redirectUrl,setRedirectUrl] = useState("");
  const [order,setOrder] = useState(1);
  const [image,setImage] = useState(null);
  const [preview,setPreview] = useState(null);
  const [loading,setLoading] = useState(false);

  const imageHandler = (e)=>{
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      const formData = new FormData();

      formData.append("title",title);
      formData.append("redirectUrl",redirectUrl);
      formData.append("order",order);
      formData.append("bannerImage",image);

      await API.post("/banner/",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      toast.success("Banner created");

      refresh();
      close();

    }catch(err){
      toast.error(err?.response?.data?.message || "Upload failed");
    }finally{
      setLoading(false);
    }
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow-xl w-[450px]">

      <h2 className="text-xl font-semibold mb-4">
        Add Banner
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          type="file"
          accept="image/*"
          onChange={imageHandler}
        />

        {preview && (
          <img
            src={preview}
            className="rounded-lg h-32 object-cover"
          />
        )}

        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Redirect URL"
          value={redirectUrl}
          onChange={(e)=>setRedirectUrl(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Order"
          value={order}
          onChange={(e)=>setOrder(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Create Banner"}
        </button>

      </form>

    </div>
  );
}