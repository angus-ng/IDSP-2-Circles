/*
  Warnings:

  - You are about to drop the `_replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_replies_B_index";

-- DropIndex
DROP INDEX "_replies_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_replies";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,
    "userId" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "albumId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("username") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("albumId", "createdAt", "id", "likeCount", "message", "userId") SELECT "albumId", "createdAt", "id", "likeCount", "message", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
