/*
  Warnings:

  - Added the required column `keysQuantity` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchsQuantity` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` ADD COLUMN `keysQuantity` INTEGER NOT NULL,
    ADD COLUMN `matchsQuantity` INTEGER NOT NULL;
