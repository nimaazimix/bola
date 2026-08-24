import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { workspaceFactory } from "#/testing/factories";
import type { CreateWorkspaceInput } from "@bola/contracts/workspaces";

export const workspacesHandlers = [
  http.post(predicates.api.workspaces.all, async ({ request }) => {
    const body = (await request.json()) as CreateWorkspaceInput;
    return HttpResponse.json({
      success: true,
      data: workspaceFactory.build({ name: body.name, slug: body.slug }),
    });
  }),
  http.get(predicates.api.workspaces.all, () => {
    return HttpResponse.json({
      success: true,
      data: workspaceFactory.buildList(3),
    });
  }),
  http.get(predicates.api.workspaces.checkSlug, () => {
    return HttpResponse.json({
      success: true,
      data: { available: true },
    });
  }),
  http.get<{ slug: string }>(predicates.api.workspaces.one, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: workspaceFactory.build({ slug: params.slug }),
    });
  }),
];
