import { AllTheProviders, renderHook, waitFor } from "#/test/utils";
import { AuthRoutes, server } from "#/test/mocks";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "#/shared/stores";
import { useEmailVerification } from "./use-email-verification";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("useEmailVerification", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should authenticate user and navigate to provided redirect route", async () => {
    // Arrange
    renderHook(() => useEmailVerification({ token: "vrf-token", redirect: "/app/settings" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith(expect.objectContaining({ to: "/app/settings" }));
    });
  });

  it("should authenticate user and navigate to /app when redirect route is not provided", async () => {
    // Arrange
    renderHook(() => useEmailVerification({ token: "vrf-token" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith(expect.objectContaining({ to: "/app" }));
    });
  });

  it("should navigate to /auth/signin and set redirect route when verification fails", async () => {
    // Arrange
    server.use(
      http.post(AuthRoutes.VERIFY_EMAIL, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    renderHook(() => useEmailVerification({ token: "vrf-token", redirect: "/app/settings" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "/auth/signin",
          search: { redirect: "/app/settings" },
        }),
      );
    });
  });

  it("should navigate to /auth/signin and set redirect route when token is not provided", async () => {
    // Arrange
    renderHook(() => useEmailVerification({ redirect: "/app/settings" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/auth/signin",
        search: { redirect: "/app/settings" },
      }),
    );
  });
});
