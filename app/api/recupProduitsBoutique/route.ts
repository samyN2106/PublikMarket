import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const IdBoutiqueVendeur = searchParams.get("IdBoutiqueVendeur") as string;

  try {
    const produits = await prisma.product.findMany({
      where: {
        boutiqueId: parseInt(IdBoutiqueVendeur),
      },

      include: {
        boutique: {
          select: { name: true }, // récupère uniquement le nom
        },
      },

      orderBy: { createdAt: "desc" },
    });

    if (!produits) {
      return NextResponse.json(
        { message: "Aucun produit trouvé pour cette boutique." },
        { status: 404 }
      );
    }

    return NextResponse.json({ produits: produits }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
