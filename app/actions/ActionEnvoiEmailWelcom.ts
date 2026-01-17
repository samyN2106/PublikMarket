"use server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export default async function ActionEnvoiEmail(email: string) {
  const Email = email;

  const boutique = await prisma.boutique.findUnique({
    where: { email: Email },
  });


  if (!boutique) return { success: false, error: "Utilisateur non trouve" };

  //Générer un token sécurisé
  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 3600 * 1000); // 1h

  await prisma.boutique.update({
    where: { email: Email },
    data: { resetToken: token, resetTokenExp: expiration },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    to: Email,
    subject: "Bienvenue sur PublikMarket 🎉",
    html: `  <div style="font-family: Arial, sans-serif; text-align:center; padding:20px; background-color:#f9f9f9;">
      <img src="https://tonsite.com/images/og-default.png" alt="Logo PublikMarket" style="width:120px; margin-bottom:20px;" />
      <h2 style="color:#9e86ba; margin-bottom:10px;">Bienvenue sur PublikMarket !</h2>
      <p style="font-size:16px; color:#333; margin-bottom:20px;">
        Nous sommes ravis de vous compter parmi nous. Découvrez dès maintenant nos produits et profitez de votre espace personnalisé.
      </p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard"
         style="background-color:#9e86ba; color:#fff; font-weight:bold; padding:12px 20px; 
                font-size:17px; border-radius:50px; text-decoration:none; display:inline-block; margin-bottom:20px;">
        Accéder à mon compte
      </a>
      <p style="font-size:14px; color:#777;">
        L’équipe PublikMarket 🚀
      </p>
    </div>`,
  });

  return { success: true, message: "Email envoyé par email" };
}
