import { NextRequest } from "next/server";
import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return getResponse(1, "ID pesanan tidak valid", 400);
    }

    const pesanan = await prisma.pesanan.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
        detailPesanan: {
          include: {
            menu: {
              select: {
                nama_menu: true,
                harga: true,
                warung: { select: { nama: true } },
              },
            },
          },
        },
      },
    });

    if (!pesanan) {
      return getResponse(1, "Pesanan tidak ditemukan", 404);
    }

    const result = {
      id: pesanan.id,
      pemesan: pesanan.user.username,
      waktu_pesan: pesanan.waktu_pesan,
      waktu_ambil: pesanan.waktu_ambil,
      total_harga: pesanan.total_harga,
      status: pesanan.status,
      menu_dipesan: pesanan.detailPesanan.map((item) => ({
        nama_menu: item.menu.nama_menu,
        harga: item.menu.harga,
        jumlah: item.jumlah,
        total: item.menu.harga * item.jumlah,
        warung: item.menu.warung.nama,
      })),
    };

    return getResponse(0, "Berhasil mendapatkan data pesanan", 200, result);
  } catch (err: any) {
    console.error(err);
    return getResponse(1, err.message || "Terjadi kesalahan server", 500);
  }
}
