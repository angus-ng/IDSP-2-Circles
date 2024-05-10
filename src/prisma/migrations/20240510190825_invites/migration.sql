/*
  Warnings:

  - You are about to drop the `AlbumInvite` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `UserCircle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserCircle` table. All the data in the column will be lost.
  - Added the required column `username` to the `UserCircle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AlbumInvite";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserAlbum" (
    "username" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    PRIMARY KEY ("username", "albumId"),
    CONSTRAINT "UserAlbum_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCircle" (
    "username" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    PRIMARY KEY ("username", "circleId"),
    CONSTRAINT "UserCircle_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCircle_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserCircle" ("circleId") SELECT "circleId" FROM "UserCircle";
DROP TABLE "UserCircle";
ALTER TABLE "new_UserCircle" RENAME TO "UserCircle";
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    CONSTRAINT "Album_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("circleId", "id", "name") SELECT "circleId", "id", "name" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
