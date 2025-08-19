-- AlterTable
ALTER TABLE `event` ADD COLUMN `private` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `team` ADD COLUMN `private` BOOLEAN NULL DEFAULT false;
