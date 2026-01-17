"use server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
export async function ActionAddProduit(data: {
  nomProduit: string;
  description: string;
  prixProduit: string;
  numeroAcontacter: string;
  pointDeLivraison: string;
  image: string;
}) {
  try {
    const setCookies = await cookies();
    const session = setCookies.get("myapp_session")?.value;
    const boutiqueId = session || "";

    const payment = await prisma.payment.findFirst({
      where: {
        boutique: {
          id: parseInt(boutiqueId),
        },
      },
    });

    if (!payment) {
      return {
        success: false,
        message: "Vous n'avez pas d'abonnement",
      };
    }

    const nbrProduitRestant = payment.nbrProduits;

    if (nbrProduitRestant > 0) {
      await prisma.product.create({
        data: {
          boutiqueId: parseInt(boutiqueId),
          nomProduit: data.nomProduit,
          description: data.description,
          price: data.prixProduit,
          numAContacter: data.numeroAcontacter,
          pointLivraison: data.pointDeLivraison,
          image: data.image,
        },
      });

      await prisma.payment.update({
        where: {
          boutiqueId: parseInt(boutiqueId),
        },
        data: {
          nbrProduits: {
            decrement: 1,
          },
        },
      });

      return {
        success: true,
        message: "Produit ajoute avec succes",
      };
    } else if (nbrProduitRestant === 0) {
      await prisma.payment.delete({
        where: {
          boutiqueId: parseInt(boutiqueId),
        },
      });

      return {
        success: false,
        message:
          "Vous avez atteint la limite de produits pour votre abonnement. Veuillez le renouveler.",
      };
    }
  } catch (error) {
    console.error("erreur d'inscription:", error);
    return {
      success: false,
      error: "Erreur du serveur.",
    };
  }
}
