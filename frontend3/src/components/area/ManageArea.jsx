import { useEffect, useState } from "react";

import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

import AddArea from "./AddArea";
import UpdateArea from "./UpdateArea";
import DeleteArea from "./DeleteArea";
import API from "../../api/api";

export default function ManageAreas() {

  const [areas, setAreas] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const [deleteArea, setDeleteArea] = useState(null);

  const fetchAreas = async () => {
    const res = await API.get(`/area?page=${page}&limit=10`);

    setAreas(res.data.data);
    setPages(res.data.pagination.pages);
  };

  useEffect(() => {
    fetchAreas();
  }, [page]);

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Manage Areas
        </h1>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus />
          Add Area
        </button>

      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Area</th>
              <th className="p-3 text-left">Extra Charge</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>

          </thead>

          <tbody>

            {areas.map((area) => (
              <tr key={area._id} className="border-t">

                <td className="p-3">{area.name}</td>

                <td className="p-3">
                  ₹{area.extraCharge}
                </td>

                <td className="p-3">
                  {new Date(area.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex justify-end gap-3">

                  <button
                    onClick={() => setEditArea(area)}
                    className="text-blue-600"
                  >
                    <FiEdit />
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

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-6">

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

      {/* MODALS */}

      {addOpen && (
        <AddArea
          refresh={fetchAreas}
          close={() => setAddOpen(false)}
        />
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