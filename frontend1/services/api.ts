import axios from "axios";

const API = axios.create({
  baseURL: "http://10.218.18.100:8000/api/v1",
});

export default API;