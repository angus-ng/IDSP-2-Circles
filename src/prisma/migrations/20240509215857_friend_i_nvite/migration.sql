/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Follows";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Friend" (
    "friend_1_name" TEXT NOT NULL,
    "friend_2_name" TEXT NOT NULL,

    PRIMARY KEY ("friend_1_name", "friend_2_name"),
    CONSTRAINT "Friend_friend_1_name_fkey" FOREIGN KEY ("friend_1_name") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friend_friend_2_name_fkey" FOREIGN KEY ("friend_2_name") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "requesterName" TEXT NOT NULL,
    "requesteeName" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    PRIMARY KEY ("requesterName", "requesteeName"),
    CONSTRAINT "FriendRequest_requesterName_fkey" FOREIGN KEY ("requesterName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FriendRequest_requesteeName_fkey" FOREIGN KEY ("requesteeName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
