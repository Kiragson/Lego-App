import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const sets = await prisma.set.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sets);
  } catch (error) {
    console.error("Error fetching LEGO sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch LEGO sets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {

    const body = await request.json();

    const setNumber =
      typeof body.setNumber === "string"
        ? body.setNumber.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const type =
      typeof body.type === "string"
        ? body.type
        : "STANDARD";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const imageUrl =
      typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Set name is required" },
        { status: 400 },
      );
    }

    if (!["STANDARD", "MINIFIG", "MOC"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid set type" },
        { status: 400 },
      );
    }

    const set = await prisma.set.create({
      data: {
        setNumber: setNumber || null,
        name,
        type,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    console.error("Error creating LEGO set:", error);

    return NextResponse.json(
      { error: "Failed to create LEGO set" },
      { status: 500 },
    );
  }
}