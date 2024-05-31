import { User } from "@prisma/client";
import DBClient from "../../../PrismaClient";
import IUserService from "./IUserService";
import Activities from "./../../../interfaces/activities.interface";

export class UserService implements IUserService {
  readonly _db: DBClient = DBClient.getInstance();

  async friend(requester: string, requestee: string): Promise<void | { requestee: string, requester: string, status: string }> {
    try {
      const exists = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: requestee,
            requesterName: requester
          }
        }
      })
      if (exists) {
        return;
      }

      const friendRequest = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: requester,
            requesterName: requestee
          },
          status: false
        }
      })
      if (friendRequest) {
        return await this.acceptRequest(requestee, requester)
      }

      await this._db.prisma.friendRequest.create({
        data: {
          requesteeName: requestee,
          requesterName: requester,
          status: false
        }
      })
      return { requester, requestee, status: "sentRequest" }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async unfriend(friend_1_name: string, friend_2_name: string): Promise<string | void> {
    try {
      await this._db.prisma.friend.delete({
        where: {
          friend_1_name_friend_2_name: {
            friend_1_name: friend_1_name,
            friend_2_name: friend_2_name
          }
        }
      })
      await this._db.prisma.friend.delete({
        where: {
          friend_1_name_friend_2_name: {
            friend_1_name: friend_2_name,
            friend_2_name: friend_1_name
          }
        }
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }
  async getFriends(username: string): Promise<void | User[]> {
    if (!username) {
      return
    }
    try {
      const listOfFriendName = []
      const user = await this._db.prisma.user.findUnique({
        where: {
          username: username
        },
        include: {
          friends: {},
          friendOf: {}
        }
      })
      if (!user) {
        return
      }
      for (let friend of user.friends) {
        listOfFriendName.push(friend.friend_2_name)
      }

      const listOfFriends = []
      for (let username of listOfFriendName) {
        const user = await this._db.prisma.user.findUnique({
          select: {
            username: true,
            displayName: true,
            profilePicture: true
          },
          where: {
            username: username
          }
        })
        listOfFriends.push(user)
      }
      //@ts-ignore
      return listOfFriends
    } catch (error) {
      throw new Error("Unable to find friends")

    }
  }
  async getActivities(username: string): Promise<void | Activities> {
    try {
      const friendRequests = await this._db.prisma.friendRequest.findMany({
        where: {
          requesteeName: username,
          status: false
        }, include: {
          requester: {
            select: {
              displayName: true,
              username: true,
              profilePicture: true
            }
          }
        }
      })
      const circleInvites = await this._db.prisma.circleInvite.findMany({
        where: {
          invitee_username: username
        }, include: {
          circle: {}
        }
      })
      const newCommentActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: 'NEW_COMMENT'
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              profilePicture: true
            }
          },
          album: {
            select: {
              name: true,
              photos: {
                take: 1,
                select: {
                  src: true
                }
              },
              id: true,
              circle: {
                select: {
                  id:true
                }
              }
            }
          },
          comment: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePicture: true
                }
              }
            }
          }
        }
      });

      const replyToCommentActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: 'REPLY_TO_COMMENT'
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            }
          },
          album: {
            select: {
              name: true,
              photos: {
                take: 1,
                select: {
                  src: true
                },
              },
              id: true
            }
          },
          comment: {
            select: {
              message: true,
              userId: true
            }
          }
        }
      });

      const likeAlbumActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: 'LIKE_ALBUM'
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            }
          },
          album: {
            select: {
              name: true,
              photos: {
                take: 1,
                select: {
                  src: true
                }
              },
              id: true
            }
          },
          like: {
            select: {
              user: {
                select: {
                  username: true,
                  profilePicture: true
                }
              }
            }
          }
        }
      });
      const likeCommentActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: "LIKE_COMMENT"
        }, orderBy: {
          createdAt: 'desc'
        },
        include: {
          comment: {
            include: {
              album: {
                select: {
                  photos: {
                    take: 1,
                    select: {
                      src: true
                    }
                  },
                  name: true,
                  id: true,
                  circle: {
                    select: {
                      id:true
                    }
                  }
                }
              }
            }
          },
          like: {
            include: {
              user: {
                select: {
                  profilePicture: true,
                  username: true
                }
              }
            }
          },
          user: {
            select: {
              profilePicture: true
            }
          }
        }
      })
      const newPhotoActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: "ADD_PHOTOS"
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          photo: {
            include: {
              album: {
                select: {
                  name: true,
                  photos: {
                    take: 1,
                    select: {
                      src: true
                    }
                  }
                }
              },
              poster: {
                select: {
                  username: true,
                  profilePicture: true
                }
              }
            }
          }
        }
      })
      const newAlbumActivities = await this._db.prisma.activity.findMany({
        where: {
          userId: username,
          type: "NEW_ALBUM"
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            }
          },
          album: {
            select: {
              name: true,
              photos: {
                take: 1,
                select: {
                  src: true
                }
              },
              owner: {
                select: {
                  username: true,
                  profilePicture: true
                }
              },
              id: true
            }
          },
        }
      })
      const activities: Activities = {
        friendRequests: friendRequests,
        circleInvites: circleInvites,
        newCommentActivities: newCommentActivities,
        replyToCommentActivities: replyToCommentActivities,
        likeAlbumActivities: likeAlbumActivities,
        newPhotoActivities: newPhotoActivities,
        likeCommentActivities: likeCommentActivities,
        newAlbumActivities: newAlbumActivities
      };

      return activities
    } catch (error: any) {
      throw new Error(error)
    }
  }
  async clearActivities(username: string): Promise<any> {
    try {
      await this._db.prisma.activity.deleteMany({
        where: {
          userId: username
        }
      });
      return
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async acceptRequest(requester: string, requestee: string): Promise<void | { requester: string, requestee: string, status: string }> {
    try {
      const friendRequest = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: requestee,
            requesterName: requester
          },
          status: false
        }
      })
      if (friendRequest) {
        await this._db.prisma.friendRequest.delete({
          where: {
            requesterName_requesteeName: {
              requesteeName: requestee,
              requesterName: requester
            }
          }
        })
        await this._db.prisma.friend.create({
          data: {
            friend_1_name: requestee,
            friend_2_name: requester
          }
        })
        await this._db.prisma.friend.create({
          data: {
            friend_1_name: requester,
            friend_2_name: requestee
          }
        })
        return { requester, requestee, status: "accept" }
      } else {
        throw new Error("You have not been friend requested by this user")
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  async removeRequest(user1: string, user2: string): Promise<void> {
    try {
      const friendRequestReceive = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: user1,
            requesterName: user2
          },
          status: false
        }
      })
      const friendRequestSent = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: user2,
            requesterName: user1
          },
          status: false
        }
      })
      if (friendRequestReceive) {
        await this._db.prisma.friendRequest.delete({
          where: {
            requesterName_requesteeName: {
              requesteeName: user1,
              requesterName: user2
            },
            status: false
          }
        })
      }
      if (friendRequestSent) {
        await this._db.prisma.friendRequest.delete({
          where: {
            requesterName_requesteeName: {
              requesteeName: user2,
              requesterName: user1
            },
            status: false
          }
        })
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  async search(input: string, currentUser: string): Promise<any> {
    try {
      const userSearchResults = await this._db.prisma.user.findMany({
        select: {
          username: true,
          profilePicture: true,
          displayName: true,
          friendOf: {},
          friends: {},
          requestReceived: {
            include: { requester: {} },
            where: { requesterName: currentUser }
          },
          requestsSent: {
            include: { requestee: {} },
            where: { requesteeName: currentUser }
          }
        },
        where: {
          OR: [
            {
              username: { contains: input }
            },
            {
              displayName: { contains: input }
            }
          ]
        },
      })
      return userSearchResults
      //return users
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async getUser(username: string, currentUser: string): Promise<any> {
    if (username === currentUser) {
      const userInfo = await this._db.prisma.user.findUnique({
        select: {
          username: true,
          displayName: true,
          profilePicture: true,
          _count: {
            select: {
              friends: true,
              UserCircle: true
            }
          },
          UserCircle: {
            select: {
              circle: {
                select: {
                  name: true,
                  picture: true,
                  id: true
                }
              }
            }
          },
          Album: {
            include: {
              photos: true,
              circle: {
                select: {
                  picture: true
                }
              },
              likes: {
                select: {
                  user: {
                    select: {
                      username: true,
                      profilePicture: true,
                    }
                  }
                }
              },
            }
          }
        },
        where: {
          username: username
        }
      })
      return userInfo;
    }
    const userInfo = await this._db.prisma.user.findUnique({
      select: {
        username: true,
        displayName: true,
        profilePicture: true,
        friendOf: true,
        requestReceived: {
          include: { requester: {} },
          where: { requesterName: currentUser }
        },
        requestsSent: {
          include: { requestee: {} },
          where: { requesteeName: currentUser }
        },
        _count: {
          select: {
            friends: true
          }
        },
      },
      where: {
        username: username,
      }
    })
    const sharedCircles = await this._db.prisma.circle.findMany({
      include: {
        albums: {
          select: {
            circle: {
              select: {
                picture: true,
              }
            },
            circleId: true,
            id: true,
            name: true,
            ownerName: true,
            photos: true,
            likes: {
              select: {
                user: {
                  select: {
                    username: true,
                    profilePicture: true
                  }
                }
              }
            }
          }
        }
      },
      where: {
        OR: [{
          AND: [
            { UserCircle: { some: { user: { username: username } } } },
            { UserCircle: { some: { user: { username: currentUser } } } }
          ]
        },
        {
          AND: [
            { isPublic: true },
            { UserCircle: { some: { user: { username: username } } } }
          ]
        }
        ],
      }
    })

    const circles: { circle: {} }[] = [];
    const albums: any[] = [];

    sharedCircles.forEach((obj) => {
      obj.albums.forEach((album) => {
        albums.push(album)
      })
      circles.push({ circle: obj })
    })
    const compiledObj: any = userInfo

    compiledObj.UserCircle = circles;
    compiledObj.Album = albums;
    compiledObj._count.UserCircle = circles.length

    return compiledObj;
  }
  async ifEmailTaken(email: string): Promise<boolean> {
    const user = await this._db.prisma.user.findUnique({
      where: { email: email }
    })
    if (!user) {
      return true
    } else {
      return false
    }
  }
  async getProfilePicture(username: string): Promise<string> {
    const user = await this._db.prisma.user.findUnique({
      where: {
        username: username
      },
      select: {
        profilePicture: true
      }
    })
    if (!user) {
      return "/placeholder_image.svg"
    }
    return user.profilePicture
  }

  async getFeed(username: string): Promise<string> {
    try {
      const friends = await this._db.prisma.friend.findMany({
        where: {
          friend_1_name: username
        },
        select: {
          friend_2_name: true
        }
      })

      const friendAlbums: any = [];

      for await (const friend of friends) {
        const albums = await this._db.prisma.album.findMany({
          where: {
            OR: [{
              circle: {
                isPublic: true
              },
              ownerName: friend.friend_2_name
            },
            {
              circle: {
                UserCircle: { some: { user: { username: username } } }
              },
              ownerName: friend.friend_2_name
            }]
          },
          orderBy: {
            createdAt: "desc"
          },
          include: {
            likes: {
              select: {
                user: {
                  select: {
                    username: true,
                    profilePicture: true,
                  }
                }
              }
            },
            owner: {
              select: {
                displayName: true,
                username: true,
                profilePicture: true
              }
            },
            circle: {
              select: {
                picture: true
              }
            },
            photos: true
          }
        })
        if (albums.length) {
          albums.forEach((album) => {
            friendAlbums.push(album)
          })
        }
      }

      friendAlbums.sort((a: any, b: any) => b.createdAt - a.createdAt)

      return friendAlbums
    } catch (err) {
      throw err;
    }

  }
  async updateProfilePicture(currentUser: string, src: string): Promise<void> {
    try {
      await this._db.prisma.user.update({
        where: {
          username: currentUser
        },
        data: {
          profilePicture: src
        }
      })
    } catch (err) {

    }
  }
  async updateDisplayName(currentUser: string, name: string): Promise<void> {
    try {
      await this._db.prisma.user.update({
        where: {
          username: currentUser
        },
        data: {
          displayName: name
        }
      })
    } catch (err) {

    }
  }
  async getInfoForMap(username: string): Promise<any> {
    const albums = await this._db.prisma.user.findUnique({
      where: {
        username: username
      },
      include: {
        Album: {
          where: {
            NOT: {
              lat: null,
              long: null
            }
          },
          include: {
            photos: {

            }
          }
        }
      }
    })
    console.log(albums)
    return albums
  }
}
