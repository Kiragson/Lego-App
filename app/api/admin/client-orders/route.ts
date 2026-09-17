import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Client orders are not available in LEGO App" },
    { status: 410 },
  );
}