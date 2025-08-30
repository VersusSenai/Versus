/*
  Warnings:

  - Added the required column `status` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Team` ADD COLUMN `status` ENUM('E', 'O', 'P') NOT NULL;
