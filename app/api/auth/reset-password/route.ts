import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../bridgePrisma";
import { corsHeaders, handleOptions } from '@/lib/cors'


export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token dan password diperlukan." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Cari user berdasarkan token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // pastikan token belum kedaluwarsa
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token tidak valid atau sudah kedaluwarsa." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password baru
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan hapus token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword, // Ganti dengan hashedPassword jika menggunakan bcrypt
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password berhasil direset." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return handleOptions()
}