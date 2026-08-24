import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { workspaceFactory } from "#/testing/factories";

export const workspacesHandlers = [
  http.post(predicates.api.workspaces.all, () => {
    return HttpResponse.json({
      success: true,
      data: workspaceFactory.build(),
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
