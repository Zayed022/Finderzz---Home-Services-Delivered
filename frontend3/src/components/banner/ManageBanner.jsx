import { useEffect, useState } from "react";

import { FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi";

import AddBanner from "./AddBanner";
import DeleteBanner from "./DeleteBanner";
import API from "../../api/api";

export default function ManageBanners(){

  const [banners,setBanners] = useState([]);
  const [addOpen,setAddOpen] = useState(false);
  const [deleteBanner,setDeleteBanner] = useState(null);

  const fetchBanners = async()=>{

    const res = await API.get("/banner/active");

    setBanners(res.data.data);

  };

  useEffect(()=>{
    fetchBanners();
  },[]);

  return(

    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Manage Banners
        </h1>

        <button
          onClick={()=>setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus/>
          Add Banner
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {banners.map((banner)=>(
          
          <div
            key={banner._id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={banner.bannerImage}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">

              <h3 className="font-semibold">
                {banner.title}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                Order: {banner.order}
              </p>

              <div className="flex justify-between">

                <a
                  href={banner.redirectUrl}
                  target="_blank"
                  className="text-blue-600"
                >
                  <FiExternalLink/>
                </a>

                <button
                  onClick={()=>setDeleteBanner(banner)}
                  className="text-red-600"
                >
                  <FiTrash2/>
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {addOpen && (
        <AddBanner
          refresh={fetchBanners}
          close={()=>setAddOpen(false)}
        />
      )}

      {deleteBanner && (
        <DeleteBanner
          banner={deleteBanner}
          refresh={fetchBanners}
          close={()=>setDeleteBanner(null)}
        />
      )}

    </div>

  );

}