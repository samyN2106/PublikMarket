"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
// import { getProduits } from "@/app/getProduits";

export default async function ModifierProduit({
  idProduit,
  nomProduit,
  description,
  prixProduit,
  numeroAcontacter,
  pointDeLivraison,
  image,
}: {
  idProduit: string;
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
        succes: false,
        error: "Vous n'avez pas d'abonnement",
      };
    }

    const nbrProduitRestant = payment.nbrProduits;

    if (nbrProduitRestant > 0) {
      const reponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit?idProduit=${idProduit}`,
        {
          cache: "no-store",
        },
      );

      const result = await reponse.json();

      const produitUpdate = result.produit;

      if (
        produitUpdate.description === description &&
        produitUpdate.image === image &&
        produitUpdate.price === prixProduit &&
        produitUpdate.nomProduit === nomProduit &&
        produitUpdate.numAContacter === numeroAcontacter &&
        produitUpdate.pointLivraison === pointDeLivraison
      ) {
        return {
          success: false,
          error: "Vous n'avez rien modifier",
        };
      } else if (
        produitUpdate.description !== description &&
        description !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            description: description,
          },
        });

        return {
          success: true,
          message: "produit modifie",
        };
      } else if (produitUpdate.image !== image && image !== "") {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            image: image,
          },
        });
        return {
          success: true,
          message: "produit modifie",
        };
      } else if (produitUpdate.price !== prixProduit && prixProduit !== "") {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            price: prixProduit,
          },
        });
        return {
          success: true,
          message: "produit modifie",
        };
      } else if (produitUpdate.nomProduit !== nomProduit && nomProduit !== "") {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            nomProduit: nomProduit,
          },
        });
        return {
          success: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.numAContacter !== numeroAcontacter &&
        numeroAcontacter !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            numAContacter: numeroAcontacter,
          },
        });
        return {
          success: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.pointLivraison !== pointDeLivraison &&
        pointDeLivraison !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(idProduit),
          },
          data: {
            pointLivraison: pointDeLivraison,
          },
        });
        return {
          success: true,
          message: "produit modifie",
        };
      }
    } else if (nbrProduitRestant === 0) {
      await prisma.payment.delete({
        where: {
          boutiqueId: parseInt(boutiqueId),
        },
      });

      return {
        success: false,
        error: "Vous n'avez pas d'abonnement",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Erreur sur le serveur,ressayez plutard",
    };
  }
}
