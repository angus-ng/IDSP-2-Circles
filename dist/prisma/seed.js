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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const a = yield prisma.user.upsert({
            where: { email: 'a@a.com' },
            update: {},
            create: {
                email: 'a@a.com',
                username: "A_A",
                password: yield (0, bcrypt_1.hash)("a", 12),
                profilePicture: "https://i.chzbgr.com/full/9578395904/h8D57C6EF/isnt-it-cute",
            },
        });
        const b = yield prisma.user.upsert({
            where: { email: 'b@b.com' },
            update: {},
            create: {
                email: 'b@b.com',
                username: "B_B",
                password: yield (0, bcrypt_1.hash)("b", 12),
                profilePicture: "https://static.wikia.nocookie.net/character-catalogue/images/c/c2/Takoyaki_Cat.png/revision/latest?cb=20230810135739",
            },
        });
        const c = yield prisma.user.upsert({
            where: { email: 'c@c.com' },
            update: {},
            create: {
                email: 'c@c.com',
                username: "C_C",
                password: yield (0, bcrypt_1.hash)("c", 12),
                profilePicture: "https://i.pinimg.com/550x/0a/b8/6d/0ab86dfd4bc698ce4f57a8e06a6ca6d1.jpg",
            },
        });
        console.log({ a, b, c });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
