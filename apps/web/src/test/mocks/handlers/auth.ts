import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { userFactory } from "#/test/factories";

export const authHandlers = [
  http.post(predicates.api.auth.signUp, () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.post(predicates.api.auth.verifyEmail, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: userFactory.build() },
    });
  }),
  http.post(predicates.api.auth.signIn, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: userFactory.build() },
    });
  }),
  http.post(predicates.api.auth.refresh, () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: "access-token", user: userFactory.build() },
    });
  }),
  http.post(predicates.api.auth.signOut, () => {
    return HttpResponse.json({ success: true });
  }),
];
