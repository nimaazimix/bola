import { render, screen, waitFor } from "#/shared/test/utils";
import { predicates, server } from "#/shared/test/mocks";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "#/shared/stores";
import { AuthProvider } from "./auth-provider";

describe("AuthProvider", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("it should render the loading indicator initially", () => {
    // Arrange
    render(<AuthProvider>children</AuthProvider>);

    // Assert
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should authenticate user and render the children after successful refresh", async () => {
    // Arrange
    render(<AuthProvider>children</AuthProvider>);

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(screen.getByText(/children/i)).toBeInTheDocument();
  });

  it("should unauthenticate user and render the children when refresh fails", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.auth.refresh, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    render(<AuthProvider>children</AuthProvider>);

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
    expect(screen.getByText(/children/i)).toBeInTheDocument();
  });
});
