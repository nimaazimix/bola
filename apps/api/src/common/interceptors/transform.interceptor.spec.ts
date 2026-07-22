import { ExecutionContext } from "@nestjs/common";
import { lastValueFrom, of } from "rxjs";
import { TransformInterceptor } from "./transform.interceptor";

describe("TransformInterceptor", () => {
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it("should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  it("should envelope data", async () => {
    // Arrange
    const data = { id: "usr_id" };
    const next = { handle: () => of(data) };

    // Act
    const result = await lastValueFrom(interceptor.intercept({} as ExecutionContext, next));

    // Assert
    expect(result).toEqual({ success: true, data });
  });
});
