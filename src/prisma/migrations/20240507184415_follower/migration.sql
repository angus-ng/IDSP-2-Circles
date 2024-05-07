-- CreateTable
CREATE TABLE "Follows" (
    "followerName" TEXT NOT NULL,
    "followingName" TEXT NOT NULL,

    PRIMARY KEY ("followerName", "followingName"),
    CONSTRAINT "Follows_followerName_fkey" FOREIGN KEY ("followerName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follows_followingName_fkey" FOREIGN KEY ("followingName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
