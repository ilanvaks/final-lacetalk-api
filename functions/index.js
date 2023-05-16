import functions from "firebase-functions"
import express from "express"
import cors from "cors"

import { getAllSneakers, addSneaker, updateSneaker, deleteSneaker, voteUpSneaker, voteDownSneaker } from "./src/sneakers.js"

const PORT = 3000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/hello", (req, res)=>{
res.send("Hello World")
})
app.get('/sneaker', getAllSneakers)
app.post('/sneaker', addSneaker)
app.post('/sneakers/:sneakerId/voteUp', voteUpSneaker);
app.post('/sneakers/:sneakerId/voteDown', voteDownSneaker);
app.delete('/sneaker/:sneakerId', deleteSneaker)
app.patch('/sneaker/:sneakerId', updateSneaker)

// app.listen(PORT, () => {
//   console.log(`Listening on http://localhost:${PORT}...`)
// })

export const api = functions.https.onRequest(app)
