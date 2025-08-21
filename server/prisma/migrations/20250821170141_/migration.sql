/*
  Warnings:

  - You are about to drop the column `ownerId` on the `team` table. All the data in the column will be lost.
  - Added the required column `status` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` DROP COLUMN `ownerId`,
    ADD COLUMN `status` ENUM('P', 'O', 'B') NOT NULL;
