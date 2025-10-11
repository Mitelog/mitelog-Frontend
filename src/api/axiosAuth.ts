import axios, { AxiosInstance } from "axios";

const axiosAuth: AxiosInstance = axios.create({
  baseURL: "http:/52.78.21.91:8080", // ✅ /auth 경로용
  headers: { "Content-Type": "application/json" },
});

export default axiosAuth;
