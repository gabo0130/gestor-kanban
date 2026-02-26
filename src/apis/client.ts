import axios from "axios";
import { uiShowModal, uiStartLoading, uiStopLoading } from "@/hooks/ui-state";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const getSuccessMessage = (method?: string) => {
  switch ((method ?? "").toLowerCase()) {
    case "post":
      return "Operación creada correctamente.";
    case "put":
    case "patch":
      return "Operación actualizada correctamente.";
    case "delete":
      return "Operación eliminada correctamente.";
    default:
      return "Operación completada.";
  }
};

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const hasAuthorizationHeader = !!config.headers?.Authorization;

      if (storedToken && !hasAuthorizationHeader) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }

    uiStartLoading();
    return config;
  },
  (error) => {
    uiStopLoading();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    uiStopLoading();

    const method = response.config.method?.toLowerCase();
    const apiMessage =
      typeof response.data?.message === "string" ? response.data.message : undefined;

    if (method && ["post", "put", "patch", "delete"].includes(method)) {
      uiShowModal({
        title: "Éxito",
        message: apiMessage ?? getSuccessMessage(method),
        variant: "success",
      });
    }

    return response;
  },
  (error) => {
    uiStopLoading();

    const status = error.response?.status;
    const apiMessage =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : "Ocurrió un error en la solicitud.";

    if (status && status >= 500) {
      uiShowModal({ title: "Error del servidor", message: apiMessage, variant: "error" });
    } else if (status && status >= 400) {
      uiShowModal({ title: "Error", message: apiMessage, variant: "warning" });
    } else {
      uiShowModal({
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor.",
        variant: "error",
      });
    }

    if (error.response?.status === 401) {
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