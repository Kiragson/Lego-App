import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const color = await prisma.elementColor.findUnique({
      where: { id },
    });

    if (!color) {
      return NextResponse.json(
        { error: "Color not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(color);
  } catch (error) {
    console.error("Get color error:", error);

    return NextResponse.json(
      { error: "Failed to load color." },
      { status: 500 },
    );
  }
}