"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE - IGNORE THIS FILE FOR NOW
const client_1 = require("@prisma/client");
class DBClient {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
}
// Use singleton to avoid creating unnecesary connections
DBClient.getInstance = () => {
    if (!DBClient.instance) {
        DBClient.instance = new DBClient();
    }
    return DBClient.instance;
};
exports.default = DBClient;
