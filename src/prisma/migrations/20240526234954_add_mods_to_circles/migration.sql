-- CreateTable
CREATE TABLE "_circleMod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_circleMod_A_fkey" FOREIGN KEY ("A") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_circleMod_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_circleMod_AB_unique" ON "_circleMod"("A", "B");

-- CreateIndex
CREATE INDEX "_circleMod_B_index" ON "_circleMod"("B");
