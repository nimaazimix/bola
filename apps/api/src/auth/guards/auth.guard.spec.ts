import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { mock, MockProxy } from "jest-mock-extended";
import { userFactory } from "test/factories";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "../auth.service";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let authServiceMock: MockProxy<AuthService>;

  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };

  const createExecutionContextMock = (request?: unknown) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  });

  beforeEach(() => {
    authServiceMock = mock<AuthService>();
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    guard = new AuthGuard(reflectorMock as unknown as Reflector, authServiceMock);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should allow access for public endpoints", async () => {
    // Arrange
    reflectorMock.getAllAndOverride.mockReturnValue(true);
    const context = createExecutionContextMock();

    // Act, Assert
    await expect(guard.canActivate(context as unknown as ExecutionContext)).resolves.toBe(true);
    expect(authServiceMock.authenticate).not.toHaveBeenCalled();
  });

  it("should authenticate requests with bearer access token", async () => {
    // Arrange
    const request = { headers: { authorization: "Bearer access-token" }, currentUser: undefined };
    const context = createExecutionContextMock(request);

    const user = userFactory.build({ emailVerified: true });
    authServiceMock.authenticate.mockResolvedValue(user);

    // Act, Assert
    await expect(guard.canActivate(context as unknown as ExecutionContext)).resolves.toBe(true);
    expect(request.currentUser).toEqual(user);
    expect(authServiceMock.authenticate).toHaveBeenCalledWith("access-token");
  });

  it("should reject the request when access token validation fails", async () => {
    // Arrange
    const request = { headers: { authorization: "Bearer invalid-access-token" } };
    const context = createExecutionContextMock(request);
    authServiceMock.authenticate.mockRejectedValue(new Error());

    // Act, Assert
    await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow();
    expect(authServiceMock.authenticate).toHaveBeenCalledWith("invalid-access-token");
  });

  it("should reject the request when authorization header is malformed", async () => {
    // Arrange
    const request = { headers: { authorization: "malformed" } };
    const context = createExecutionContextMock(request);
    authServiceMock.authenticate.mockRejectedValue(new Error());

    // Act, Assert
    await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow();
    expect(authServiceMock.authenticate).toHaveBeenCalledWith(undefined);
  });

  it("should reject the request when authorization header does not exist", async () => {
    // Arrange
    const request = { headers: {} };
    const context = createExecutionContextMock(request);
    authServiceMock.authenticate.mockRejectedValue(new Error());

    // Act, Assert
    await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow();
    expect(authServiceMock.authenticate).toHaveBeenCalledWith(undefined);
  });
});
