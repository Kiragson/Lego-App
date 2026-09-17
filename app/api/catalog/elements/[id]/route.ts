import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const element = await prisma.element.findUnique({
      where: {
        id,
      },
      include: {
        part: true,
        color: true,
      },
    });

    if (!element) {
      return NextResponse.json(
        { error: "Element not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(element);
  } catch (error) {
    console.error("GET /api/catalog/elements/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch element." },
      { status: 500 },
    );
  }
}