"use server";
import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "../bridgeResponse";

export async function updateStatusPesanan(pesananId: number, status: string) {
  try {
    await prisma.pesanan.update({
      where: {
        id: pesananId,
      },
      data: {
        status,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return getResponse(1, "Gagal update status", 500);
  }
}
