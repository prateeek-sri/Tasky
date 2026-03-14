import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) : null;
}
