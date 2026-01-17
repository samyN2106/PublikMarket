import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idProduit = searchParams.get("idProduit") as string;

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
