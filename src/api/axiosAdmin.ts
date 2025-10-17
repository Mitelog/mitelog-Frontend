import axios from "axios";

// ✅ 기본 설정
const adminApi = axios.create({
  baseURL: "http://52.78.21.91:8080/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 시 JWT 자동 추가
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= 회원 관리 ================= */

// 🔍 전체 회원 조회 (검색 + 페이징)
export const getAllMembers = (params?: {
  page?: number;
  size?: number;
  type?: string;
  keyword?: string;
}) => adminApi.get("/members", { params });

// 🧾 단일 회원 조회
export const getMemberById = (id: number) => adminApi.get(`/members/${id}`);

// ✏️ 회원 수정
export const updateMember = (id: number, data: any) =>
  adminApi.put(`/members/${id}`, data);

// 🗑 회원 삭제
export const deleteMember = (id: number) => adminApi.delete(`/members/${id}`);

/* ================= 식당 관리 ================= */

// 🔍 전체 식당 조회 (검색 + 페이징)
export const getAllRestaurants = (params?: {
  page?: number;
  size?: number;
  type?: string;
  keyword?: string;
}) => adminApi.get("/restaurants", { params });

// 🧾 단일 식당 조회
export const getRestaurantById = (id: number) =>
  adminApi.get(`/restaurants/${id}`);

// ✏️ 식당 수정
export const updateRestaurant = (id: number, data: any) =>
  adminApi.put(`/restaurants/${id}`, data);

// 🗑 식당 삭제
export const deleteRestaurant = (id: number) =>
  adminApi.delete(`/restaurants/${id}`);

/* ================= 리뷰 관리 ================= */

// 🔍 전체 리뷰 조회 (검색 + 페이징)
export const getAllReviews = (params?: {
  page?: number;
  size?: number;
  type?: string;
  keyword?: string;
}) => adminApi.get("/reviews", { params });

// 🧾 단일 리뷰 조회
export const getReviewById = (id: number) => adminApi.get(`/reviews/${id}`);

// ✏️ 리뷰 수정
export const updateReview = (id: number, data: any) =>
  adminApi.put(`/reviews/${id}`, data);

// 🗑 리뷰 삭제
export const deleteReview = (id: number) => adminApi.delete(`/reviews/${id}`);

export default adminApi;
