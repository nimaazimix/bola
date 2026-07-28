import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;

export const WorkspaceRoutes = {
  CREATE: `${API_URL}/workspaces`,
  CHECK_SLUG: `${API_URL}/workspaces/check-slug`,
  GET_ALL: `${API_URL}/workspaces`,
};

export const workspaceHandlers = [
  http.post(WorkspaceRoutes.CREATE, () => {
    return HttpResponse.json({
      success: true,
      data: { name: "Acme Inc.", slug: "acme-inc" },
    });
  }),
  http.get(WorkspaceRoutes.CHECK_SLUG, () => {
    return HttpResponse.json({
      success: true,
      data: { available: true },
    });
  }),
  http.get(WorkspaceRoutes.GET_ALL, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { name: "Workspace 1", slug: "workspace-1" },
        { name: "Workspace 2", slug: "workspace-2" },
        { name: "Workspace 3", slug: "workspace-3" },
      ],
    });
  }),
];
