/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `EventInscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `eventinscriptions` DROP FOREIGN KEY `EventInscriptions_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `eventinscriptions` DROP FOREIGN KEY `EventInscriptions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `Match_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `Match_firstTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `Match_secondTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `teamevents` DROP FOREIGN KEY `TeamEvents_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `teamevents` DROP FOREIGN KEY `TeamEvents_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `teamusers` DROP FOREIGN KEY `TeamUsers_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `teamusers` DROP FOREIGN KEY `TeamUsers_userId_fkey`;

-- DropIndex
DROP INDEX `EventInscriptions_eventId_fkey` ON `eventinscriptions`;

-- DropIndex
DROP INDEX `EventInscriptions_userId_fkey` ON `eventinscriptions`;

-- DropIndex
DROP INDEX `Match_eventId_fkey` ON `match`;

-- DropIndex
DROP INDEX `Match_firstTeamId_fkey` ON `match`;

-- DropIndex
DROP INDEX `Match_secondTeamId_fkey` ON `match`;

-- DropIndex
DROP INDEX `Team_ownerId_fkey` ON `team`;

-- DropIndex
DROP INDEX `TeamEvents_eventId_fkey` ON `teamevents`;

-- DropIndex
DROP INDEX `TeamEvents_teamId_fkey` ON `teamevents`;

-- DropIndex
DROP INDEX `TeamUsers_teamId_fkey` ON `teamusers`;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('P', 'O', 'A') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EventInscriptions_userId_eventId_key` ON `EventInscriptions`(`userId`, `eventId`);

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventInscriptions` ADD CONSTRAINT `EventInscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventInscriptions` ADD CONSTRAINT `EventInscriptions_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamUsers` ADD CONSTRAINT `TeamUsers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamUsers` ADD CONSTRAINT `TeamUsers_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamEvents` ADD CONSTRAINT `TeamEvents_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamEvents` ADD CONSTRAINT `TeamEvents_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_firstTeamId_fkey` FOREIGN KEY (`firstTeamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_secondTeamId_fkey` FOREIGN KEY (`secondTeamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
