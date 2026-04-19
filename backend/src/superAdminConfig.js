function normalizeSuperAdminIdentity(value) {
  return String(value || "").trim().toLowerCase();
}

export function getConfiguredSuperAdminEmails() {
  const rawEmails = String(process.env.SUPER_ADMIN_EMAILS || "").trim();
  const singleEmail = String(process.env.SUPER_ADMIN_EMAIL || "").trim();
  const candidates = [
    ...(rawEmails ? rawEmails.split(",") : []),
    ...(singleEmail ? [singleEmail] : []),
  ];

  return [...new Set(
    candidates
      .map(normalizeSuperAdminIdentity)
      .filter(Boolean)
  )];
}

export function hasConfiguredSuperAdminEmails() {
  return getConfiguredSuperAdminEmails().length > 0;
}

export function isConfiguredSuperAdminIdentity(value) {
  const normalizedValue = normalizeSuperAdminIdentity(value);
  return normalizedValue ? getConfiguredSuperAdminEmails().includes(normalizedValue) : false;
}

export function isConfiguredSuperAdminUser(user) {
  if (!user) return false;
  return [user.email, user.login].some(isConfiguredSuperAdminIdentity);
}
