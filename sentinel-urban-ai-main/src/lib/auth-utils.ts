import { UserRepository } from "@/backend/repositories/UserRepository";

export function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim().split("="));
  const cookie = cookies.find((c) => c[0] === name);
  return cookie ? cookie[1] : null;
}

export async function getUser(request: Request) {
  const userId = getCookie(request, "urbansense_session");
  if (!userId) return null;
  return await UserRepository.findById(userId);
}

export async function requireAuth(request: Request) {
  const user = await getUser(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
