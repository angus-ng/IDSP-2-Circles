-- CreateTable
CREATE TABLE "UserAlbum" (
    "username" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    PRIMARY KEY ("username", "albumId"),
    CONSTRAINT "UserAlbum_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
