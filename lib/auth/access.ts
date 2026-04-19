export type UserAccess = {
  email: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

export function normalizeEmail(email?: string | null) {
  const trimmed = email?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

export function isAdminEmail(email: string | null | undefined, adminEmails: string[]) {
  const normalizedEmail = normalizeEmail(email);
  return normalizedEmail ? adminEmails.includes(normalizedEmail) : false;
}

export function getUserAccess(email: string | null | undefined, adminEmails: string[]): UserAccess {
  const normalizedEmail = normalizeEmail(email);

  return {
    email: normalizedEmail,
    isAdmin: isAdminEmail(normalizedEmail, adminEmails),
    isAuthenticated: Boolean(normalizedEmail),
  };
}

export function assertAdminEmail(email: string | null | undefined, adminEmails: string[]) {
  if (!isAdminEmail(email, adminEmails)) {
    throw new Error("Admin access is required for this action.");
  }
}
