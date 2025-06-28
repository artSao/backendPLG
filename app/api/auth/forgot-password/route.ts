import { NextRequest } from "next/server";
import { prisma } from "../../bridgePrisma";
import { sendPasswordResetEmail } from "../../bridgeMailer";
import crypto from "crypto";
import { getResponse } from "../../bridgeResponse"; // Pastikan path sesuai
import { corsHeaders, handleOptions } from '@/lib/cors'


export const POST = async (req: NextRequest) => {
  const { email } = await req.json();

  try {
    // Temukan user berdasarkan email di database
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return getResponse(1, "Email not found, Please Register", 404, null, corsHeaders);
    }

    // Hapus token lama jika ada
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Generate token baru
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam

    // Simpan token baru
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // Kirim email
    await sendPasswordResetEmail(user.email!, resetToken);

    // Sukses
    return getResponse(
      0,
      "Reset password link telah dikirim ke email Anda. Token berlaku selama 1 jam. Cek folder spam jika tidak muncul.",
      200,
      null
    );
  } catch (err) {
    console.error("Error:", err);
    return getResponse(1, "Internal server error", 500, null, corsHeaders);
  }
};

export const OPTIONS = handleOptions;
