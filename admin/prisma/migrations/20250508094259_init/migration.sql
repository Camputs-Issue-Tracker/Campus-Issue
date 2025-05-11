-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "usn" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_usn_key" ON "Student"("usn");
