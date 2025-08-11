/*
  Warnings:

  - You are about to drop the column `winnerUserId` on the `event` table. All the data in the column will be lost.
  - The values [S] on the enum `Event_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `eventinscriptions` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(4))`.
  - You are about to alter the column `status` on the `teamusers` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(6))`.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_winnerUserId_fkey`;

-- DropIndex
DROP INDEX `Event_winnerUserId_fkey` ON `event`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `winnerUserId`,
    MODIFY `status` ENUM('E', 'O', 'P') NOT NULL DEFAULT 'P';

-- AlterTable
ALTER TABLE `eventinscriptions` MODIFY `status` ENUM('O', 'L', 'W', 'R') NOT NULL DEFAULT 'O';

-- AlterTable
ALTER TABLE `teamusers` MODIFY `status` ENUM('A', 'U') NOT NULL DEFAULT 'U';
