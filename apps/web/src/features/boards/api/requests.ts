import { api } from "#/shared/api/client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { Board, CreateBoardInput } from "@bola/contracts/boards";

export async function postBoard(workspaceSlug: string, input: CreateBoardInput) {
  return api
    .post<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards`, input)
    .then((res) => res.data.data);
}

export async function getBoards(workspaceSlug: string) {
  return api
    .get<ApiSuccess<Board[]>>(`/workspaces/${workspaceSlug}/boards`)
    .then((res) => res.data.data);
}

export async function getBoard(workspaceSlug: string, boardId: string) {
  return api
    .get<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards/${boardId}`)
    .then((res) => res.data.data);
}
