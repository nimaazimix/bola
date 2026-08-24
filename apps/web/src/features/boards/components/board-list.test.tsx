import { predicates, server } from "#/testing/mocks";
import { render, screen, userEvent } from "#/testing/utils";
import { http, HttpResponse } from "msw";
import { BoardList } from "./board-list";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
  Link: ({ children }: React.PropsWithChildren) => <a>{children}</a>,
}));

vi.mock("#/shared/hooks/use-workspace-slug", () => ({
  useWorkspaceSlug: vi.fn().mockReturnValue("acme-inc"),
}));

describe("BoardList", () => {
  it("should render skeletons while query is pending", async () => {
    // Arrange
    render(<BoardList onClear={vi.fn()} />);

    // Assert
    expect(screen.getAllByTestId("board-card-skeleton")).toHaveLength(8);
  });

  it("should render the first page of boards", async () => {
    // Arrange
    render(<BoardList onClear={vi.fn()} />);

    // Assert
    expect(await screen.findAllByText(/board \d/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument();
  });

  it("should load the next page of boards", async () => {
    // Arrange
    render(<BoardList onClear={vi.fn()} />);
    const user = userEvent.setup();

    // Act
    await user.click(await screen.findByRole("button", { name: /load more/i }));

    // Assert
    expect(await screen.findAllByText(/board \d/i)).toHaveLength(3);
  });

  it("should render an error state when the query fails", async () => {
    // Arrange
    server.use(
      http.get(predicates.api.boards.all, () => {
        return HttpResponse.error();
      }),
    );

    render(<BoardList onClear={vi.fn()} />);

    // Assert
    expect(await screen.findByText(/unable to connect to the server/i)).toBeInTheDocument();
  });

  it("should render no boards yet when the workspace has no boards yet", async () => {
    // Arrange
    server.use(
      http.get(predicates.api.boards.all, () => {
        return HttpResponse.json({
          success: true,
          data: [],
          meta: { pagination: { type: "cursor", nextCursor: null } },
        });
      }),
    );

    render(<BoardList onClear={vi.fn()} />);

    // Assert
    expect(await screen.findByText(/no boards yet/i)).toBeInTheDocument();
  });

  it("should render no boards found when the search has no result", async () => {
    server.use(
      http.get(predicates.api.boards.all, () => {
        return HttpResponse.json({
          success: true,
          data: [],
          meta: { pagination: { type: "cursor", nextCursor: null } },
        });
      }),
    );

    render(<BoardList onClear={vi.fn()} q="Product" />);

    // Assert
    expect(await screen.findByText(/no boards found/i)).toBeInTheDocument();
  });
});
