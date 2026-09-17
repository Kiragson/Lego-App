import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Stockly dashboard API is not available in LEGO App" },
    { status: 410 },
  );
}