-- CreateTable
CREATE TABLE "CircleInvite" (
    "invitee_username" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    PRIMARY KEY ("invitee_username", "circleId"),
    CONSTRAINT "CircleInvite_invitee_username_fkey" FOREIGN KEY ("invitee_username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
