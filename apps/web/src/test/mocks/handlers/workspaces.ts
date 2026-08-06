import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";

export const workspacesHandlers = [
  http.post(predicates.api.workspaces.all, () => {
    return HttpResponse.json({
      success: true,
      data: { name: "Acme Inc", slug: "acme-inc" },
    });
  }),
  http.get(predicates.api.workspaces.all, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { name: "Workspace 1", slug: "workspace-1" },
        { name: "Workspace 2", slug: "workspace-2" },
        { name: "Workspace 3", slug: "workspace-3" },
      ],
    });
  }),
  http.get(predicates.api.workspaces.checkSlug, () => {
    return HttpResponse.json({
      success: true,
      data: { available: true },
    });
  }),
];
