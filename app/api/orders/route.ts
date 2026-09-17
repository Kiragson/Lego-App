import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Orders API is not available in LEGO App" },
    { status: 410 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Orders API is not available in LEGO App" },
    { status: 410 },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Orders API is not available in LEGO App" },
    { status: 410 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Orders API is not available in LEGO App" },
    { status: 410 },
  );
}