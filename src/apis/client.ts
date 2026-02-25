import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpiar sesión en caso de token inválido/expirado
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      document.cookie = "auth_token=; path=/; max-age=0";
      delete apiClient.defaults.headers.common["Authorization"];

      // Redirigir solo si no estamos ya en login
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);