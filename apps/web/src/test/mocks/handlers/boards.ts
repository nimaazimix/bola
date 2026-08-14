import { http, HttpResponse } from "msw";
import { predicates } from "../predicates";
import { boardFactory } from "#/test/factories";

export const boardsHandlers = [
  http.post(predicates.api.boards.all, () => {
    return HttpResponse.json({
      success: true,
      data: boardFactory.build(),
    });
  }),
  http.get(predicates.api.boards.all, () => {
    return HttpResponse.json({
      success: true,
      data: boardFactory.buildList(3),
    });
  }),
  http.get<{ boardId: string }>(predicates.api.boards.one, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: boardFactory.build({ id: params.boardId }),
    });
  }),
];
