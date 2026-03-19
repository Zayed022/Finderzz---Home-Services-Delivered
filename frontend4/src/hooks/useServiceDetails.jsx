import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const useServiceDetails = (id) => {
  return useQuery({
    queryKey: ["service-details", id],
    queryFn: async () => {
      const res = await API.get(`/service/${id}/details`);
      return res.data.data;
    },
    enabled: !!id,
  });
};