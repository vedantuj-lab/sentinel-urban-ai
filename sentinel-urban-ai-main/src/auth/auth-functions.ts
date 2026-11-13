import { DEMO_ACCOUNTS } from "@/data/demoAccounts";

export async function loginFn(opts: { data: { email: string; password: string } }) {
  const { email } = opts.data;
  const cleanEmail = email.trim().toLowerCase();

  // Find demo account by email, or default to analyst if not found
  const demoMatch =
    DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail) || DEMO_ACCOUNTS[1]; // default to analyst

  if (typeof window !== "undefined") {
    document.cookie = `urbansense_session=${encodeURIComponent(JSON.stringify(demoMatch.user))}; path=/; max-age=${60 * 60 * 24 * 7}`;
    window.localStorage.setItem("urbansense.session", JSON.stringify(demoMatch.user));
  }
  return { user: demoMatch.user };
}

export async function logoutFn() {
  if (typeof window !== "undefined") {
    document.cookie = "urbansense_session=; path=/; max-age=0";
    window.localStorage.removeItem("urbansense.session");
  }
  return { success: true };
}

export async function getMeFn() {
  if (typeof window === "undefined") {
    return { user: null };
  }
  const raw = window.localStorage.getItem("urbansense.session");
  if (raw) {
    try {
      return { user: JSON.parse(raw) };
    } catch {
      // Ignore invalid JSON in session storage
    }
  }
  const cookies = document.cookie ? document.cookie.split(";").map((c) => c.trim()) : [];
  const sessionCookie = cookies.find((c) => c.startsWith("urbansense_session="));
  if (!sessionCookie) return { user: DEMO_ACCOUNTS[1].user }; // Default preview user

  const session = decodeURIComponent(sessionCookie.split("=")[1]);
  try {
    const user = JSON.parse(session);
    return { user };
  } catch (e) {
    return { user: DEMO_ACCOUNTS[1].user };
  }
}
