import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://bitoutawalid:ee6w2lnn4i14DCd9@cluster0.lz5skuo.mongodb.net/protein_db?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.DB_NAME || "protein_db";

let cachedClient: MongoClient | null = null;

export async function GET() {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {});
    await cachedClient.connect();
  }
  const db = cachedClient.db(dbName);
  const keywords = await db.collection("keywords").find({}).toArray();
  return NextResponse.json(keywords);
}