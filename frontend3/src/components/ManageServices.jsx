import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Layers, Wrench, Settings } from "lucide-react";

import API from "../api/api";

import CategoryPanel from "./CategoryPanel";
import ServicePanel from "./ServicePanel";
import SubServicePanel from "./SubServicePanel";

export default function ManageServices() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [subServices, setSubServices] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/category/");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Category fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (categoryId) => {
    if (!categoryId) return;

    try {
      const res = await API.get(`/service/category/${categoryId}`);
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Service fetch failed", err);
    }
  };

  const fetchSubServices = async (serviceId) => {
    if (!serviceId) return;

    try {
      const res = await API.get(`/subService/service/${serviceId}`);
      setSubServices(res.data.data || []);
    } catch (err) {
      console.error("SubService fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= DELETE ================= */

  const deleteCategory = async (id) => {
    await API.delete(`/category/${id}`);

    if (selectedCategory?._id === id) {
      setSelectedCategory(null);
      setServices([]);
      setSubServices([]);
    }

    fetchCategories();
  };

  const deleteService = async (id) => {
    await API.delete(`/service/${id}`);

    if (selectedService?._id === id) {
      setSelectedService(null);
      setSubServices([]);
    }

    fetchServices(selectedCategory?._id);
  };

  const deleteSubService = async (id) => {
    await API.delete(`/subService/${id}`);
    fetchSubServices(selectedService?._id);
  };

  /* ================= EDIT ================= */

  const editCategory = (id) => navigate(`/services/edit-category/${id}`);
  const editService = (id) => navigate(`/services/edit-service/${id}`);
  const editSubService = (id) => navigate(`/services/edit-subservice/${id}`);

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Service Management
          </h1>
          <p className="text-gray-500 mt-1">
            Organize categories, services and subservices efficiently
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/services/add-category")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={16} />
            Add Category
          </button>

          <button
            onClick={() => navigate("/services/add-service")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={16} />
            Add Service
          </button>

          <button
            onClick={() => navigate("/services/add-subservice")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={16} />
            Add SubService
          </button>

        </div>
      </div>

      {/* PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CATEGORY PANEL */}
        <div className="bg-white rounded-2xl shadow border hover:shadow-md transition">

          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">
                Categories
              </h2>
            </div>

            {selectedCategory && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Selected
              </span>
            )}
          </div>

          <div className="p-4 min-h-[300px]">

            {loading ? (
              <p className="text-center text-gray-400">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-400">
                No categories found
              </p>
            ) : (
              <CategoryPanel
                categories={categories}
                selectedCategory={selectedCategory}

                selectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedService(null);
                  setSubServices([]);
                  fetchServices(cat._id);
                }}

                editCategory={editCategory}
                deleteCategory={deleteCategory}
              />
            )}

          </div>
        </div>

        {/* SERVICE PANEL */}
        <div className="bg-white rounded-2xl shadow border hover:shadow-md transition">

          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-green-600" />
              <h2 className="font-semibold text-gray-800">
                Services
              </h2>
            </div>

            {selectedService && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                Selected
              </span>
            )}
          </div>

          <div className="p-4 min-h-[300px]">

            {!selectedCategory ? (
              <p className="text-center text-gray-400">
                Select a category first
              </p>
            ) : services.length === 0 ? (
              <p className="text-center text-gray-400">
                No services found
              </p>
            ) : (
              <ServicePanel
                services={services}
                selectedService={selectedService}

                selectService={(service) => {
                  setSelectedService(service);
                  fetchSubServices(service._id);
                }}

                editService={editService}
                deleteService={deleteService}
              />
            )}

          </div>
        </div>

        {/* SUBSERVICE PANEL */}
        <div className="bg-white rounded-2xl shadow border hover:shadow-md transition">

          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <Settings size={18} className="text-purple-600" />
            <h2 className="font-semibold text-gray-800">
              SubServices
            </h2>
          </div>

          <div className="p-4 min-h-[300px]">

            {!selectedService ? (
              <p className="text-center text-gray-400">
                Select a service first
              </p>
            ) : subServices.length === 0 ? (
              <p className="text-center text-gray-400">
                No subservices found
              </p>
            ) : (
              <SubServicePanel
                subServices={subServices}
                editSubService={editSubService}
                deleteSubService={deleteSubService}
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
}