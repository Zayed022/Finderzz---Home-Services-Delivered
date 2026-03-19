import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setArea } from "../store/areaSlice";

export default function AreaModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState([]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await API.get("/area/active");
      return res.data.data;
    },
    enabled: isOpen,
  });

  /* 🔥 Load recent from localStorage */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentAreas")) || [];
    setRecent(stored);
  }, [isOpen]);

  /* 🔥 Handle select */
  const handleSelect = (area) => {
    dispatch(setArea(area));

    let updated = [area, ...recent.filter((r) => r._id !== area._id)];
    updated = updated.slice(0, 5);

    localStorage.setItem("recentAreas", JSON.stringify(updated));
    setRecent(updated);

    onClose();
  };

  /* 🔍 Filter */
  const filtered = data.filter((area) =>
    area.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start pt-20">

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Area</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* RECENT */}
        {recent.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Recent</p>
            <div className="flex flex-wrap gap-2">
              {recent.map((area) => (
                <button
                  key={area._id}
                  onClick={() => handleSelect(area)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-primary hover:text-white transition"
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filtered.map((area) => (
              <div
                key={area._id}
                onClick={() => handleSelect(area)}
                className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{area.name}</span>
                
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}