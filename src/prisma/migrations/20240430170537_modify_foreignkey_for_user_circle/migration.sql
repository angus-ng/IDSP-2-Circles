-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCircle" (
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "circleId"),
    CONSTRAINT "UserCircle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCircle_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserCircle" ("circleId", "userId") SELECT "circleId", "userId" FROM "UserCircle";
DROP TABLE "UserCircle";
ALTER TABLE "new_UserCircle" RENAME TO "UserCircle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
