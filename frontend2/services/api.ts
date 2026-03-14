import axios from "axios";

const API = axios.create({
  baseURL: "https://finderzz-home-services-delivered.onrender.com/api/v1",
  timeout: 20000,
  headers:{
    "Content-Type":"application/json"
  }
});

export default API;