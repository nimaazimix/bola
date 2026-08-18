import { api } from "#/shared/api/client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { Board, BoardListQueryIn, CreateBoardInput } from "@bola/contracts/boards";

export async function postBoard(workspaceSlug: string, input: CreateBoardInput) {
  return api
    .post<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards`, input)
    .then((res) => res.data.data);
}

export async function getBoards(workspaceSlug: string, query?: BoardListQueryIn) {
  return api
    .get<ApiSuccess<Board[]>>(`/workspaces/${workspaceSlug}/boards`, { params: query })
    .then((res) => res.data.data);
}

export async function getBoard(workspaceSlug: string, boardId: string) {
  return api
    .get<ApiSuccess<Board>>(`/workspaces/${workspaceSlug}/boards/${boardId}`)
    .then((res) => res.data.data);
}
