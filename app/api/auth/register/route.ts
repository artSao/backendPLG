import { prisma } from "@/app/api/bridgePrisma";
import { NextRequest } from "next/server";
import { genSalt, hash } from "bcrypt-ts";
import { getResponse } from "../../bridgeResponse";
import { corsHeaders, handleOptions } from '@/lib/cors'


export const POST = async (req: NextRequest) => {
  try {
    // Ambil Input email, username, password dan role dari request
    const { email, username, password, role } = await req.json();
    // Mengecek apakah email sudah ada
    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findFirst({
        where: {
          email: email,
        },
      }),
      prisma.user.findFirst({
        where: {
          username: username,
        },
      }),
    ]);

    // kondisi jika email sudah terdaftar
    if (existingEmail) {
      return getResponse(1, `email ${email} already exists`, 409, null, corsHeaders);
      headers: corsHeaders
    }

    // kondisi jika username sudah terdaftar
    if (existingUsername) {
      return getResponse(1, `username ${username} already exists`, 409, null, corsHeaders);
    }

    // password must be at least 8 until 20 characters
    if (password.length < 8 || password.length > 20) {
      return getResponse(
        1,
        "Password must be at least 8 characters and at most 20 characters",
        400,
        null, corsHeaders
      );
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // register user
    const data = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        role: role,
      },
    });

    return getResponse(0, "Registrasi berhasil", 201, data, corsHeaders);
  } catch (error: unknown) {
    console.error("Register error:", error);
    return getResponse(1, `${error}`, 500, null);
  }
  
};

export const OPTIONS = handleOptions;
