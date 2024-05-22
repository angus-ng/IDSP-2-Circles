-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "circleId" TEXT NOT NULL,
    CONSTRAINT "Album_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("circleId", "id", "likeCount", "name", "ownerName") SELECT "circleId", "id", "likeCount", "name", "ownerName" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
