import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";
import { supabase } from "@/app/api/bridgeSupabase";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const getUserId = formData.get("penjualId")?.toString().trim();
    const getName = formData.get("nama")?.toString().trim();
    const getAlamat = formData.get("alamat")?.toString().trim();
    const getImage = formData.get("image") as File | null;
    const getTelp = formData.get("no_telp")?.toString().trim();
    const getStoreOpen = formData.get("jam_buka")?.toString().trim();
    const getStoreClose = formData.get("jam_tutup")?.toString().trim();

    if (
      !getUserId ||
      !getName ||
      !getAlamat ||
      !getTelp ||
      !getStoreOpen ||
      !getStoreClose ||
      !getImage
    ) {
      return getResponse(1, "Silakan isi semua field dan upload gambar", 400);
    }

    const userIsPenjual = await prisma.user.findUnique({
      where: { id: getUserId },
    });

    if (!userIsPenjual || userIsPenjual.role !== "penjual") {
      return getResponse(1, "Hanya penjual yang bisa membuat warung", 403);
    }

    const buffer = await getImage.arrayBuffer();
    const path = `penjual/warung/${randomUUID()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("image-warung")
      .upload(path, buffer, { upsert: false });

    if (uploadError) {
      return getResponse(1, `Gagal upload gambar: ${uploadError.message}`, 500);
    }

    const { data } = supabase.storage.from("image-warung").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    const createWarung = await prisma.warung.create({
      data: {
        nama: getName,
        alamat: getAlamat,
        jam_buka: getStoreOpen,
        jam_tutup: getStoreClose,
        image: publicUrl,
        no_telp: getTelp,
        penjualId: getUserId,
      },
    });

    return getResponse(0, "Berhasil menambahkan warung", 201, createWarung);
  } catch (error: unknown) {
    console.error("Error saat POST warung:", error);
    return getResponse(1, "Terjadi kesalahan saat menambahkan warung", 500);
  }
};

// ========== GET: Ambil Daftar Warung ==========
export const GET = async () => {
  try {
    const warungs = await prisma.warung.findMany({
      include: {
        menu: true,
        user: { // relasi ke user (penjual)
          select: {
            username: true,
          },
        },
      },
    });

    return getResponse(0, "Berhasil mendapatkan data warung", 200, warungs);
  } catch (error: unknown) {
    console.error("Error saat GET warung:", error);
    return getResponse(1, "Terjadi kesalahan saat mengambil data", 500, []);
  }
};
