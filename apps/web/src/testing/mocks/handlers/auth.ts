import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { userFactory } from "#/testing/factories";
import type { SignInInput, SignUpInput } from "@bola/contracts/auth";

export const authHandlers = [
  http.post(predicates.api.auth.signUp, () => {
    return HttpResponse.json({ success: true });
  }),
  http.post(predicates.api.auth.verifyEmail, async ({ request }) => {
    const body = (await request.json()) as SignUpInput;
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: "access-token",
        user: userFactory.build({ name: body.name, email: body.email }),
      },
    });
  }),
  http.post(predicates.api.auth.signIn, async ({ request }) => {
    const body = (await request.json()) as SignInInput;
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: "access-token",
        user: userFactory.build({ email: body.email }),
      },
    });
  }),
  http.post(predicates.api.auth.refresh, () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: "access-token",
        user: userFactory.build(),
      },
    });
  }),
  http.post(predicates.api.auth.signOut, () => {
    return HttpResponse.json({ success: true });
  }),
];
