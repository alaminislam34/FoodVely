export function getRedirectPathByRole(role?: string | null): string {
  const normalizedRole = String(role ?? "").toUpperCase();

  if (normalizedRole === "ADMIN") return "/admin";
  if (normalizedRole === "PROVIDER" || normalizedRole === "RESTAURANT") {
    return "/provider";
  }

  return "/";
}
