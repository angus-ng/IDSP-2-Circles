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
exports.UserService = void 0;
const PrismaClient_1 = __importDefault(require("../../../PrismaClient"));
class UserService {
    constructor() {
        this._db = PrismaClient_1.default.getInstance();
    }
    follow(followerName, followingName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._db.prisma.follows.create({
                    data: {
                        //@ts-ignore
                        followerName: followerName,
                        followingName: followingName
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    unfollow(followerName, followingName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._db.prisma.follows.deleteMany({
                    where: {
                        //@ts-ignore
                        followerName: followerName,
                        followingName: followingName
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getFollowers(followingName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!followingName) {
                return;
            }
            try {
                const listOfFollowers = [];
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        username: followingName
                    },
                    include: {
                        followers: {
                            include: {
                                follower: true
                            }
                        }
                    }
                });
                if (!user) {
                    return;
                }
                for (let follower of user.followers) {
                    listOfFollowers.push(follower.follower.username);
                }
                return listOfFollowers;
            }
            catch (error) {
                throw new Error("Unable to find followings");
            }
        });
    }
    getFollowing(followerName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!followerName) {
                return;
            }
            try {
                const listOfFollowings = [];
                const user = yield this._db.prisma.user.findUnique({
                    where: {
                        username: followerName
                    },
                    include: {
                        following: {
                            include: {
                                following: true
                            }
                        }
                    }
                });
                if (!user) {
                    return;
                }
                for (let following of user.following) {
                    listOfFollowings.push(following.following.username);
                }
                return listOfFollowings;
            }
            catch (error) {
                throw new Error("Unable to find followings");
            }
        });
    }
}
exports.UserService = UserService;
