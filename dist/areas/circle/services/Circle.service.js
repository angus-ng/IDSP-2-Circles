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
            console.log(newCircleInput);
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
                console.log(createdCircle);
                //make the explicit circle user relationship
                if (createdCircle) {
                    yield this._db.prisma.userCircle.create({
                        data: {
                            username: creator.username,
                            circleId: createdCircle.id
                        }
                    });
                }
                console.log("CREATED CIRCLE", createdCircle.id);
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
                    return;
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
                return isPublic.isPublic;
            }
            catch (err) {
                throw new Error(err);
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
    //   async listCircles (currentUser:string): Promise<{circle: Circle}[]> {
    //     try {
    //         const user = await this._db.prisma.user.findUnique({
    //             where: {
    //                 username: currentUser
    //             }
    //         })
    //         const circleArr = await this._db.prisma.userCircle.findMany({
    //             select: {
    //                 circle: true
    //             },
    //             where: {
    //                 username: user!.username
    //             }
    //         })
    //         console.log(circleArr)
    //         return circleArr;
    //     } catch (error:any) {
    //         throw new Error(error)
    //     }
    //   }
    getMembers(circleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this._db.prisma.userCircle.findMany({
                select: {
                    user: {
                        select: {
                            username: true,
                            profilePicture: true
                        }
                    }
                },
                where: {
                    circleId: circleId
                }
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
                    yield this._db.prisma.circleInvite.create({
                        data: {
                            invitee_username: username,
                            circleId: circleName
                        }
                    });
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
                    return;
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
                    ownerId: currentUser
                }
            });
            if (!circle) {
                throw new Error("insufficient permissions");
            }
            const updatedCircle = this._db.prisma.circle.update({
                where: {
                    id: circleObj.circleId
                },
                data: {
                    picture: circleObj.circleImg,
                    name: circleObj.circleName,
                    isPublic: circleObj.isPublic
                }
            });
            return updatedCircle;
        });
    }
}
exports.CircleService = CircleService;
