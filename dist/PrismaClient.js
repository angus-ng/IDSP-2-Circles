"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE - IGNORE THIS FILE FOR NOW
const client_1 = require("@prisma/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("@libsql/client");
class DBClient {
    constructor() {
        const libsql = (0, client_2.createClient)({
            url: `${process.env.TURSO_DATABASE_URL}`,
            authToken: `${process.env.TURSO_AUTH_TOKEN}`
        });
        const adapter = new adapter_libsql_1.PrismaLibSQL(libsql);
        // @ts-ignore
        this.prisma = new client_1.PrismaClient({ adapter });
        this.libSQL = libsql;
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
