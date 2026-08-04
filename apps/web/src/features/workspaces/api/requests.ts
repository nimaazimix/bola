import { api } from "#/shared/api/client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { CheckSlugResult, CreateWorkspaceInput, Workspace } from "@bola/contracts/workspaces";

export async function postWorkspace(data: CreateWorkspaceInput) {
  return api.post<ApiSuccess<Workspace>>("/workspaces", data).then((res) => res.data.data);
}

export async function getWorkspaces() {
  return api.get<ApiSuccess<Workspace[]>>("/workspaces").then((res) => res.data.data);
}

export async function checkSlug(slug: string) {
  return api
    .get<ApiSuccess<CheckSlugResult>>("/workspaces/check-slug", { params: { slug } })
    .then((res) => res.data.data);
}

export async function getWorkspace(slug: string) {
  return api.get<ApiSuccess<Workspace>>(`/workspaces/${slug}`).then((res) => res.data.data);
}
