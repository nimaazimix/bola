import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { boardFactory } from "#/testing/factories";
import type { CreateBoardInput } from "@bola/contracts/boards";

export const boardsHandlers = [
  http.post(predicates.api.boards.all, async ({ request }) => {
    const body = (await request.json()) as CreateBoardInput;
    return HttpResponse.json({
      success: true,
      data: boardFactory.build({ name: body.name }),
    });
  }),
  http.get(predicates.api.boards.all, ({ request }) => {
    const cursor = new URL(request.url).searchParams.get("cursor");

    if (!cursor) {
      return HttpResponse.json({
        success: true,
        data: boardFactory.buildList(2),
        meta: { pagination: { type: "cursor", nextCursor: "brd_2" } },
      });
    }

    if (cursor === "brd_2") {
      return HttpResponse.json({
        success: true,
        data: boardFactory.buildList(1),
        meta: { pagination: { type: "cursor", nextCursor: null } },
      });
    }

    return HttpResponse.json({
      success: true,
      data: [],
      meta: { pagination: { type: "cursor", nextCursor: null } },
    });
  }),
  http.get<{ boardId: string }>(predicates.api.boards.one, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: boardFactory.build({ id: params.boardId }),
    });
  }),
];
