import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    // In authentication requests, 401 should be handled by the page.
    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/send-otp") ||
      url.includes("/auth/verify-otp") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/forgotPassword") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/verify-reset-otp") ||
      url.includes("/auth/refresh");

    // Do not refresh tokens for login failures or auth endpoints.
    if (isAuthRequest) {
      return Promise.reject(error);
    }

    // Refresh only when a protected API request returns 401.
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          localStorage.removeItem("name");

          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await api.post("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
