-- CreateTable
CREATE TABLE "CompletedChat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatContent" JSONB NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompletedChat" ADD CONSTRAINT "CompletedChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
