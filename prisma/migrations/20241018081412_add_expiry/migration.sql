-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3);
