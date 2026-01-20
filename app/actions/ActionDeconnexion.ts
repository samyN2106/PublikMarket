"use server";

import { cookies } from "next/headers";

export async function deleteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("myapp_session");
  return { success: true, reponse: "Déconnexion réussie" };
}
