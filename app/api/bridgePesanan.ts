import { DetailPesanan, OrderStatus, Pesanan } from "@prisma/client";

export type PesananWithDetails = Pesanan & {
    detailPesanan: (DetailPesanan & {
        menu: {
            nama: string,
            harga: number,
            gambar?: string,
      }
  })
};


export type CreatePesananPayLoad = {
    userId: string
    items: {
        menuId: number
        jumlah: number
    }[]
    waktu_ambil: Date
}

export type UpdatePesananStatusPayLoad = {
    pesananId: number
    status: OrderStatus
}