/**
 * Register API Route Handler
 * PostgreSQL / Prisma registration
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { scheduleInvalidateAuthCaches } from "@/lib/cache";
import { prisma } from "@/prisma/client";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn("Invalid registration data", {
        errors: validationResult.error.errors,
      });

      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "A user with this email already exists. Please sign in instead.",
        },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in PostgreSQL through Prisma
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await scheduleInvalidateAuthCaches();

    return NextResponse.json(
      {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Registration error:", error);

    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { error: `Registration failed: ${message}` },
      { status: 500 },
    );
  }
}