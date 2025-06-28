import { prisma } from "@/app/api/bridgePrisma";
import { getResponse } from "@/app/api/bridgeResponse";

export const GET = async () => {
  try {
    const getSeller = await prisma.user.findMany({
      where: {
        role: "penjual",
      },
    });

    if (!getSeller) {
      return getResponse(1, "Role bukan penjual", 409);
    }

    if (getSeller.length === 0) {
      return getResponse(0, "Data penjual kosong", 404, []);
    }

    return getResponse(
      0,
      "Berhasil menampilkan daftar penjual",
      200,
      getSeller
    );
  } catch (error: unknown) {
    console.log(error);
    return getResponse(1, `${error}`, 500);
  }
};
