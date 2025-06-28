import { NextRequest } from "next/server";
import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";
import { supabase } from "@/app/api/bridgeSupabase";
import { randomUUID } from "crypto";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const warungId = searchParams.get("warungId");

    if (!warungId) {
      return getResponse(1, "Parameter 'warungId' wajib disediakan", 400);
    }

    // Cek apakah warung dengan ID tersebut ada
    const checkWarung = await prisma.warung.findUnique({
      where: {
        id: Number(warungId),
      },
    });

    if (!checkWarung) {
      return getResponse(
        1,
        `Warung dengan id: ${warungId} tersebut tidak ditemukan`,
        404
      );
    }

    //  Ambil data menu jika warung ada
    const getMenu = await prisma.menu.findMany({
      where: {
        warungId: Number(warungId),
      },
    });

    if (getMenu.length === 0) {
      return getResponse(1, "Menu tidak ditemukan untuk warung ini", 404, []);
    }

    return getResponse(0, "Berhasil mendapatkan menu", 200, getMenu);
  } catch (error: unknown) {
    return getResponse(1, `Terjadi kesalahan: ${error}`, 500, []);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const warungId = parseInt(formData.get("warungId") as string);
    const nama_menu = formData.get("nama_menu") as string;
    const harga = parseInt(formData.get("harga") as string);
    const tersedia = formData.get("tersedia") === "true"; // harus "true" / "false"
    const gambar = formData.get("gambar") as File;

    if (
      !warungId ||
      !nama_menu ||
      !harga ||
      isNaN(harga) ||
      !formData.get("tersedia") ||
      !gambar
    ) {
      return getResponse(1, "Silakan isi semua field menu", 400);
    }

    // Validasi apakah warungnya ada
    const warung = await prisma.warung.findUnique({
      where: { id: warungId },
    });

    if (!warung) {
      return getResponse(
        1,
        `Warung dengan id ${warungId} tidak ditemukan`,
        404
      );
    }

    // Upload gambar ke Supabase
    const buffer = await gambar.arrayBuffer();
    const path = `penjual/menu/${randomUUID()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("image-warung")
      .upload(path, buffer, {
        upsert: false,
        contentType: gambar.type,
      });

    if (uploadError) {
      return getResponse(1, `Gagal upload gambar: ${uploadError.message}`, 409);
    }

    const { data } = supabase.storage.from("image-warung").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Simpan menu ke database
    const menu = await prisma.menu.create({
      data: {
        nama_menu,
        harga,
        tersedia,
        gambar: publicUrl,
        warungId,
      },
    });

    return getResponse(0, "Berhasil menambahkan menu", 201, menu);
  } catch (error: unknown) {
    return getResponse(1, `${error}`, 500);
  }
};
