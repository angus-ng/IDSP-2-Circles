//NOTE - IGNORE THIS FILE FOR NOW
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { Client, createClient } from "@libsql/client";

class DBClient {
  public prisma: PrismaClient;
  public libSQL!: Client;
  
  private static instance: DBClient;
  private constructor() {
    if(process.env.NODE_ENV ==="production") {
      const libsql = createClient({
        url: `${process.env.TURSO_DATABASE_URL}`,
        authToken: `${process.env.TURSO_AUTH_TOKEN}`
      });

      this.prisma = new PrismaClient({ adapter });
      this.libSQL = libsql;
    } else {
      this.prisma = new PrismaClient()
    }
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