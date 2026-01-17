"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
// import { getProduits } from "@/app/getProduits";

export default async function ModifierProduit(data: {
  id: string;
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit/${data.id}`,
        {
          cache: "no-store",
        }
      );

      const result = await reponse.json();

      const produitUpdate = result.produit;

      if (
        produitUpdate.description === data.description &&
        produitUpdate.image === data.image &&
        produitUpdate.price === data.prixProduit &&
        produitUpdate.nomProduit === data.nomProduit &&
        produitUpdate.numAContacter === data.numeroAcontacter &&
        produitUpdate.pointLivraison === data.pointDeLivraison
      ) {
        return {
          succes: false,
          error: "Vous n'avez rien modifier",
        };
      } else if (
        produitUpdate.description !== data.description &&
        data.description !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            description: data.description,
          },
        });

        return {
          succes: true,
          message: "produit modifie",
        };
      } else if (produitUpdate.image !== data.image && data.image !== "") {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            image: data.image,
          },
        });
        return {
          succes: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.price !== data.prixProduit &&
        data.prixProduit !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            price: data.prixProduit,
          },
        });
        return {
          succes: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.nomProduit !== data.nomProduit &&
        data.nomProduit !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            nomProduit: data.nomProduit,
          },
        });
        return {
          succes: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.numAContacter !== data.numeroAcontacter &&
        data.numeroAcontacter !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            numAContacter: data.numeroAcontacter,
          },
        });
        return {
          succes: true,
          message: "produit modifie",
        };
      } else if (
        produitUpdate.pointLivraison !== data.pointDeLivraison &&
        data.pointDeLivraison !== ""
      ) {
        await prisma.product.update({
          where: {
            id: parseInt(data.id),
          },
          data: {
            pointLivraison: data.pointDeLivraison,
          },
        });
        return {
          succes: true,
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
        succes: false,
        error: "Vous n'avez pas d'abonnement",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      succes: false,
      error: "Erreur sur le serveur,ressayez plutard",
    };
  }
}
