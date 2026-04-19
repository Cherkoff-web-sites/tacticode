const DEFAULT_SUPER_ADMIN_EMAIL = "danilcherkov44@gmail.com";

export function getSuperAdminEmails() {
  const rawEmails = String(import.meta.env.VITE_SUPER_ADMIN_EMAILS || "").trim();
  const candidates = rawEmails
    ? rawEmails.split(",")
    : [import.meta.env.VITE_SUPER_ADMIN_EMAIL || DEFAULT_SUPER_ADMIN_EMAIL];

  return new Set(
    candidates
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isSuperAdminEmail(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();
  return normalizedValue ? getSuperAdminEmails().has(normalizedValue) : false;
}
