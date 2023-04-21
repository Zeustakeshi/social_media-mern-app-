import axios from "axios";
import { getCookie } from "./contst";

const api = axios.create({
    baseURL: "https://example.com/api",
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const access_token = getCookie("access_token");
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
