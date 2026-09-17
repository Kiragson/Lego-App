import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const sets = await prisma.set.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        theme: true,
      },
    });

    return NextResponse.json(sets);
  } catch (error) {
    console.error("GET /api/catalog/sets error:", error);

    return NextResponse.json(
      { error: "Nie udało się pobrać zestawów." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rebrickableSetNum =
      typeof body.rebrickableSetNum === "string"
        ? body.rebrickableSetNum.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const year = Number(body.year);

    const numParts =
      body.numParts === null ||
      body.numParts === undefined ||
      body.numParts === ""
        ? null
        : Number(body.numParts);

    const themeId =
      typeof body.themeId === "string" && body.themeId.trim()
        ? body.themeId.trim()
        : null;

    if (!rebrickableSetNum) {
      return NextResponse.json(
        { error: "Numer zestawu jest wymagany." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Nazwa zestawu jest wymagana." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        { error: "Rok musi być liczbą całkowitą." },
        { status: 400 },
      );
    }

    if (numParts !== null && !Number.isInteger(numParts)) {
      return NextResponse.json(
        { error: "Liczba części musi być liczbą całkowitą." },
        { status: 400 },
      );
    }

    const existingSet = await prisma.set.findUnique({
      where: {
        rebrickableSetNum,
      },
      select: {
        id: true,
      },
    });

    if (existingSet) {
      return NextResponse.json(
        { error: "Zestaw o takim numerze już istnieje." },
        { status: 409 },
      );
    }

    const set = await prisma.set.create({
      data: {
        rebrickableSetNum,
        name,
        year,
        numParts,
        themeId,
      },
      include: {
        theme: true,
      },
    });

    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    console.error("POST /api/catalog/sets error:", error);

    return NextResponse.json(
      { error: "Nie udało się utworzyć zestawu." },
      { status: 500 },
    );
  }
}