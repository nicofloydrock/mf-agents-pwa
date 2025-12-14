// Contexto de autenticación/roles dummy, similar a providers tipo Auth0/MSAL.
export type AuthContext = {
  provider: string;
  tokenType: string;
  accessToken: string;
  idToken: string;
  expiresAt: string;
  roles: string[];
  permissions: Record<string, string[]>;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  organizations: { id: string; name: string }[];
  metadata: {
    tenant: string;
    scopes: string[];
    audience: string;
  };
};
