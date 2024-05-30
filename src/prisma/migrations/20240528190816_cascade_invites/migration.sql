-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CircleInvite" (
    "invitee_username" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    PRIMARY KEY ("invitee_username", "circleId"),
    CONSTRAINT "CircleInvite_invitee_username_fkey" FOREIGN KEY ("invitee_username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CircleInvite_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CircleInvite" ("circleId", "invitee_username") SELECT "circleId", "invitee_username" FROM "CircleInvite";
DROP TABLE "CircleInvite";
ALTER TABLE "new_CircleInvite" RENAME TO "CircleInvite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
