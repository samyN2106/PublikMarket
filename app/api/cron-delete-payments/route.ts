import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
export  async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.payment.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // older than 24 hours
        },
      },
    });

    return NextResponse.json({ message: "Payments deleted successfully" });
  } catch (error) {
    console.error("Error deleting payments:", error);
    return NextResponse.json(
      { error: "Failed to delete payments" },
      { status: 500 },
    );
  }
}
