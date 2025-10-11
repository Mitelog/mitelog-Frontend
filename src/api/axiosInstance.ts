import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://52.78.21.91:8080", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    // ✅ 403: 접근 권한 없음
    else if (status === 403) {
      alert("접근 권한이 없습니다.");
    }

    // ✅ 404: 데이터 없음
    else if (status === 404) {
      alert("요청한 데이터를 찾을 수 없습니다.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
