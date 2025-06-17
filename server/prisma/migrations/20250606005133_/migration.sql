/*
  Warnings:

  - You are about to drop the `TeamEvents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `multiplayer` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `EventInscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TeamEvents` DROP FOREIGN KEY `TeamEvents_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamEvents` DROP FOREIGN KEY `TeamEvents_teamId_fkey`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `multiplayer` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `EventInscriptions` ADD COLUMN `teamId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `TeamEvents`;

-- AddForeignKey
ALTER TABLE `EventInscriptions` ADD CONSTRAINT `EventInscriptions_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
