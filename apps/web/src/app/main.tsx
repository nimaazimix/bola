import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { AuthProvider } from "./providers/auth-provider";

import { ThemeProvider } from "@bola/ui/components/theme-provider";
import { Toaster } from "@bola/ui/components/sonner";
import "@bola/ui/globals.css";

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={getRouter()} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
