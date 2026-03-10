import { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";

import AddArea from "../area/AddArea";
import UpdateArea from "../area/UpdateArea";
import DeleteArea from "../area/DeleteArea";
import API from "../../api/api";

export default function ManageAreas() {

  const [areas, setAreas] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const [deleteArea, setDeleteArea] = useState(null);

  const [filter, setFilter] = useState("all");

  /* ================= FETCH AREAS ================= */

  const fetchAreas = async () => {
    try {

      setLoading(true);

      const endpoint =
        filter === "active"
          ? "/area/active"
          : `/area?page=${page}&limit=10`;

      const res = await API.get(endpoint);

      if (filter === "active") {
        setAreas(res.data.data);
        setPages(1);
      } else {
        setAreas(res.data.data);
        setPages(res.data.pagination.pages);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [page, filter]);

  /* ================= TOGGLE ================= */

  const toggleAreaStatus = async (id) => {
    try {
      await API.patch(`/area/toggle/${id}`);
      fetchAreas();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold">
          Manage Areas
        </h1>

        <div className="flex flex-wrap gap-2">

          <select
            value={filter}
            onChange={(e) => {
              setPage(1);
              setFilter(e.target.value);
            }}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Areas</option>
            <option value="active">Active</option>
          </select>

          <button
            onClick={fetchAreas}
            className="border px-3 py-2 rounded-lg"
          >
            <FiRefreshCw />
          </button>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus />
            Add Area
          </button>

        </div>

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Area</th>
              <th className="p-3 text-left">Extra Charge</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>

          </thead>

          <tbody>

            {areas.map((area) => (

              <tr key={area._id} className="border-t">

                <td className="p-3 font-medium">
                  {area.name}
                </td>

                <td className="p-3">
                  ₹{area.extraCharge}
                </td>

                <td className="p-3">
                  {new Date(area.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">

                  {area.active ? (

                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Active
                    </span>

                  ) : (

                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      Disabled
                    </span>

                  )}

                </td>

                <td className="p-3 flex justify-end gap-3">

                  <button
                    onClick={() => setEditArea(area)}
                    className="text-blue-600"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => toggleAreaStatus(area._id)}
                    className={area.active ? "text-red-600" : "text-green-600"}
                  >
                    <FiCheckCircle />
                  </button>

                  <button
                    onClick={() => setDeleteArea(area)}
                    className="text-red-600"
                  >
                    <FiTrash2 />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MOBILE CARDS */}

      <div className="md:hidden space-y-4">

        {areas.map((area) => (

          <div
            key={area._id}
            className="bg-white shadow rounded-xl p-4"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-semibold">
                  {area.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Extra Charge: ₹{area.extraCharge}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(area.createdAt).toLocaleDateString()}
                </p>

              </div>

              <div>

                {area.active ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Active
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Disabled
                  </span>
                )}

              </div>

            </div>

            <div className="flex gap-4 mt-4">

              <button
                onClick={() => setEditArea(area)}
                className="text-blue-600"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => toggleAreaStatus(area._id)}
                className={area.active ? "text-red-600" : "text-green-600"}
              >
                <FiCheckCircle />
              </button>

              <button
                onClick={() => setDeleteArea(area)}
                className="text-red-600"
              >
                <FiTrash2 />
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION */}

      {filter === "all" && (

        <div className="flex flex-wrap justify-center gap-2 mt-6">

          {[...Array(pages)].map((_, i) => (

            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "border"
              }`}
            >
              {i + 1}
            </button>

          ))}

        </div>

      )}

      {/* MODALS */}

      {addOpen && (
        <AddArea refresh={fetchAreas} close={() => setAddOpen(false)} />
      )}

      {editArea && (
        <UpdateArea
          area={editArea}
          refresh={fetchAreas}
          close={() => setEditArea(null)}
        />
      )}

      {deleteArea && (
        <DeleteArea
          area={deleteArea}
          refresh={fetchAreas}
          close={() => setDeleteArea(null)}
        />
      )}

    </div>
  );
}