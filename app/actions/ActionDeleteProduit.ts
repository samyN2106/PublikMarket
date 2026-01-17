"use server";
import { prisma } from "@/lib/prisma";
export default async function deleteProduit(data: { idProduit: string }) {
  const { idProduit } = data;

  await prisma.product.delete({
    where: { id: parseInt(idProduit) },
  });

  return;
}
