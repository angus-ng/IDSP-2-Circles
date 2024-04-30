/*
  Warnings:

  - Added the required column `ownerId` to the `Circle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Circle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    CONSTRAINT "Circle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Circle" ("id", "name", "picture") SELECT "id", "name", "picture" FROM "Circle";
DROP TABLE "Circle";
ALTER TABLE "new_Circle" RENAME TO "Circle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
