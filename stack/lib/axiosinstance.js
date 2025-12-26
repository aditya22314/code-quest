import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((req) => {
    if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user?.token) {
                req.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    }
    return req;
});

console.log("Axios BaseURL:", axiosInstance.defaults.baseURL);

export default axiosInstance;