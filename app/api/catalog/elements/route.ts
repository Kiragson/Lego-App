import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const elements = await prisma.element.findMany({
      include: {
        category: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(elements);
  } catch (error) {
    console.error("GET /api/catalog/elements error:", error);

    return NextResponse.json(
      { error: "Failed to fetch elements." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      elementNumber,
      partNumber,
      name,
      categoryId,
      colorId,
      imageUrl,
      description,
    } = body;

    const trimmedElementNumber =
      typeof elementNumber === "string"
        ? elementNumber.trim()
        : "";

    const trimmedPartNumber =
      typeof partNumber === "string"
        ? partNumber.trim()
        : "";

    const trimmedName =
      typeof name === "string"
        ? name.trim()
        : "";

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Element name is required." },
        { status: 400 },
      );
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Selected category does not exist." },
          { status: 404 },
        );
      }
    }

    if (colorId) {
      const color = await prisma.elementColor.findUnique({
        where: {
          id: colorId,
        },
      });

      if (!color) {
        return NextResponse.json(
          { error: "Selected color does not exist." },
          { status: 404 },
        );
      }
    }

    if (trimmedElementNumber) {
      const existingElement =
        await prisma.element.findUnique({
          where: {
            elementNumber: trimmedElementNumber,
          },
        });

      if (existingElement) {
        return NextResponse.json(
          {
            error:
              "An element with this element number already exists.",
          },
          { status: 409 },
        );
      }
    }

    const element = await prisma.element.create({
      data: {
        elementNumber:
          trimmedElementNumber || null,
        partNumber:
          trimmedPartNumber || null,
        name: trimmedName,
        categoryId: categoryId || null,
        colorId: colorId || null,
        imageUrl:
          typeof imageUrl === "string" && imageUrl.trim()
            ? imageUrl.trim()
            : null,
        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,
      },
      include: {
        category: true,
        color: true,
      },
    });

    return NextResponse.json(element, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/catalog/elements error:",
      error,
    );

    return NextResponse.json(
      { error: "Failed to create element." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      elementNumber,
      partNumber,
      name,
      elementType,
      categoryId,
      colorId,
      imageUrl,
      description,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Element ID is required." },
        { status: 400 },
      );
    }

    const existingElement =
      await prisma.element.findUnique({
        where: {
          id,
        },
      });

    if (!existingElement) {
      return NextResponse.json(
        { error: "Element not found." },
        { status: 404 },
      );
    }

    const trimmedElementNumber =
      typeof elementNumber === "string"
        ? elementNumber.trim()
        : "";

    const trimmedPartNumber =
      typeof partNumber === "string"
        ? partNumber.trim()
        : "";

    const trimmedName =
      typeof name === "string"
        ? name.trim()
        : "";

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Element name is required." },
        { status: 400 },
      );
    }

    const validElementTypes = [
      "PART",
      "MINIFIG",
      "BOOK",
      "STICKER",
      "BOX",
      "OTHER",
    ];

    if (!validElementTypes.includes(elementType)) {
      return NextResponse.json(
        { error: "Invalid element type." },
        { status: 400 },
      );
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Selected category does not exist." },
          { status: 404 },
        );
      }
    }

    if (colorId) {
      const color = await prisma.elementColor.findUnique({
        where: {
          id: colorId,
        },
      });

      if (!color) {
        return NextResponse.json(
          { error: "Selected color does not exist." },
          { status: 404 },
        );
      }
    }

    if (trimmedElementNumber) {
      const duplicate =
        await prisma.element.findFirst({
          where: {
            elementNumber: trimmedElementNumber,
            NOT: {
              id,
            },
          },
        });

      if (duplicate) {
        return NextResponse.json(
          {
            error:
              "An element with this element number already exists.",
          },
          { status: 409 },
        );
      }
    }

    const element = await prisma.element.update({
      where: {
        id,
      },
      data: {
        elementNumber:
          trimmedElementNumber || null,
        partNumber:
          trimmedPartNumber || null,
        name: trimmedName,
        elementType,
        categoryId: categoryId || null,
        colorId: colorId || null,
        imageUrl:
          typeof imageUrl === "string" && imageUrl.trim()
            ? imageUrl.trim()
            : null,
        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,
      },
      include: {
        category: true,
        color: true,
      },
    });

    return NextResponse.json(element);
  } catch (error) {
    console.error(
      "PUT /api/catalog/elements error:",
      error,
    );

    return NextResponse.json(
      { error: "Failed to update element." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Element ID is required." },
        { status: 400 },
      );
    }

    const element =
      await prisma.element.findUnique({
        where: {
          id,
        },
        include: {
          setElements: {
            select: {
              id: true,
            },
          },
          collectionElements: {
            select: {
              id: true,
            },
          },
          collectionSetElements: {
            select: {
              id: true,
            },
          },
          storage: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!element) {
      return NextResponse.json(
        { error: "Element not found." },
        { status: 404 },
      );
    }

    if (element.setElements.length > 0) {
      return NextResponse.json(
        {
          error:
            "This element cannot be deleted because it is used in a set composition.",
        },
        { status: 409 },
      );
    }

    if (element.collectionElements.length > 0) {
      return NextResponse.json(
        {
          error:
            "This element cannot be deleted because it is used in a collection.",
        },
        { status: 409 },
      );
    }

    if (element.collectionSetElements.length > 0) {
      return NextResponse.json(
        {
          error:
            "This element cannot be deleted because it is used in a collection set.",
        },
        { status: 409 },
      );
    }

    if (element.storage.length > 0) {
      return NextResponse.json(
        {
          error:
            "This element cannot be deleted because it has storage records.",
        },
        { status: 409 },
      );
    }

    await prisma.element.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/catalog/elements error:",
      error,
    );

    return NextResponse.json(
      { error: "Failed to delete element." },
      { status: 500 },
    );
  }
}