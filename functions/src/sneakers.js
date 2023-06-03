import { db } from "./dbConnect.js";
import { ObjectId } from "mongodb";

const coll = db.collection("lacetalk-collection")

//CRUD: GET

export async function getAllSneakers(req,res) {
  const mySneaker = await coll.find({}).toArray()
  res.send(mySneaker).status(200)
}

//Crud: POST 
export async function addSneaker(req,res) {
  const newSneaker = req.body
  await coll.insertOne(newSneaker)
  res.status(201).send({ message: "new sneaker added"})
}

//CRUD: Delete with updated list afterwards

export async function deleteSneaker(req, res) {
  try {
    const sneakerId = { "_id": new ObjectId(req.params.sneakerId)};
    await coll.deleteOne(sneakerId);
    // res.send(sneakerId).status(200)
    await getAllSneakers(req, res);
  } catch (error) {
    res.status(500).send({error: "An error occurred while deleting the sneaker."});
  }
}



//CRUD: Update

export async function updateSneaker(req,res) {
  const sneakerId = {"_id": new ObjectId(req.params.sneakerId)}
  const updateSneaker = { $set: req.body }
  const returnOption = { returnNewDocument: true}
  
  const query = await coll.findOneAndUpdate( sneakerId, updateSneaker, returnOption)
  await getAllSneakers(req,res)
  res.status(201).send({message: "Sneaker has been updated"})
  console.table(query.value)

}

// Thumbs Up
export async function voteUpSneaker(req, res) {
  try {
    const sneakerId = {"_id": new ObjectId(req.params.sneakerId)}
    const voteUp = { $inc: { thumbsUp: 1 } }

    await coll.findOneAndUpdate(sneakerId, voteUp, { returnOriginal: false });
    getAllSneakers(req, res)
  } catch (error) {
    res.status(500).send({error: "An error occurred while voting up."});
  }
}

// Thumbs Down
export async function voteDownSneaker(req, res) {
  try {
    const sneakerId = {"_id": new ObjectId(req.params.sneakerId)}
    const voteDown = { $inc: { thumbsDown: 1 } }
    await coll.findOneAndUpdate(sneakerId, voteDown, { returnOriginal: false });
    getAllSneakers(req, res)
  } catch (error) {
    res.status(500).send({error: "An error occurred while voting down."});
  }
}
