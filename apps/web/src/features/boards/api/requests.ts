import { api } from "#/shared/api/client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { Board, BoardListQueryIn, CreateBoardInput } from "@bola/contracts/boards";

export async function postBoard(workspaceSlug: string, input: CreateBoardInput) {
  const res = await api.post<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards`, input);
  return res.data.data;
}

export async function getBoards(workspaceSlug: string, query?: BoardListQueryIn) {
  const res = await api.get<ApiSuccess<Board[]>>(`/workspaces/${workspaceSlug}/boards`, {
    params: query,
  });

  let nextCursor = null;
  const pagination = res.data.meta!.pagination!;
  if (pagination.type === "cursor") {
    nextCursor = pagination.nextCursor;
  }

  return { boards: res.data.data, nextCursor };
}

export async function getBoard(workspaceSlug: string, boardId: string) {
  const res = await api.get<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards/${boardId}`);
  return res.data.data;
}
