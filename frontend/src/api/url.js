//url.js
// 
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4001/api/timers"
});

export default API;