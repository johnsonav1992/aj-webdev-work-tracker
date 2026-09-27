export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string | null;
  accountId: string;
}
