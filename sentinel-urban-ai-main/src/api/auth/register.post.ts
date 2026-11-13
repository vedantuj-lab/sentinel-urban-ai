import { defineEventHandler, readBody, createError, setCookie } from "h3";
import bcrypt from "bcryptjs";
import { UserRepository } from "../../backend/repositories/UserRepository";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) || {};
  const { name, email, role, zoneId, password } = body as Record<string, string>;

  if (!name || !email || !role || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already registered",
    });
  }

  const newUser = await UserRepository.create({
    id: `U-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: role as any,
    zoneId: zoneId || "Z-01",
    passwordHash: await bcrypt.hash(password, 10),
  });

  const sessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    zoneId: newUser.zoneId,
  };

  setCookie(event, "urbansense_session", JSON.stringify(sessionUser), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { user: sessionUser };
});
