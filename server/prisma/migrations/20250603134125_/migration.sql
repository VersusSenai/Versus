/*
  Warnings:

  - Added the required column `maxPlayers` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` ADD COLUMN `maxPlayers` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Match` ADD COLUMN `firstUserId` INTEGER NULL,
    ADD COLUMN `secondUserId` INTEGER NULL,
    MODIFY `firstTeamId` INTEGER NULL,
    MODIFY `secondTeamId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_firstUserId_fkey` FOREIGN KEY (`firstUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_secondUserId_fkey` FOREIGN KEY (`secondUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
