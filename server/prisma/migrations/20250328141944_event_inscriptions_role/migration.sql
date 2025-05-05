/*
  Warnings:

  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `description` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `EventInscriptions` ADD COLUMN `role` ENUM('O', 'P') NOT NULL DEFAULT 'P';
