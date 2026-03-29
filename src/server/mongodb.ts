import { MongoClient, type Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __mongoDb: Db | undefined;
}

const DB_NAME = process.env.MONGODB_DB_NAME || "quran_api";

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing env var MONGODB_URI");
  }

  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(uri);
    await global.__mongoClient.connect();
  }

  if (!global.__mongoDb) {
    global.__mongoDb = global.__mongoClient.db(DB_NAME);
  }

  return global.__mongoDb;
}

