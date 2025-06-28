import { prisma } from "../bridgePrisma";
import { NextRequest } from "next/server";
import { genSalt, hash } from "bcrypt-ts";
import { getResponse } from "@/app/api/bridgeResponse"; // sesuaikan path dengan lokasi aslinya

export const GET = async () => {
  try {
    const existingUser = await prisma.user.findMany();

    if (existingUser.length === 0) {
      return getResponse(1, "User is empty", 409);
    }

    const users = await prisma.user.findMany({
      include: {
        warung: true,
        pesanan: true,
      },
    });

    return getResponse(0, "Success", 200, users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return getResponse(1, `Error fetching users: ${err}`, 500);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { email, username, password, role } = await request.json();

    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingEmail) {
      return getResponse(1, `Email ${email} already exists`, 409);
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return getResponse(1, `Username ${username} already exists`, 409);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const seeData = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    return getResponse(
      0,
      `User ${username} created successfully`,
      201,
      seeData
    );
  } catch (err) {
    console.error("Error creating user:", err);
    return getResponse(1, `Error creating user: ${err}`, 500);
  }
};
