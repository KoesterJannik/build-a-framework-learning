import { MongoClient, Db } from "mongodb";

export let db: Db;

export async function connectToDb(connectionString: string, dbName: string) {
  try {
    const client = await MongoClient.connect(connectionString);
    db = client.db(dbName) as Db;
    return db;
  } catch (error) {
    console.log(error);
  }
}
