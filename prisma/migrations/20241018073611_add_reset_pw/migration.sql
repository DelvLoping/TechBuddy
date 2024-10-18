/*
  Warnings:

  - You are about to drop the column `restPasswordToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "restPasswordToken",
ADD COLUMN     "resetPasswordToken" TEXT;
