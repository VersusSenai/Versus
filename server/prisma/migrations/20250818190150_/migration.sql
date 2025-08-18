/*
  Warnings:

  - A unique constraint covering the columns `[teamId,eventId]` on the table `EventInscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EventInscriptions_teamId_eventId_key` ON `EventInscriptions`(`teamId`, `eventId`);
