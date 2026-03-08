import axios from "axios";

const API = axios.create({
  baseURL: "http://finderzz-home-services-delivered.onrender.com/api/v1",
});

export default API;