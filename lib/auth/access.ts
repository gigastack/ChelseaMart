export type ProfileRole = "admin" | "customer";

export type UserAccess = {
  email: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  role: ProfileRole | null;
};

export function normalizeEmail(email?: string | null) {
  const trimmed = email?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

export function parseProfileRole(value?: string | null): ProfileRole | null {
  if (value === "admin" || value === "customer") {
    return value;
  }

  return null;
}

export function isAdminRole(role: ProfileRole | null | undefined) {
  return role === "admin";
}

export function getUserAccess(email: string | null | undefined, role: ProfileRole | null | undefined): UserAccess {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = parseProfileRole(role);

  return {
    email: normalizedEmail,
    isAdmin: isAdminRole(normalizedRole),
    isAuthenticated: Boolean(normalizedEmail),
    role: normalizedRole,
  };
}

export function assertAdminRole(role: ProfileRole | null | undefined) {
  if (!isAdminRole(role)) {
    throw new Error("Admin access is required for this action.");
  }
}
