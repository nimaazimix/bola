import { AllTheProviders, renderHook, waitFor } from "#/shared/test/utils";
import { predicates, server } from "#/shared/test/mocks";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "#/shared/stores/auth.store";
import { resolveDestination } from "../lib/resolve-destination";
import { useEmailVerification } from "./use-email-verification";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../lib/resolve-destination", () => ({
  resolveDestination: vi.fn(),
}));

describe("useEmailVerification", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should authenticate user and navigate to the resolved route", async () => {
    // Arrange
    vi.mocked(resolveDestination).mockResolvedValue({ to: "/acme" });
    renderHook(() => useEmailVerification({ token: "vrf-token", redirect: "/acme" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith({ to: "/acme", replace: true });
    });
    expect(resolveDestination).toHaveBeenCalledWith(expect.anything(), "/acme");
  });

  it("should navigate to /signin and set redirect route when verification fails", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.auth.verifyEmail, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    renderHook(() => useEmailVerification({ token: "vrf-token", redirect: "/acme" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/signin",
        search: { redirect: "/acme" },
        replace: true,
      });
    });
  });

  it("should navigate to /signin and set redirect route when token is not provided", async () => {
    // Arrange
    renderHook(() => useEmailVerification({ redirect: "/acme" }), {
      wrapper: AllTheProviders,
    });

    // Assert
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/signin",
      search: { redirect: "/acme" },
      replace: true,
    });
  });
});
