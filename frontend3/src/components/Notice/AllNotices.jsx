import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AllNotices() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["all-notices"],
    queryFn: async () => {
      const res = await API.get("/notice/");
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/notice/${id}`),
    onSuccess: () => qc.invalidateQueries(["all-notices"]),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => API.patch(`/notice/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries(["all-notices"]),
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Notices</h1>
          <button
            onClick={() => navigate("/create-notice")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Create Notice
          </button>
        </div>

        <div className="space-y-4">
          {data.map((n) => (
            <div
              key={n._id}
              className="border p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{n.heading}</p>
                <p className="text-sm text-gray-500">{n.message}</p>
                <p className="text-xs mt-1">
                  Type: {n.type} | Icon: {n.icon}
                </p>
              </div>

              <div className="flex gap-2">

                {/* TOGGLE */}
                <button
                  onClick={() => toggleMutation.mutate(n._id)}
                  className={`px-3 py-1 rounded text-white ${
                    n.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  {n.active ? "Active" : "Inactive"}
                </button>

                {/* EDIT */}
                <button
                  onClick={() => navigate(`/edit-notice/${n._id}`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteMutation.mutate(n._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}