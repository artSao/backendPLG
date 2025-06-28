import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";
import { NextRequest } from "next/server";

// GET warung by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = Number(params.id);

    if (!params.id || isNaN(id)) {
      return getResponse(1, "ID tidak valid", 400);
    }

    const warung = await prisma.warung.findUnique({
      where: { id },
      include: {
        menu: true,
        user: { // ✅ ganti dari 'penjual' menjadi 'user'
          select: { username: true },
        },
      },
    });

    if (!warung) {
      return getResponse(1, "Warung tidak ditemukan", 404);
    }

    return getResponse(0, `Data ${warung.nama} berhasil didapatkan`, 200, warung);
  } catch (error) {
    console.error("GET Error:", error);
    return getResponse(1, "Terjadi kesalahan server", 500);
  }
};

// PUT untuk update data warung
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = Number(params.id);
    if (!id || isNaN(id)) return getResponse(1, "ID tidak valid", 400);

    const body = await req.json();

    const update = await prisma.warung.update({
      where: { id },
      data: {
        nama: body.nama,
        alamat: body.alamat,
        jam_buka: body.jam_buka,
        jam_tutup: body.jam_tutup,
        no_telp: body.no_telp,
        image: body.image,
      },
    });

    return getResponse(0, "Berhasil mengupdate warung", 200, update);
  } catch (error: unknown) {
    console.error("Error PUT:", error);
    return getResponse(1, "Gagal mengupdate warung", 500);
  }
};

// DELETE untuk hapus data warung
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = Number(params.id);

  if (!params.id || isNaN(id)) {
    return getResponse(1, "ID tidak valid", 400);
  }

  try {
    await prisma.warung.delete({ where: { id } });
    return getResponse(0, "Berhasil menghapus warung", 200);
  } catch (error) {
    console.error("DELETE Error:", error);
    return getResponse(1, "Gagal menghapus warung", 500);
  }
};
