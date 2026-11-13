import { getCookie, createError, H3Event } from "h3";
import { Role, AppUser } from "../../auth/auth-context";

export function getSession(event: H3Event): AppUser | null {
  const session = getCookie(event, "urbansense_session");
  if (!session) return null;
  try {
    return JSON.parse(decodeURIComponent(session));
  } catch (e) {
    return null;
  }
}

export function requireUser(event: H3Event): AppUser {
  const user = getSession(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Session missing or invalid",
    });
  }
  return user;
}

export function requireRole(event: H3Event, allowedRoles: Role[]): AppUser {
  const user = requireUser(event);
  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden: Access denied for role ${user.role}`,
    });
  }
  return user;
}
