import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/catalog/colors
export async function GET() {
  try {
    const colors = await prisma.elementColor.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            elements: true,
          },
        },
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error("GET /api/catalog/colors error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch colors.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/catalog/colors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const rgb =
      typeof body.rgb === "string"
        ? body.rgb.trim()
        : null;

    const hex =
      typeof body.hex === "string"
        ? body.hex.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Color name is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingColor =
      await prisma.elementColor.findUnique({
        where: {
          name,
        },
      });

    if (existingColor) {
      return NextResponse.json(
        {
          error: "A color with this name already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const color =
      await prisma.elementColor.create({
        data: {
          name,
          rgb,
          hex,
        },
      });

    return NextResponse.json(color, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/catalog/colors error:", error);

    return NextResponse.json(
      {
        error: "Failed to create color.",
      },
      {
        status: 500,
      },
    );
  }
}

// PUT /api/catalog/colors/:id
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const rgb =
      typeof body.rgb === "string"
        ? body.rgb.trim()
        : null;

    const hex =
      typeof body.hex === "string"
        ? body.hex.trim()
        : null;

    if (!id) {
      return NextResponse.json(
        {
          error: "Color ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "Color name is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingColor =
      await prisma.elementColor.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

    if (existingColor) {
      return NextResponse.json(
        {
          error: "A color with this name already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const color =
      await prisma.elementColor.update({
        where: {
          id,
        },
        data: {
          name,
          rgb,
          hex,
        },
      });

    return NextResponse.json(color);
  } catch (error) {
    console.error("PUT /api/catalog/colors error:", error);

    return NextResponse.json(
      {
        error: "Failed to update color.",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/catalog/colors
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Color ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const elementCount =
      await prisma.element.count({
        where: {
          colorId: id,
        },
      });

    if (elementCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this color because it is used by elements.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.elementColor.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/catalog/colors error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to delete color.",
      },
      {
        status: 500,
      },
    );
  }
}