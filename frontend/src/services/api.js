import axios from "axios";

const baseURL = "http://localhost:8000/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

// 🔹 Attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message =
      error.response?.data?.error || error.response?.data?.msg;

    const shouldRefresh =
      !originalRequest?._retry &&
      (status === 401 ||
        (status === 400 && message === "invalid token"));

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await refreshClient.post("/refresh");
      const newAccessToken = refreshResponse.data?.accessToken;

      if (!newAccessToken) throw error;

      localStorage.setItem("accessToken", newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return API(originalRequest);
    } catch (refreshError) {
      // 🔥 CRITICAL: force logout everywhere
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      window.location.href = "/"; // or "/?auth=login"

      return Promise.reject(refreshError);
    }
  }
);

export default API;