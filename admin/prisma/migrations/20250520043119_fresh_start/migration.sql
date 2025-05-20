-- CreateTable
CREATE TABLE "Student" (
    "usn" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("usn")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "studentUsn" TEXT NOT NULL,
    "priority" TEXT,
    "category" TEXT,
    "analysis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_studentUsn_idx" ON "Post"("studentUsn");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_studentUsn_fkey" FOREIGN KEY ("studentUsn") REFERENCES "Student"("usn") ON DELETE RESTRICT ON UPDATE CASCADE;
