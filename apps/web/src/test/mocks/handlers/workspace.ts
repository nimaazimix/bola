import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;

export const WorkspaceRoutes = {
  CREATE: `${API_URL}/workspaces`,
  GET_ALL: `${API_URL}/workspaces`,
};

export const workspaceHandlers = [
  http.get(WorkspaceRoutes.CREATE, () => {
    return HttpResponse.json({
      success: true,
      data: { name: "Acme Inc.", slug: "acme-inc" },
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
