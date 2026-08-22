const API_URL = import.meta.env.VITE_API_URL;

export const predicates = {
  api: {
    auth: {
      signUp: `${API_URL}/auth/sign-up`,
      verifyEmail: `${API_URL}/auth/verify-email`,
      signIn: `${API_URL}/auth/sign-in`,
      refresh: `${API_URL}/auth/refresh`,
      signOut: `${API_URL}/auth/sign-out`,
    },
    workspaces: {
      all: `${API_URL}/workspaces`,
      checkSlug: `${API_URL}/workspaces/check-slug`,
      one: `${API_URL}/workspaces/:slug`,
    },
    boards: {
      all: `${API_URL}/workspaces/:workspaceSlug/boards`,
      one: `${API_URL}/workspaces/:workspaceSlug/boards/:boardId`,
    },
  },
};
