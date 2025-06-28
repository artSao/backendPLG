import { prisma } from "../../bridgePrisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ Fungsi GET: Ambil user berdasarkan ID
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const userId = params?.id;

  if (!userId) {
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: "User ID tidak boleh kosong",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          metadata: {
            error: 1,
            message: `User dengan ID '${userId}' tidak ditemukan`,
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        metadata: {
          error: 0,
          message: "User ditemukan",
          status: 200,
        },
        data: user,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error(`Error GET user: ${err}`);
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: `${err}` || "Terjadi kesalahan server",
          status: 500,
        },
      },
      { status: 500 }
    );
  }
};

// ✅ Fungsi PUT: Update user berdasarkan ID
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const userId = params?.id;

  if (!userId) {
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: "User ID tidak boleh kosong",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  try {
    const { username, password, role } = await req.json();

    const checkUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      return NextResponse.json(
        {
          metadata: {
            error: 1,
            message: "User tidak ditemukan",
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        password,
        role,
      },
    });

    return NextResponse.json(
      {
        metadata: {
          error: 0,
          message: "User berhasil diperbarui",
          status: 200,
        },
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error(`Error PUT user: ${err}`);
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: `${err}` || "Terjadi kesalahan server",
          status: 500,
        },
      },
      { status: 500 }
    );
  }
};

// ✅ Fungsi DELETE: Hapus user berdasarkan ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const userId = params?.id;

  if (!userId) {
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: "User ID tidak boleh kosong",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      return NextResponse.json(
        {
          metadata: {
            error: 1,
            message: "User tidak ditemukan",
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      {
        metadata: {
          error: 0,
          message: "User berhasil dihapus",
          status: 200,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(`Error DELETE user: ${err}`);
    return NextResponse.json(
      {
        metadata: {
          error: 1,
          message: `${err}` || "Terjadi kesalahan server",
          status: 500,
        },
      },
      { status: 500 }
    );
  }
};
