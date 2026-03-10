import { useEffect, useState } from "react";


import CategoryPanel from "./CategoryPanel";
import ServicePanel from "./ServicePanel";
import SubServicePanel from "./SubServicePanel";
import API from "../api/api";

export default function ManageServices(){

  const [categories,setCategories] = useState([]);
  const [selectedCategory,setSelectedCategory] = useState(null);

  const [services,setServices] = useState([]);
  const [selectedService,setSelectedService] = useState(null);

  const [subServices,setSubServices] = useState([]);

  const fetchCategories = async()=>{
    const res = await API.get("/categories");
    setCategories(res.data.data);
  };

  const fetchServices = async(categoryId)=>{
    const res = await API.get(`/services/${categoryId}`);
    setServices(res.data.data);
  };

  const fetchSubServices = async(serviceId)=>{
    const res = await API.get(`/subservices/${serviceId}`);
    setSubServices(res.data.data);
  };

  useEffect(()=>{
    fetchCategories();
  },[]);

  return(

    <div className="grid grid-cols-3 gap-6 p-6">

      <CategoryPanel
        categories={categories}
        selectCategory={(cat)=>{
          setSelectedCategory(cat);
          fetchServices(cat._id);
        }}
      />

      <ServicePanel
        services={services}
        selectService={(service)=>{
          setSelectedService(service);
          fetchSubServices(service._id);
        }}
      />

      <SubServicePanel
        subServices={subServices}
      />

    </div>

  );

}