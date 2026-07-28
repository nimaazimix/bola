import { api } from "#/shared/api";
import type { ApiSuccess } from "@bola/contracts/api";
import type { CheckSlugResult } from "@bola/contracts/workspaces";

export async function checkSlug(slug: string) {
  const res = await api.get<ApiSuccess<CheckSlugResult>>("/workspaces/check-slug", {
    params: { slug },
  });

  return res.data.data.available;
}
