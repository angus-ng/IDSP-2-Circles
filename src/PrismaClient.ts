//NOTE - IGNORE THIS FILE FOR NOW
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { Client, createClient } from "@libsql/client";

class DBClient {
  public prisma: PrismaClient;
  public libSQL: Client;
  private static instance: DBClient;
  private constructor() {

    const libsql = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`
    });
    const adapter = new PrismaLibSQL(libsql)
    // @ts-ignore
    this.prisma = new PrismaClient({ adapter });
    this.libSQL = libsql;
  }

  // Use singleton to avoid creating unnecesary connections
  public static getInstance = () => {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  };
}

export default DBClient;