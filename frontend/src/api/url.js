//url.js
// 
import axios from "axios";

const API = axios.create({
baseURL: "https://timesince-1.onrender.com/api/timers"
});

export default API;