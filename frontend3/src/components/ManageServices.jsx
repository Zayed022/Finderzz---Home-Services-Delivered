import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const res = await API.get(`/subService/${serviceId}`);
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

  return(

    <div className="p-6">

      {/* ADD BUTTONS */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={()=>navigate("/services/add-category")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>

        <button
          onClick={()=>navigate("/services/add-service")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Service
        </button>

        <button
          onClick={()=>navigate("/services/add-subservice")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Add SubService
        </button>

      </div>

      {/* PANELS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <CategoryPanel
          categories={categories}
          selectedCategory={selectedCategory}

          selectCategory={(cat)=>{
            setSelectedCategory(cat);
            fetchServices(cat._id);
          }}

          deleteCategory={deleteCategory}
        />

        <ServicePanel
          services={services}
          selectedService={selectedService}

          selectService={(service)=>{
            setSelectedService(service);
            fetchSubServices(service._id);
          }}

          deleteService={deleteService}
        />

        <SubServicePanel
          subServices={subServices}
          deleteSubService={deleteSubService}
        />

      </div>

    </div>

  );
}