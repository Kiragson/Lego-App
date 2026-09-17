import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
  include: {
    _count: {
      select: {
        elements: true,
      },
    },
  },
  orderBy: {
    name: "asc",
  },
});

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/catalog/category error:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 },
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);

    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "").trim();
    const name = String(body.name ?? "").trim();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and category name are required." },
        { status: 400 },
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 409 },
      );
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);

    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        elements: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 },
      );
    }

    if (category.elements.length > 0) {
      return NextResponse.json(
        {
          error:
            "This category cannot be deleted because it is assigned to elements.",
        },
        { status: 409 },
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);

    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 },
    );
  }
}