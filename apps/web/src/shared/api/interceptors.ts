import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores";
import type { ApiError, ApiSuccess } from "@bola/contracts/api";
import type { AuthPayload } from "@bola/contracts/auth";

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (reason?: unknown) => void;
}[] = [];

function processQueue(error?: unknown) {
  failedQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      req.resolve();
    }
  });
  failedQueue = [];
}

export function setupInterceptors(instance: AxiosInstance, refreshInstance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (
        error.response?.status === 401 &&
        error.response?.data.error.code === "auth.access_token_expired" &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => failedQueue.push({ resolve, reject }))
            .then(() => instance(originalRequest))
            .catch((error) => Promise.reject(error));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await refreshInstance.post<ApiSuccess<AuthPayload>>("/auth/refresh");
          useAuthStore.getState().setAuth(res.data.data.accessToken, res.data.data.user);

          processQueue();
          return instance(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();

          processQueue(refreshError);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}
