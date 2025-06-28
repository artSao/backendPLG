import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  try {
    const param = params.id;

    const getWarungById = await prisma.warung.findFirst({
      where: {
        id: Number(param),
      },
      include: {
        menu: true,
        penjual: {
          select: { username: true },
        },
      },
    });

    if (!getWarungById) {
      return getResponse(1, "Warung tidak ditemukan", 404);
    }

    return getResponse(
      0,
      `data ${getWarungById.nama} berhasil didapatkan`,
      200,
      getWarungById
    );
  } catch (error: unknown) {
    console.error(error);
    return getResponse(1, `${error}`, 500, []);
  }
};

export const PUT = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const update = await prisma.warung.update({
      where: { id },
      data: {
        nama: body.nama,
        alamat: body.alamat,
        jam_buka: body.jam_buka,
        jam_tutup: body.jam_tutup,
        no_telp: body.no_telp,
        image: body.image, // diasumsikan image bisa diedit (jika tidak, hapus ini)
      },
    });

    return getResponse(0, "Berhasil mengupdate warung", 200, update);
  } catch (error: unknown) {
    console.error("Error PUT:", error);
    return getResponse(1, "Gagal mengupdate warung", 500);
  }
};

export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  try {
    const id = Number(params.id);

    await prisma.warung.delete({
      where: { id },
    });

    return getResponse(0, "Berhasil menghapus warung", 200);
  } catch (error: unknown) {
    console.error("Error DELETE:", error);
    return getResponse(1, "Gagal menghapus warung", 500);
  }
};
