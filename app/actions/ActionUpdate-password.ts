"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export default async function ActionUpdatePassword(data: {
  token: string;
  password: string;
}) {
  const { token, password } = data;

  const boutique = await prisma.boutique.findFirst({
    where: { resetToken: token, resetTokenExp: { gte: new Date() } },
  });

  if (!boutique) {
    return { success: false, error: "Token invalide ou expiré" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.boutique.update({
    where: { id: boutique.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
  });

  return { success: true, message: "Mot de passe réinitialisé avec succès" };
}
