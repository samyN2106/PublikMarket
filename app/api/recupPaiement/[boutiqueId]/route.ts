import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { boutiqueId: string } }
) {
  try {
    const { boutiqueId } = await params;

    const paiement = await prisma.payment.findUnique({
      where: { boutiqueId: parseInt(boutiqueId) },
    });

    const totalProduits = await prisma.product.count({
      where: {
        boutiqueId: parseInt(boutiqueId),
      },
    });

    return NextResponse.json(
      { paiement: paiement, totalProduits: totalProduits },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
