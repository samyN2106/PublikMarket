"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function ActionConnexion(data: {
  email: string;
  password: string;
  captchaToken: string;
}) {
  try {
    // verifier le captcha
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: data.captchaToken,
      }),
    });

    const captcha = await res.json();
    if (!captcha.success) {
      return {
        success: false,
        error: "Captcha invalide. recommencez s'il vous plait.",
      };
    }

    // verifier si tous les champs sont remplis
    const boutique = await prisma.boutique.findUnique({
      where: { email: data.email },
    });

    if (!boutique) return { success: false, error: "" };

    const isValid = await bcrypt.compare(data.password, boutique.password);

    if (!isValid) return { success: false, error: "" };

    return { success: true, message: boutique.id };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erreur du serveur, ressayez plus-tard" };
  }
}
