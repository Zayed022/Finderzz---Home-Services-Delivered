import axios from "axios";

const API = axios.create({
  baseURL: "http://172.20.10.6:8000/api/v1",
  timeout: 20000,
  headers:{
    "Content-Type":"application/json"
  }
});

export default API;