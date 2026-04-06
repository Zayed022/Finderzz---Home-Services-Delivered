import axios from "axios";

const API = axios.create({
  baseURL: "https://finderzz-home-services-delivered.onrender.com/api/v1",
});

export default API;