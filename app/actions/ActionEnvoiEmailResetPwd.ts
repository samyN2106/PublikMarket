"use server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export default async function ActionEnvoiEmail(emailDePwdForgot: string) {
  const email = emailDePwdForgot;

  const boutique = await prisma.boutique.findUnique({
    where: { email: email },
  });
  // return { success: true, message: email };

  if (!boutique) return { success: false, error: "Utilisateur non trouve" };

  //Générer un token sécurisé
  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 3600 * 1000); // 1h

  await prisma.boutique.update({
    where: { email: emailDePwdForgot },
    data: { resetToken: token, resetTokenExp: expiration },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    to: emailDePwdForgot,
    subject: "Réinitialisation de votre mot de passe",
    html: `   <div style="font-family: Arial, sans-serif; text-align:center;">
      <h2 style="color:#9e86ba;">PublikMarket</h2>
      <img src="${process.env.NEXT_PUBLIC_BASE_URL}/og-default.png" alt="Logo PublikMarket" style="width:120px; margin:20px auto;" />
      <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}"
         style="background-color:#9e86ba; color:#fff; font-weight:bold; padding:12px 15px; 
                font-size:17px; border-radius:50px; text-decoration:none; display:inline-block;">
        Réinitialiser
      </a>
    </div>`,
  });

  return { success: true, message: "Email envoyé par email" };
}
