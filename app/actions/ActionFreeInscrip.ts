"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function ActionFreeInscrip(data: {
  email: string;
  password: string;
  boutique: string;
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
    if (!data.email || !data.password || !data.boutique) {
      return {
        success: false,
        error: "Tous les champs sont obligatoires.",
      };
    }
    // // verifier la validite de l'email
    const email = data.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Email invalide.",
      };
    }
    // // verifier la validite du mot de passe
    const PwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!PwdRegex.test(data.password)) {
      return {
        success: false,
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      };
    }
    // // verifier si l'email existe deja
    const existingBoutique = await prisma.boutique.findUnique({
      where: { email },
    });
    if (existingBoutique) {
      return {
        success: false,
        error: "Cet email est deja utilise.",
      };
    }
    // hashage du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // creation de la data d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);

    //  create l'utilisateur dans la base de donnees
    const Boutique = await prisma.boutique.create({
      data: {
        name: data.boutique,
        email: email,
        password: hashedPassword,
      },
    });

    //  create le paiement de l'utilisateur avec le plan free
    await prisma.payment.create({
      data: {
        boutiqueId: Boutique.id,
        plan: "free",
        nbrProduits: 6,
        montant: 0,
        paymentMethod: "free",
        paymentStatus: "completed",
        expiresAt: expiresAt,
      },
    });
    return {
      success: true,
      boutiqueId: Boutique.id,
      email: email,
    };
  } catch (error) {
    console.error("erreur d'inscription:", error);
    return {
      success: false,
      error: "Erreur du serveur.",
    };
  }
}
