/*
  Warnings:

  - You are about to drop the `UserAlbum` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserAlbum";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Circle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Circle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Circle" ("id", "name", "ownerId", "picture") SELECT "id", "name", "ownerId", "picture" FROM "Circle";
DROP TABLE "Circle";
ALTER TABLE "new_Circle" RENAME TO "Circle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
