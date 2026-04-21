export type AuthUser = {
  username?: string;
  /** Human-readable name from the API (normalized on login). */
  displayName?: string;
  /** App routing / guard role when the API encodes it as staff or student. */
  role?: "staff" | "student";
  /** Human-readable role from the API; shown in the UI when present. */
  roleDisplay?: string;
};
