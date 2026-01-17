import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { IdBoutiqueVendeur: string } }
) {
  const { IdBoutiqueVendeur } = await params;

  try {
    const produit = await prisma.product.findFirst({
      where: {
        boutiqueId: parseInt(IdBoutiqueVendeur),
      },
      include: {
        boutique: {
          select: { name: true }, // récupère uniquement le nom
        },
      },
    });

    if (!produit) {
      return NextResponse.json(
        { message: "Aucun produit trouvé pour cette boutique." },
        { status: 404 }
      );
    }

    return NextResponse.json({ produit: produit }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
