import { NextRequest } from "next/server";
import { prisma } from "@/app/api/bridgePrisma";
import { randomUUID } from "crypto";
import { getResponse } from "@/app/api/bridgeResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      warungId,
      waktu_ambil,
      items, // array of { menuId, jumlah }
    } = body;

    if (
      !userId ||
      !warungId ||
      !waktu_ambil ||
      !items ||
      !Array.isArray(items)
    ) {
      return getResponse(1, "Data tidak lengkap", 400);
    }

    // Ambil semua menu yang dipilih dan milik warung yang benar
    const menuIds = items.map((item: any) => item.menuId);

    const menus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        warungId: warungId,
        tersedia: true,
      },
    });

    if (menus.length !== items.length) {
      return getResponse(
        1,
        "Ada menu yang tidak tersedia atau tidak milik warung tersebut.",
        400
      );
    }

    // Hitung total harga
    const hargaMap: Record<number, number> = {};
    menus.forEach((menu) => {
      hargaMap[menu.id] = menu.harga;
    });

    const total_harga = items.reduce((sum: number, item: any) => {
      return sum + hargaMap[item.menuId] * item.jumlah;
    }, 0);

    // Buat pesanan
    const pesanan = await prisma.pesanan.create({
      data: {
        userId,
        waktu_ambil: new Date(waktu_ambil),
        waktu_pesan: new Date(),
        total_harga,
        status: "DRAFT",
        detailPesanan: {
          create: items.map((item: any) => ({
            menuId: item.menuId,
            jumlah: item.jumlah,
          })),
        },
      },
    });

    // Buat transaksi
    const orderId = `ORDER-${randomUUID()}`;
    const transaction = await prisma.transaction.create({
      data: {
        orderId,
        amount: total_harga,
        status: "pending",
      },
    });

    return getResponse(
      0,
      "Pesanan berhasil dibuat. Silakan lanjutkan ke pembayaran.",
      201,
      {
        pesananId: pesanan.id,
        transactionId: transaction.id,
        orderId: transaction.orderId,
        total_harga,
      }
    );
  } catch (err: any) {
    console.error(err);
    return getResponse(1, err.message || "Terjadi kesalahan server", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.pesanan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { username: true },
        },
        detailPesanan: {
          include: {
            menu: {
              select: {
                nama_menu: true,
                harga: true,
                warung: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (data.length === 0) {
      return getResponse(1, "Belum ada pesanan", 404, []);
    }

    // Format hasil
    const result = data.map((pesanan) => ({
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
    }));

    return getResponse(0, "Berhasil mendapatkan daftar pesanan", 200, result);
  } catch (err: any) {
    console.error(err);
    return getResponse(1, err.message || "Terjadi kesalahan server", 500);
  }
}
