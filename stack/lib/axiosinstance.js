import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
    headers: {
        "Content-Type": "application/json",
    },
});

console.log("Axios BaseURL:", axiosInstance.defaults.baseURL);

export default axiosInstance;