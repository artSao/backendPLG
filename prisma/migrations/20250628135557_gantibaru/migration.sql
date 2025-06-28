-- CreateTable
CREATE TABLE `detailpesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesananId` INTEGER NOT NULL,
    `menuId` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,

    INDEX `DetailPesanan_menuId_fkey`(`menuId`),
    INDEX `DetailPesanan_pesananId_fkey`(`pesananId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_menu` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `tersedia` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `warungId` INTEGER NOT NULL,

    INDEX `Menu_warungId_fkey`(`warungId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `waktu_ambil` DATETIME(3) NOT NULL,
    `waktu_pesan` DATETIME(3) NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Pesanan_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `paymentType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `snapToken` VARCHAR(191) NULL,
    `midtransId` VARCHAR(191) NULL,
    `pesananId` INTEGER NULL,

    UNIQUE INDEX `Transaction_orderId_key`(`orderId`),
    UNIQUE INDEX `Transaction_pesananId_key`(`pesananId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(90) NOT NULL,
    `resetToken` VARCHAR(255) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `role` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,
    `jam_buka` VARCHAR(191) NOT NULL,
    `jam_tutup` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `penjualId` VARCHAR(191) NOT NULL,

    INDEX `Warung_penjualId_fkey`(`penjualId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detailpesanan` ADD CONSTRAINT `DetailPesanan_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpesanan` ADD CONSTRAINT `DetailPesanan_pesananId_fkey` FOREIGN KEY (`pesananId`) REFERENCES `pesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `Menu_warungId_fkey` FOREIGN KEY (`warungId`) REFERENCES `warung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `Pesanan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `Transaction_pesananId_fkey` FOREIGN KEY (`pesananId`) REFERENCES `pesanan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warung` ADD CONSTRAINT `Warung_penjualId_fkey` FOREIGN KEY (`penjualId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
