import { api } from "#/shared/api/client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { CheckSlugResult, CreateWorkspaceInput, Workspace } from "@bola/contracts/workspaces";

export async function postWorkspace(input: CreateWorkspaceInput) {
  const res = await api.post<ApiSuccess<Workspace>>("/workspaces", input);
  return res.data.data;
}

export async function getWorkspaces() {
  const res = await api.get<ApiSuccess<Workspace[]>>("/workspaces");
  return res.data.data;
}

export async function getWorkspace(slug: string) {
  const res = await api.get<ApiSuccess<Workspace>>(`/workspaces/${slug}`);
  return res.data.data;
}

export async function checkSlug(slug: string) {
  const res = await api.get<ApiSuccess<CheckSlugResult>>("/workspaces/check-slug", {
    params: { slug },
  });
  return res.data.data;
}
