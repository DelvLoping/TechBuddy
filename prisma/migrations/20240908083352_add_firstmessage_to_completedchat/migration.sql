/*
  Warnings:

  - Added the required column `firstmessage` to the `CompletedChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedChat" ADD COLUMN     "firstmessage" TEXT NOT NULL;
