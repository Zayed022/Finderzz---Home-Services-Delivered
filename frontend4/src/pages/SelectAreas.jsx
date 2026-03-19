import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setArea } from "../store/areaSlice";
import { useNavigate } from "react-router-dom";

export default function SelectArea() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await API.get("/area/active");
      return res.data.data;
    },
  });

  if (isLoading) return <p className="p-10">Loading areas...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Select Your Area
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {data.map((area) => (
          <div
            key={area._id}
            onClick={() => {
              dispatch(setArea(area));
              navigate("/");
            }}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
          >
            <h2 className="font-semibold text-lg">
              {area.name}
            </h2>

            
          </div>
        ))}
      </div>

    </div>
  );
}