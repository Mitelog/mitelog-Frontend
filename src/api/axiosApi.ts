import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axiosAuth from "./axiosAuth";

const axiosApi: AxiosInstance = axios.create({
  baseURL: "http://52.78.21.91:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청 시 accessToken 자동 첨부
axiosApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    console.log("🧩 axiosApi 요청 직전 accessToken:", token);

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// ✅ 공통 에러 처리
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url || "";
    const originalRequest = error.config;

    // ✅ 로그인 없이 접근 가능한 공개 API 경로
    const publicUrls = ["/restaurants", "/menus", "/categories", "/reviews"];

    const isPublic = publicUrls.some((path) => url.includes(path));

    // 1) 401이 아닌 경우: 기존 로직 그대로 유지
    if (status !== 401) {
      if (status === 403) {
        alert("접근 권한이 없습니다.");
      } else if (status === 404) {
        alert("요청한 데이터를 찾을 수 없습니다.");
      }
      return Promise.reject(error);
    }

    // 2) 401인데, 공개 API라면? -> 그냥 에러로 돌려보냄 (refresh 불필요)
    if (isPublic) {
      return Promise.reject(error);
    }

    // 3) 401이 /auth 관련 요청에서 발생한 경우
    if (url.includes("/auth")) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("memberId");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 4) 보호된 API에서 accessToken 만료로 인한 401 처리 로직 (refresh 필요)

    //이미 다른 요청이 리프레시를 시도 중인 경우
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken: string) => {
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = newToken;
          resolve(axiosApi(originalRequest));
        });
      });
    }

    //처음으로 401을 맞은 요청이 들어온 경우 -> 실제 리프레시 시작
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const refreshResponse = await axiosAuth.post("/auth/refresh", {
        refreshToken,
      });

      const tokenData = refreshResponse.data.data;
      const newAccessToken = tokenData.accessToken;
      const newRefreshToken = tokenData.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      const bearerToken = `Bearer ${newAccessToken}`;

      isRefreshing = false;
      onRefreshed(bearerToken);

      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }
      originalRequest.headers.Authorization = bearerToken;

      return axiosApi(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("memberId");
      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

export default axiosApi;
