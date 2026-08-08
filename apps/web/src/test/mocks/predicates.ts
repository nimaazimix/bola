const API_URL = import.meta.env.VITE_API_URL;

export const predicates = {
  api: {
    auth: {
      signUp: `${API_URL}/auth/signup`,
      verifyEmail: `${API_URL}/auth/verify-email`,
      signIn: `${API_URL}/auth/signin`,
      refresh: `${API_URL}/auth/refresh`,
      signOut: `${API_URL}/auth/signout`,
    },
    workspaces: {
      all: `${API_URL}/workspaces`,
      checkSlug: `${API_URL}/workspaces/check-slug`,
      one: `${API_URL}/workspaces/:slug`,
    },
  },
};
