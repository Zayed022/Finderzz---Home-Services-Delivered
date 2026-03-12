import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Layers, Wrench, Settings } from "lucide-react";

import API from "../api/api";

import CategoryPanel from "./CategoryPanel";
import ServicePanel from "./ServicePanel";
import SubServicePanel from "./SubServicePanel";

export default function ManageServices(){

  const navigate = useNavigate();

  const [categories,setCategories] = useState([]);
  const [selectedCategory,setSelectedCategory] = useState(null);

  const [services,setServices] = useState([]);
  const [selectedService,setSelectedService] = useState(null);

  const [subServices,setSubServices] = useState([]);

  /* ================= FETCH ================= */

  const fetchCategories = async()=>{
    const res = await API.get("/category/");
    setCategories(res.data.data);
  };

  const fetchServices = async(categoryId)=>{
    const res = await API.get(`/service/${categoryId}`);
    setServices(res.data.data);
  };

  const fetchSubServices = async(serviceId)=>{
    const res = await API.get(`/subService/service/${serviceId}`);
    setSubServices(res.data.data);
  };

  useEffect(()=>{
    fetchCategories();
  },[]);

  /* ================= DELETE ================= */

  const deleteCategory = async(id)=>{
    await API.delete(`/category/${id}`);
    fetchCategories();
  };

  const deleteService = async(id)=>{
    await API.delete(`/service/${id}`);
    fetchServices(selectedCategory._id);
  };

  const deleteSubService = async(id)=>{
    await API.delete(`/subService/${id}`);
    fetchSubServices(selectedService._id);
  };

  const editCategory = (id)=>{
    navigate(`/services/edit-category/${id}`);
  };

  const editService = (id)=>{
    navigate(`/services/edit-service/${id}`);
  };

  const editSubService = (id)=>{
    navigate(`/services/edit-subservice/${id}`);
  };

  return(

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Service Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage categories, services and subservices
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={()=>navigate("/services/add-category")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={16}/>
            Category
          </button>

          <button
            onClick={()=>navigate("/services/add-service")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={16}/>
            Service
          </button>

          <button
            onClick={()=>navigate("/services/add-subservice")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={16}/>
            SubService
          </button>

        </div>

      </div>


      {/* PANELS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CATEGORY PANEL */}

        <div className="bg-white rounded-xl shadow-sm border">

          <div className="flex items-center gap-2 px-4 py-3 border-b">

            <Layers size={18} className="text-blue-600"/>

            <h2 className="font-semibold text-gray-700">
              Categories
            </h2>

          </div>

          <div className="p-4">

            <CategoryPanel
              categories={categories}
              selectedCategory={selectedCategory}

              selectCategory={(cat)=>{
                setSelectedCategory(cat);
                fetchServices(cat._id);
              }}

              editCategory={editCategory}
              deleteCategory={deleteCategory}
            />

          </div>

        </div>


        {/* SERVICE PANEL */}

        <div className="bg-white rounded-xl shadow-sm border">

          <div className="flex items-center gap-2 px-4 py-3 border-b">

            <Wrench size={18} className="text-green-600"/>

            <h2 className="font-semibold text-gray-700">
              Services
            </h2>

          </div>

          <div className="p-4">

          <ServicePanel
  services={services}
  selectedService={selectedService}

  selectService={(service)=>{
    setSelectedService(service);
    fetchSubServices(service._id);
  }}

  editService={editService}
  deleteService={deleteService}
/>

          </div>

        </div>


        {/* SUBSERVICE PANEL */}

        <div className="bg-white rounded-xl shadow-sm border">

          <div className="flex items-center gap-2 px-4 py-3 border-b">

            <Settings size={18} className="text-purple-600"/>

            <h2 className="font-semibold text-gray-700">
              SubServices
            </h2>

          </div>

          <div className="p-4">

          <SubServicePanel
  subServices={subServices}
  editSubService={editSubService}
  deleteSubService={deleteSubService}
/>

          </div>

        </div>

      </div>

    </div>

  );

}