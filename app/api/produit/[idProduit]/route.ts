import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { idProduit: string } }
) {
  try {
    const { idProduit } = await params;

    const produit = await prisma.product.findUnique({
      where: { id: parseInt(idProduit) },
      include: {
        boutique: {
          select: { name: true }, // récupère uniquement le nom
        },
      },
    });

    return NextResponse.json({ produit: produit }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
