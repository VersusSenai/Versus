/*
  Warnings:

  - Added the required column `keyNumber` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchNumber` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Match` ADD COLUMN `keyNumber` INTEGER NOT NULL,
    ADD COLUMN `matchNumber` INTEGER NOT NULL;
