/**
 * Login API Route Handler
 * PostgreSQL / Prisma authentication
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken, sessionCookieOptions } from "@/utils/auth";
import { loginSchema } from "@/lib/validations";
import { createCorsHeaders, handleCorsPreflight } from "@/lib/api/cors";
import { logger } from "@/lib/logger";
import { prisma } from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const responseHeaders = createCorsHeaders(request);

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers: responseHeaders },
      );
    }

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn("Invalid login data", {
        errors: validationResult.error.errors,
      });

      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.errors,
        },
        { status: 400, headers: responseHeaders },
      );
    }

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: responseHeaders },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: responseHeaders },
      );
    }

    const token = generateToken(user.id);

    if (!token) {
      return NextResponse.json(
        { error: "Failed to generate session token" },
        { status: 500, headers: responseHeaders },
      );
    }

    const isSecure =
      request.headers.get("x-forwarded-proto") === "https" ||
      process.env.NODE_ENV !== "development";

    const response = NextResponse.json(
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        sessionId: token,
      },
      {
        status: 200,
        headers: responseHeaders,
      },
    );

    response.cookies.set(
      "session_id",
      token,
      sessionCookieOptions(isSecure),
    );

    return response;
  } catch (error) {
    logger.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}