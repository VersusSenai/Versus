/*
  Warnings:

  - You are about to alter the column `status` on the `teamusers` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(6))`.

*/
-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_ownerId_fkey`;

-- DropIndex
DROP INDEX `Team_ownerId_fkey` ON `team`;

-- AlterTable
ALTER TABLE `teamusers` ADD COLUMN `role` ENUM('A', 'O', 'P') NOT NULL DEFAULT 'P',
    MODIFY `status` ENUM('O', 'B') NOT NULL DEFAULT 'O';
