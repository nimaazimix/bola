import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthRoutes = {
  SIGNUP: `${API_URL}/auth/signup`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
  SIGNIN: `${API_URL}/auth/signin`,
  REFRESH: `${API_URL}/auth/refresh`,
};

export const authHandlers = [
  http.post(AuthRoutes.SIGNUP, () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.post(AuthRoutes.VERIFY_EMAIL, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: {} },
    });
  }),
  http.post(AuthRoutes.SIGNIN, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: {} },
    });
  }),
  http.post(AuthRoutes.REFRESH, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: {} },
    });
  }),
];
