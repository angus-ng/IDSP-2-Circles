-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "src" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Photo_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("albumId", "id", "src", "userId") SELECT "albumId", "id", "src", "userId" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    CONSTRAINT "Album_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("circleId", "id", "name") SELECT "circleId", "id", "name" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
