import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "iykomo_admin_session";

function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    "iykomo-tech-precision-studio-secret-2026-verified";
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export async function signAdminToken(
  payload: AdminSessionPayload
): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.email || !payload.id) return null;
    return {
      id: Number(payload.id),
      email: String(payload.email),
      fullName: String(payload.fullName || "Administrator"),
      role: String(payload.role || "admin"),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
