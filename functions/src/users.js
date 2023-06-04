import { db } from "./dbConnect.js";
import { hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { secretKey, salt } from '../secrets.js';

const userColl = db.collection("users");

export async function registerUser(req, res) {
  const { email, password } = req.body;

  const check = await userColl.findOne({email: email.toLowerCase()})
  if(check) {
    res.status(401).send({message: 'Email already in use, please try logging in.'})
    return
  }

  const hashedPassword = hashSync(password, salt);
  await userColl.insertOne({ email: email.toLowerCase(), password: hashedPassword }); 
  res.status(201).send({ message: "User registered" });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const hashedPassword = hashSync(password, salt); // Hash the password first

  const user = await userColl.findOne({ email: email.toLowerCase(), password: hashedPassword });
  if (!user) return res.status(400).send('Invalid email or password.');

  delete user.password; 
  const token = generateAuthToken(user);
  res.header('x-auth-token', token).send({
      _id: user._id,
      username: user.username
  });
}


function generateAuthToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '1h' }); 
}

export const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
  } catch (ex) {
      res.status(400).send('Invalid token.');
  }
}

// Add getUser function to retrieve user based on id
export async function getUser(req, res) {
  const { id } = req.params;
  const user = await userColl.findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(404).send('User not found.');
  res.send(user);
}

// Add deleteUser function to delete user based on id
export async function deleteUser(req, res) {
  const { id } = req.params;
  const result = await userColl.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return res.status(404).send('User not found.');
  res.send({ message: "User deleted" });
}
