import { hashSync } from "bcrypt";
import jwt  from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { secretKey } from "../secrets.js";
import { userCollection } from "./dbConnect.js";
import { genSalt, compareSync } from "bcrypt";

const collection = db.collection('users')



