import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";

export const GET = async () => {
  try {
    const getBuyer = await prisma.user.findMany({
      where: {
        role: "pembeli",
      },
      include: {
        pesanan: true,
      },
    });

    if (!getBuyer) {
      return getResponse(1, "Role bukan pembeli", 409);
    }

    if (getBuyer.length === 0) {
      return getResponse(0, "Data pembeli kosong", 404, []);
    }

    return getResponse(0, "Berhasil menampilkan daftar pembeli", 200, getBuyer);
  } catch (error: unknown) {
    console.log(error);
    return getResponse(1, `${error}`, 500);
  }
};
