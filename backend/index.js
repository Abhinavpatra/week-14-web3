

const express = require("express");
const { userModel } = require("./model");
const { Keypair, Transaction,Connection } = require("@solana/web3.js");
const cors = require("cors")
const bs58 = require("bs58")

require('dotenv').config()
const app = express();
const PORT = 3000
const jwt  = require("jsonwebtoken")
const JWT_SECRET = "123456" 
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a")

app.use(cors())
app.use(express.json())

app.post('/api/v1/signup',async (req, res)=>{

    const username = req.body.username;
    const password = req.body.password;
    const keyPair = await new Keypair()

    // validate using zod, 
    const user = await userModel.create({
        username,
        password,
        publicKey: keyPair.publicKey.toString(),
        privateKey: keyPair.secretKey.toString(), // in uint8 array form it will be stored
    })
    console.log(user);
    res.json({
        "message":"Signup endpoint",
        "user PublicKey": keyPair.publicKey.toString() 
    })    
})

app.post("/api/v1/signin",(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = userModel.findOne({
        username: username,
        password: password
    })
    if(!user){
        res.json({
            "message":"no such user exists"
        })
    }
    const token  = jwt.sign({
        id: user
    }, JWT_SECRET)
    res.json({
        token
    })

    res.json({
        "message":"signing a transation endpoint"
    })
})


app.post("/api/v1/txn/sign",async(req, res)=>{
    const serializedTransaction = req.body.message;
    const tx = Transaction.from(Buffer.from(serializedTransaction))


    //get private key from the db and then get it to sign the transaction
    // const user = await userModel.find({
    //     where:{
    //         _id: "..."
    //     }
    // })
    // const privateKey = user.privateKey
    
    console.log("hi0")
    const privateKeyBase58 =  bs58.default.decode(process.env.PRIVATE_KEY)
    // since private key is in s string format.
    console.log("hi0.5")
    const keyPair = Keypair.fromSecretKey(privateKeyBase58);
    
    console.log("hi1")
    tx.sign(keyPair)
    console.log("hi2");

    const transactionDone = await connection.sendTransaction(tx,[keyPair])

   console.log(transactionDone)
    res.json({
        "message":"txn check endpoint",
        "response":{transactionDone}
    })


})

app.get("/api/v1/clear",async (req,res)=>{
//     const keyPaircheck = Keypair.fromSecretKey(bs58.default.decode("61M33n6JayssjygFpQ6dWLPeZmgM19mNiY6kE8VctzPfMYLQj8mEqVu2E9bxa4oAiGGufQwT6c8CpkKtvF21aN1P"));
// console.log(keyPaircheck.publicKey)

    console.log("deletion initiated")
    const del = await userModel.collection.drop()
    console.log("deleted")
    res.json({
        del
    })
})


app.get("/test",(req,res)=>{

    console.log(process.env.PRIVATE_KEY)
    res.json({
        "hi":"bye"
    })
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})