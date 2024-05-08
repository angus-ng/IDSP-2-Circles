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
                    }
                });
                //make the explicit circle user relationship
                if (createdCircle) {
                    yield this._db.prisma.userCircle.create({
                        data: {
                            userId: creator.id,
                            circleId: createdCircle.id
                        }
                    });
                }
            }
        });
    }
    deleteCircle(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    checkMembership(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: currentUser
                }
            });
            const membership = yield this._db.prisma.userCircle.findFirst({
                where: {
                    userId: String(user.id),
                    circleId: id
                }
            });
            if (!membership) {
                return false;
            }
            return true;
        });
    }
    getCircle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const circle = yield this._db.prisma.circle.findUnique({
                where: {
                    id: id
                }
            });
            return circle;
        });
    }
    listCircles(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: currentUser
                }
            });
            const circleArr = yield this._db.prisma.userCircle.findMany({
                select: {
                    circle: true
                },
                where: {
                    userId: user.id
                }
            });
            console.log(circleArr);
            return circleArr;
        });
    }
}
exports.CircleService = CircleService;
