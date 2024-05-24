"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const PrismaClient_1 = __importDefault(require("../../../PrismaClient"));
class UserService {
    constructor() {
        this._db = PrismaClient_1.default.getInstance();
    }
    friend(requester, requestee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this._db.prisma.friendRequest.findUnique({
                    where: {
                        requesterName_requesteeName: {
                            requesteeName: requestee,
                            requesterName: requester
                        }
                    }
                });
                if (exists) {
                    return;
                }
                const friendRequest = yield this._db.prisma.friendRequest.findUnique({
                    where: {
                        requesterName_requesteeName: {
                            requesteeName: requester,
                            requesterName: requestee
                        },
                        status: false
                    }
                });
                if (friendRequest) {
                    return yield this.acceptRequest(requestee, requester);
                }
                yield this._db.prisma.friendRequest.create({
                    data: {
                        requesteeName: requestee,
                        requesterName: requester,
                        status: false
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    unfriend(friend_1_name, friend_2_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._db.prisma.friend.delete({
                    where: {
                        friend_1_name_friend_2_name: {
                            friend_1_name: friend_1_name,
                            friend_2_name: friend_2_name
                        }
                    }
                });
                yield this._db.prisma.friend.delete({
                    where: {
                        friend_1_name_friend_2_name: {
                            friend_1_name: friend_2_name,
                            friend_2_name: friend_1_name
                        }
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getFriends(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return;
            }
            try {
                const listOfFriendName = [];
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        username: username
                    },
                    include: {
                        friends: {},
                        friendOf: {}
                    }
                });
                if (!user) {
                    return;
                }
                for (let friend of user.friends) {
                    listOfFriendName.push(friend.friend_2_name);
                }
                const listOfFriends = [];
                for (let username of listOfFriendName) {
                    const user = yield this._db.prisma.user.findUnique({
                        select: {
                            username: true,
                            displayName: true,
                            profilePicture: true
                        },
                        where: {
                            username: username
                        }
                    });
                    listOfFriends.push(user);
                }
                //@ts-ignore
                return listOfFriends;
            }
            catch (error) {
                throw new Error("Unable to find friends");
            }
        });
    }
    getActivities(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friendRequests = yield this._db.prisma.friendRequest.findMany({
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
                });
                const circleInvites = yield this._db.prisma.circleInvite.findMany({
                    where: {
                        invitee_username: username
                    }, include: {
                        circle: {}
                    }
                });
                const activities = {
                    friendRequests: friendRequests,
                    circleInvites: circleInvites,
                };
                return activities;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    acceptRequest(requester, requestee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friendRequest = yield this._db.prisma.friendRequest.findUnique({
                    where: {
                        requesterName_requesteeName: {
                            requesteeName: requestee,
                            requesterName: requester
                        },
                        status: false
                    }
                });
                if (friendRequest) {
                    yield this._db.prisma.friendRequest.delete({
                        where: {
                            requesterName_requesteeName: {
                                requesteeName: requestee,
                                requesterName: requester
                            }
                        }
                    });
                    yield this._db.prisma.friend.create({
                        data: {
                            friend_1_name: requestee,
                            friend_2_name: requester
                        }
                    });
                    yield this._db.prisma.friend.create({
                        data: {
                            friend_1_name: requester,
                            friend_2_name: requestee
                        }
                    });
                    return;
                }
                else {
                    throw new Error("You have not been friend requested by this user");
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    removeRequest(user1, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friendRequestReceive = yield this._db.prisma.friendRequest.findUnique({
                    where: {
                        requesterName_requesteeName: {
                            requesteeName: user1,
                            requesterName: user2
                        },
                        status: false
                    }
                });
                const friendRequestSent = yield this._db.prisma.friendRequest.findUnique({
                    where: {
                        requesterName_requesteeName: {
                            requesteeName: user2,
                            requesterName: user1
                        },
                        status: false
                    }
                });
                if (friendRequestReceive) {
                    yield this._db.prisma.friendRequest.delete({
                        where: {
                            requesterName_requesteeName: {
                                requesteeName: user1,
                                requesterName: user2
                            },
                            status: false
                        }
                    });
                }
                if (friendRequestSent) {
                    yield this._db.prisma.friendRequest.delete({
                        where: {
                            requesterName_requesteeName: {
                                requesteeName: user2,
                                requesterName: user1
                            },
                            status: false
                        }
                    });
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    search(input, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSearchResults = yield this._db.prisma.user.findMany({
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
                });
                return userSearchResults;
                //return users
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getUser(username, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username === currentUser) {
                const userInfo = yield this._db.prisma.user.findUnique({
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
                });
                return userInfo;
            }
            const userInfo = yield this._db.prisma.user.findUnique({
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
            });
            const sharedCircles = yield this._db.prisma.circle.findMany({
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
            });
            const circles = [];
            const albums = [];
            sharedCircles.forEach((obj) => {
                obj.albums.forEach((album) => {
                    albums.push(album);
                });
                circles.push({ circle: obj });
            });
            const compiledObj = userInfo;
            compiledObj.UserCircle = circles;
            compiledObj.Album = albums;
            compiledObj._count.UserCircle = circles.length;
            return compiledObj;
        });
    }
    ifEmailTaken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: { email: email }
            });
            if (!user) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getProfilePicture(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: username
                },
                select: {
                    profilePicture: true
                }
            });
            if (!user) {
                return "/placeholder_image.svg";
            }
            return user.profilePicture;
        });
    }
    getFeed(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                const friends = yield this._db.prisma.friend.findMany({
                    where: {
                        friend_1_name: username
                    },
                    select: {
                        friend_2_name: true
                    }
                });
                const friendAlbums = [];
                try {
                    for (var _d = true, friends_1 = __asyncValues(friends), friends_1_1; friends_1_1 = yield friends_1.next(), _a = friends_1_1.done, !_a; _d = true) {
                        _c = friends_1_1.value;
                        _d = false;
                        const friend = _c;
                        const albums = yield this._db.prisma.album.findMany({
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
                        });
                        if (albums.length) {
                            albums.forEach((album) => {
                                friendAlbums.push(album);
                            });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = friends_1.return)) yield _b.call(friends_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                friendAlbums.sort((a, b) => b.createdAt - a.createdAt);
                return friendAlbums;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.UserService = UserService;
