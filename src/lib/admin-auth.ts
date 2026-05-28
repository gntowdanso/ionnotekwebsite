import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ionnotek-admin-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getAdminUsername() {
  return process.env.CMS_ADMIN_USERNAME ?? "admin";
}

function getAdminPassword() {
  return process.env.CMS_ADMIN_PASSWORD ?? "ChangeMe123!";
}

function getSessionSecret() {
  return new TextEncoder().encode(
    process.env.CMS_SESSION_SECRET ?? "change-this-session-secret-before-production",
  );
}

export function areAdminCredentialsValid(username: string, password: string) {
  return username === getAdminUsername() && password === getAdminPassword();
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSessionSecret());
    const username = verified.payload.username;

    if (typeof username !== "string" || username !== getAdminUsername()) {
      return null;
    }

    return {
      username,
      role: verified.payload.role,
    };
  } catch {
    return null;
  }
}