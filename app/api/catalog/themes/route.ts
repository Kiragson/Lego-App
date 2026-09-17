import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        parent: true,
        _count: {
          select: {
            sets: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json(themes);
  } catch (error) {
    console.error("GET /api/catalog/themes error:", error);

    return NextResponse.json(
      { error: "Nie udało się pobrać themes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rebrickableId = Number(body.rebrickableId);

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const parentId =
      typeof body.parentId === "string" && body.parentId.trim()
        ? body.parentId.trim()
        : null;

    if (!Number.isInteger(rebrickableId)) {
      return NextResponse.json(
        { error: "Rebrickable ID musi być liczbą całkowitą." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Nazwa theme jest wymagana." },
        { status: 400 },
      );
    }

    if (parentId) {
      const parentTheme = await prisma.theme.findUnique({
        where: {
          id: parentId,
        },
        select: {
          id: true,
        },
      });

      if (!parentTheme) {
        return NextResponse.json(
          { error: "Wybrany Parent Theme nie istnieje." },
          { status: 400 },
        );
      }
    }

    const existingTheme = await prisma.theme.findUnique({
      where: {
        rebrickableId,
      },
      select: {
        id: true,
      },
    });

    if (existingTheme) {
      return NextResponse.json(
        { error: "Theme o takim Rebrickable ID już istnieje." },
        { status: 409 },
      );
    }

    const theme = await prisma.theme.create({
      data: {
        rebrickableId,
        name,
        parentId,
      },
      include: {
        parent: true,
      },
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    console.error("POST /api/catalog/themes error:", error);

    return NextResponse.json(
      { error: "Nie udało się utworzyć theme." },
      { status: 500 },
    );
  }
}