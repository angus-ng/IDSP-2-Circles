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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleService = void 0;
const node_crypto_1 = require("node:crypto");
const PrismaClient_1 = __importDefault(require("../../../PrismaClient"));
class CircleService {
    constructor() {
        this._db = PrismaClient_1.default.getInstance();
    }
    createCircle(newCircleInput) {
        return __awaiter(this, void 0, void 0, function* () {
            //find the logged in user from db
            const creator = yield this._db.prisma.user.findUnique({
                where: {
                    username: newCircleInput.creator
                }
            });
            if (creator) {
                //make the circle
                const createdCircle = yield this._db.prisma.circle.create({
                    data: {
                        name: newCircleInput.name,
                        picture: newCircleInput.picturePath,
                        ownerId: creator.username,
                        isPublic: newCircleInput.isPublic
                    }
                });
                //make the explicit circle user relationship
                if (createdCircle) {
                    yield this._db.prisma.userCircle.create({
                        data: {
                            username: creator.username,
                            circleId: createdCircle.id,
                            mod: true
                        }
                    });
                }
                return createdCircle;
            }
            return null;
        });
    }
    deleteCircle(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        username: currentUser
                    }
                });
                const circle = yield this._db.prisma.circle.findUnique({
                    where: {
                        id: id
                    }
                });
                if (!user || !circle || circle.ownerId !== user.username) {
                    throw new Error("insufficient permissions");
                }
                // delete circle
                yield this._db.prisma.circle.delete({
                    where: {
                        id: id,
                    },
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    checkMembership(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        username: currentUser
                    }
                });
                const membership = yield this._db.prisma.userCircle.findFirst({
                    where: {
                        username: String(user.username),
                        circleId: id
                    }
                });
                if (!membership) {
                    return false;
                }
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    checkPublic(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPublic = yield this._db.prisma.circle.findUnique({
                    where: {
                        id: id
                    }
                });
                if (isPublic) {
                    return isPublic.isPublic;
                }
                return null;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
    }
    getCircle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circle = yield this._db.prisma.circle.findUnique({
                    include: {
                        albums: {
                            select: {
                                id: true,
                                circleId: true,
                                name: true,
                                photos: {
                                    take: 1
                                },
                                likes: true
                            }
                        }
                    },
                    where: {
                        id: id
                    }
                });
                return circle;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getMembers(circleId) {
        return __awaiter(this, void 0, void 0, function* () {
            let members = yield this._db.prisma.userCircle.findMany({
                select: {
                    user: {
                        select: {
                            username: true,
                            profilePicture: true,
                            displayName: true
                        }
                    },
                    mod: true
                },
                where: {
                    circleId: circleId
                }
            });
            const owner = yield this._db.prisma.circle.findUnique({
                where: {
                    id: circleId
                },
                select: {
                    ownerId: true
                }
            });
            members = members.map((member) => {
                if (member.user.username === (owner === null || owner === void 0 ? void 0 : owner.ownerId)) {
                    member.user.owner = true;
                }
                return member;
            });
            return members;
        });
    }
    inviteToCircle(username, circleName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inviteExists = yield this._db.prisma.circleInvite.findFirst({
                    where: {
                        invitee_username: username,
                        circleId: circleName
                    }
                });
                if (!inviteExists) {
                    const circle = yield this._db.prisma.circleInvite.create({
                        data: {
                            invitee_username: username,
                            circleId: circleName
                        }, include: {
                            circle: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    });
                    return circle.circle.name;
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    acceptInvite(id, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circleInvite = yield this._db.prisma.circleInvite.findUnique({
                    where: {
                        invitee_username_circleId: {
                            circleId: id,
                            invitee_username: username
                        }
                    }, include: {
                        circle: {
                            select: {
                                name: true,
                                UserCircle: {
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        },
                    }
                });
                if (circleInvite) {
                    yield this._db.prisma.circleInvite.delete({
                        where: {
                            invitee_username_circleId: {
                                circleId: id,
                                invitee_username: username
                            }
                        }
                    });
                    yield this._db.prisma.userCircle.create({
                        data: {
                            username: username,
                            circleId: id
                        }
                    });
                    const members = circleInvite.circle.UserCircle.map(obj => obj.username);
                    return { circleName: circleInvite.circle.name, members: members };
                }
                else {
                    throw new Error("Failed to accept circle invite");
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    removeRequest(id, invitee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circleInviteReceive = yield this._db.prisma.circleInvite.delete({
                    where: {
                        invitee_username_circleId: {
                            invitee_username: invitee,
                            circleId: id
                        }
                    }
                });
            }
            catch (err) {
                return;
            }
        });
    }
    updateCircle(currentUser, circleObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const circle = yield this._db.prisma.circle.findUnique({
                where: {
                    id: circleObj.circleId,
                    OR: [{
                            ownerId: currentUser
                        },
                        {
                            UserCircle: {
                                some: {
                                    username: currentUser,
                                    circleId: circleObj.circleId,
                                    mod: true
                                }
                            }
                        }
                    ]
                }
            });
            if (!circle) {
                throw new Error("insufficient permissions");
            }
            const updatedCircle = yield this._db.prisma.circle.update({
                where: {
                    id: circleObj.circleId
                },
                data: {
                    picture: circleObj.circleImg,
                    name: circleObj.circleName,
                    isPublic: circleObj.isPublic
                }, include: {
                    UserCircle: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            const circleInfo = Object.assign(Object.assign({}, updatedCircle), { members: updatedCircle.UserCircle.map((obj => obj.username)) });
            return circleInfo;
        });
    }
    mod(modHelperObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circle = yield this._db.prisma.circle.findUnique({
                    where: {
                        id: modHelperObj.circleId
                    }
                });
                if (!circle) {
                    throw new Error("circle not found");
                }
                if (circle.ownerId !== modHelperObj.loggedInUser) {
                    throw new Error("insufficient permissions");
                }
                const relation = yield this._db.prisma.userCircle.findUnique({
                    where: {
                        username_circleId: {
                            username: modHelperObj.member,
                            circleId: circle.id
                        }
                    }
                });
                if (!relation) {
                    throw new Error("user is not a member of the circle");
                }
                yield this._db.prisma.userCircle.update({
                    where: {
                        username_circleId: {
                            username: modHelperObj.member,
                            circleId: circle.id
                        }
                    },
                    data: {
                        mod: !(relation.mod)
                    }
                });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    removeUser(userHelper) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circle = yield this._db.prisma.circle.findUnique({
                    where: {
                        id: userHelper.circleId
                    }
                });
                if (!circle) {
                    throw new Error("missing circle");
                }
                if (userHelper.member === circle.ownerId) {
                    throw new Error("Cannot remove the owner");
                }
                if (userHelper.loggedInUser === circle.ownerId) {
                    yield this._db.prisma.userCircle.delete({
                        where: {
                            username_circleId: {
                                username: userHelper.member,
                                circleId: circle.id
                            }
                        }
                    });
                }
                else {
                    const members = yield this.getMembers(userHelper.circleId);
                    const found = members.find((member) => member.user.username === userHelper.loggedInUser);
                    if (!found) {
                        throw new Error("you are not a member of the circle");
                    }
                    if (found.mod === false) {
                        throw new Error("insufficient permissions");
                    }
                    else {
                        const removeUser = members.find((member) => member.user.username === userHelper.member);
                        if (removeUser && (removeUser.mod !== true)) {
                            yield this._db.prisma.userCircle.delete({
                                where: {
                                    username_circleId: {
                                        username: userHelper.member,
                                        circleId: circle.id
                                    }
                                }
                            });
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    createShareLink(shareHelper) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const circle = yield this._db.prisma.circle.findUnique({
                    where: {
                        id: shareHelper.circleId
                    },
                    select: {
                        ownerId: true,
                        UserCircle: true
                    }
                });
                if (!circle) {
                    throw new Error("could not find circle");
                }
                let isMod = false;
                const member = circle.UserCircle.find((user) => {
                    user.username === shareHelper.loggedInUser;
                });
                if (member) {
                    isMod = member.mod;
                }
                if (shareHelper.loggedInUser === circle.ownerId || isMod) {
                    const expiry = new Date(new Date().setDate(new Date().getDate() + 7));
                    const token = yield this._db.prisma.token.create({
                        data: {
                            expiresAt: expiry,
                            creatorId: shareHelper.loggedInUser,
                            circleId: shareHelper.circleId,
                            accessToken: (0, node_crypto_1.randomUUID)()
                        }
                    });
                    return `/circle/${shareHelper.circleId}/view/${token.accessToken}`;
                }
                else {
                    throw new Error("insufficient permissions to create share link");
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getCircleWithToken(circleId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenObj = yield this._db.prisma.token.findFirst({
                    where: {
                        circleId: circleId,
                        accessToken: token
                    }
                });
                const requestTime = new Date();
                if (!tokenObj || (tokenObj.expiresAt.valueOf() - requestTime.valueOf()) <= 0) {
                    throw new Error("invalid request");
                }
                const circle = yield this._db.prisma.circle.findUnique({
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                        albums: {
                            select: {
                                _count: {
                                    select: {
                                        photos: true
                                    }
                                },
                                name: true,
                                photos: {
                                    select: {
                                        src: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                UserCircle: true
                            }
                        }
                    },
                    where: {
                        id: circleId
                    }
                });
                return circle;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.CircleService = CircleService;
