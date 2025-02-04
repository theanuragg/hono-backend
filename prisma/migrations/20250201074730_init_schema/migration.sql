-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "story" (
    "id" TEXT NOT NULL,
    "tittle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
