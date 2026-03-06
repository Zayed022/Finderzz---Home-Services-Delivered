import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: "http://10.218.18.100:8000/api/v1",
});

API.interceptors.request.use(async (config) => {

  const token = await SecureStore.getItemAsync("worker_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;