export const getSiteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return "http://localhost:3000";
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};
