import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: "https://finderzz-home-services-delivered.onrender.com/api/v1",
});

API.interceptors.request.use(async (config) => {

  const token = await SecureStore.getItemAsync("worker_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;