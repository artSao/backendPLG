import { prisma } from "@/app/api/bridgePrisma";
import { compare } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { corsHeaders } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const POST = async (req: NextRequest) => {
  try {
    // Tangkap username dan password dari request
    const { username, password } = await req.json();

    // Cari user berdasarkan username
    const userFound = await prisma.user.findFirst({
      where: { username },
    });

    if (!userFound) {
      return NextResponse.json(
        {
          metadata: {
            error: 1,
            message: "Username not registered, please register first",
            status: 404,
          },
        },
        { status: 404, headers: corsHeaders }
      );
    }

    // Bandingkan password yang dikirim dengan hash password di DB
    const isValidPass = await compare(password, userFound.password);

    if (!isValidPass) {
      return NextResponse.json(
        {
          metadata: {
            error: 1,
            message: "Password is incorrect",
            status: 401,
          },
        },
        { status: 401, headers: corsHeaders }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userFound.id,
        username: userFound.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Kirim response dengan token
    return NextResponse.json(
      {
        metadata: {
          error: 0,
          message: "Login successful",
          status: 200,
        },
        data: {
          token,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: "Internal server error",
          status: 500,
        },
      },
      { status: 500, headers: corsHeaders }
    );
  }
};
