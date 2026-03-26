import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";


export const useCategories = () => {
  return useQuery({
    queryKey: ["categories-with-services"],
    queryFn: async () => {
      const res = await API.get("/category/with-services");
      return res.data.data;
    },
  });
};