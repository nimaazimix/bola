import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { setupInterceptors } from "./interceptors";
import { useAuthStore } from "../stores/auth.store";
import { ApiError } from "./errors";
import { userFactory } from "#/test/factories";

describe("API interceptors", () => {
  let api: AxiosInstance;
  let refresh: AxiosInstance;

  let apiMock: MockAdapter;
  let refreshMock: MockAdapter;

  beforeAll(() => {
    api = axios.create();
    refresh = axios.create({ withCredentials: true });

    setupInterceptors(api, refresh);

    apiMock = new MockAdapter(api);
    refreshMock = new MockAdapter(refresh);
  });

  afterEach(() => {
    apiMock.reset();
    refreshMock.reset();
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  describe("auth", () => {
    it("should attach authorization header with bearer access token", async () => {
      // Arrange
      useAuthStore.setState({ accessToken: "access-token" });

      let capturedConfig!: AxiosRequestConfig;
      apiMock.onGet("/data").reply((config) => {
        capturedConfig = config;
        return [200, { success: true }];
      });

      // Act
      await api.get("/data");

      // Assert
      expect(capturedConfig.headers!["Authorization"]).toBe("Bearer access-token");
    });

    it("should not attach authorization header when access token does not exist", async () => {
      // Arrange
      let capturedConfig!: AxiosRequestConfig;
      apiMock.onGet("/data").reply((config) => {
        capturedConfig = config;
        return [200, { success: true }];
      });

      // Act
      await api.get("/data");

      // Assert
      expect(capturedConfig.headers!["Authorization"]).toBeUndefined();
    });
  });

  describe("refresh", () => {
    beforeEach(() => {
      useAuthStore.setState({ accessToken: "expired-access-token" });

      // Default refresh response
      refreshMock.onPost("/auth/refresh").reply(200, {
        success: true,
        data: { accessToken: "access-token", user: userFactory.build() },
      });
    });

    it("should refresh access token on 401 expired and retry the request", async () => {
      // Arrange
      apiMock
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .reply(200, { success: true });

      // Act
      const res = await api.get("/data");

      // Assert
      expect(res.status).toBe(200);
      expect(useAuthStore.getState().accessToken).toBe("access-token");
    });

    it("should reject the request when it is already retried", async () => {
      // Arrange
      apiMock
        .onGet("/data")
        .reply(401, { success: false, error: { code: "auth.access_token_expired" } });

      // Act, Assert
      await expect(api.get("/data")).rejects.toBeInstanceOf(ApiError);
      expect(useAuthStore.getState().accessToken).toBe("access-token");
    });

    it("should reject the request when it is failed with unrelated code", async () => {
      // Arrange
      apiMock.onGet("/data").reply(401, { success: false, error: { code: "auth.unknown_error" } });

      // Act, Assert
      await expect(api.get("/data")).rejects.toBeInstanceOf(ApiError);
      expect(useAuthStore.getState().accessToken).toBe("expired-access-token");
    });

    it("should clear access token and reject the request when refresh fails", async () => {
      // Arrange
      refreshMock.onPost("/auth/refresh").reply(401, {
        success: false,
        error: { code: "auth.session_invalid", message: "Session is missing or invalid" },
      });

      apiMock
        .onGet("/data")
        .reply(401, { success: false, error: { code: "auth.access_token_expired" } });

      // Act, Assert
      await expect(api.get("/data")).rejects.toBeInstanceOf(ApiError);
      expect(useAuthStore.getState().accessToken).toBeNull();
    });

    it("should resolve concurrent requests with one refresh", async () => {
      // Arrange
      let resolveRefresh!: () => void;
      const refreshPromise = new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      });

      refreshMock.onPost("/auth/refresh").reply(async () => {
        await refreshPromise;
        return [
          200,
          {
            success: true,
            data: { accessToken: "access-token", user: userFactory.build() },
          },
        ];
      });

      apiMock
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .reply(200, { success: true });

      // Act
      const req1 = api.get("/data");
      const req2 = api.get("/data");
      const req3 = api.get("/data");

      resolveRefresh();

      const [res1, res2, res3] = await Promise.all([req1, req2, req3]);

      // Assert
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res3.status).toBe(200);
      expect(refreshMock.history.post.length).toBe(1);
    });

    it("should reject concurrent requests when refresh fails", async () => {
      // Arrange
      let resolveRefresh!: () => void;
      const refreshPromise = new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      });

      refreshMock.onPost("/auth/refresh").reply(async () => {
        await refreshPromise;
        return [
          401,
          {
            success: false,
            error: { code: "auth.session_invalid", message: "Session is missing or invalid" },
          },
        ];
      });

      apiMock
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .replyOnce(401, { success: false, error: { code: "auth.access_token_expired" } })
        .onGet("/data")
        .reply(200, { success: true });

      // Act, Assert
      const req1 = api.get("/data");
      const req2 = api.get("/data");
      const req3 = api.get("/data");

      resolveRefresh();

      await expect(Promise.all([req1, req2, req3])).rejects.toBeInstanceOf(ApiError);
      expect(refreshMock.history.post.length).toBe(1);
    });
  });
});
