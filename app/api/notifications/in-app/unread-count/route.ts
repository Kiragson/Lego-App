import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Notification counts are not available in LEGO App" },
    { status: 410 },
  );
}