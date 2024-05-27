/*
  Warnings:

  - You are about to drop the `_circleMod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_circleMod_B_index";

-- DropIndex
DROP INDEX "_circleMod_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_circleMod";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCircle" (
    "username" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "mod" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("username", "circleId"),
    CONSTRAINT "UserCircle_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCircle_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserCircle" ("circleId", "username") SELECT "circleId", "username" FROM "UserCircle";
DROP TABLE "UserCircle";
ALTER TABLE "new_UserCircle" RENAME TO "UserCircle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
