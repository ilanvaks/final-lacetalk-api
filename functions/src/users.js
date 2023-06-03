import { db } from "./dbConnect.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

const userColl = db.collection("users");

export async function registerUser(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await userColl.insertOne({ username, password: hashedPassword });
  res.status(201).send({ message: "User registered" });
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await userColl.findOne({ username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = generateAuthToken(user);
  res.header('x-auth-token', token).send({
      _id: user._id,
      username: user.username
  });
}

function generateAuthToken(user) {
  return jwt.sign({ _id: user._id }, 'your secret key', { expiresIn: '1h' });
}

export const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
      const decoded = jwt.verify(token, 'your secret key');
      req.user = decoded;
      next();
  } catch (ex) {
      res.status(400).send('Invalid token.');
  }
}
