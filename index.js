

const express = require("express");
const { userModel } = require("./model");
const { Keypair, Transaction,Connection } = require("@solana/web3.js");
const app = express();
const PORT = 3000
const jwt  = require("jsonwebtoken")
const JWT_SECRET = "123456" 
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a")

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


app.get("/api/v1/txn/sign",async(req, res)=>{
    const serializedTransaction = req.body.message;
    const tx = Transaction.from(serializedTransaction)


    //get private key from the db and then get it to sign the transaction
    // const user = await userModel.find({
    //     where:{
    //         _id: "..."
    //     }
    // })
    // const privateKey = user.privateKey
const keyPair = Keypair.fromSecretKey(privateKey);

    tx.sign(keyPair)
   const transactionDone = await connection.sendTransaction(tx)
    res.json({
        "message":"txn check endpoint"
    })
})

app.get("/api/v1/clear",async (req,res)=>{
    console.log("deletion initiated")
    const del = await userModel.collection.drop()
    console.log("deleted")
    res.json({
        del
    })
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

