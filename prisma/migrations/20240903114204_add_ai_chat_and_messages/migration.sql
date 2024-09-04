/*
  Warnings:

  - You are about to drop the column `answer` on the `AIChat` table. All the data in the column will be lost.
  - You are about to drop the column `chatDate` on the `AIChat` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `AIChat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('USER', 'AI');

-- AlterTable
ALTER TABLE "AIChat" DROP COLUMN "answer",
DROP COLUMN "chatDate",
DROP COLUMN "question",
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AIMessage" (
    "id" SERIAL NOT NULL,
    "aiChatId" INTEGER NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "content" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_aiChatId_fkey" FOREIGN KEY ("aiChatId") REFERENCES "AIChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
