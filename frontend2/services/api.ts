import axios from "axios";

const API = axios.create({
  baseURL: "http://10.218.18.100:8000/api/v1",
  timeout: 20000,
  headers:{
    "Content-Type":"application/json"
  }
});

export default API;