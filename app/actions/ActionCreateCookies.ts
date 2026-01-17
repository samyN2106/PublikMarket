"use server";
import { cookies } from "next/headers";
export async function createCookie(data: {
  NomCookies: string;
  CookiesValue: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: data.NomCookies,
    value: String(data.CookiesValue),
    httpOnly: true,
    path: "/",
    maxAge: 2 * 365 * 24 * 60 * 60, // 2 ans
    secure: true, // toujours true en prod
  });
}
