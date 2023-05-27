import { MongoClient } from "mongodb";
import { mongoURI } from "../secrets.js";

const client = new MongoClient(mongoURI)

export const db = client.db('lacetalk')
export const userCollection = db.collection('users')


