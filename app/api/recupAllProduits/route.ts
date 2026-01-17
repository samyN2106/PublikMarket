import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const produits = await prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    const total = await prisma.product.count();
    return Response.json(
      { produits, totalPages: Math.ceil(total / limit) },
      { status: 200 }
    );
  } catch (error) {
    console.log("error:", error);
    return Response.json({ error: error }, { status: 500 });
  }
}
