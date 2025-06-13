import { useState } from 'react'
import './App.css'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import axios from 'axios'

function App() {
  const connection = new Connection(import.meta.env.VITE_CONNECTION_STRING)
  const fromPubKey = new PublicKey(import.meta.env.VITE_FROM_PUBKEY)
  const toPubKey = new PublicKey(import.meta.env.VITE_TO_PUBKEY)
  const [signature, setSignature] = useState("");

  const [count, setCount] = useState(0)
  
  async function sendSol(){
    const instruction = SystemProgram.transfer({
      fromPubkey:fromPubKey,
      toPubkey:toPubKey,
      lamports: 0.001 * LAMPORTS_PER_SOL

    })
    

    const tx = new Transaction().add(instruction)

    let {blockhash} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash

    tx.feePayer = fromPubKey
    //convert transaction to a seralize format (0 and 1) to send it over the wire
    const serializedTX = tx.serialize({
      requireAllSignatures: false,
    /** Verify provided signatures (default: true) */
    verifySignatures: false
    })

    console.log(serializedTX);
    
    const response = await axios.post("http://localhost:3000/api/v1/txn/sign",{
      message: serializedTX,
      retry: false
    })

    setSignature(await response.data.response.transactionDone)
    setTimeout(()=>{
    console.log(response.data.response.transactionDone)

    },1000)
  }

  return (
    <>
    <div>
      On pressing the button it will send 0.001 sol from user account hardcoded in frontend to the user PublicKey
      <br />

      <input type="text" placeholder='username'/>
      <input type="text" placeholder='password'  />
      <input type="text" placeholder='Amount' />
      <div>
        Transation signature: <p>{signature}</p> 
      </div>
      <button onClick={sendSol}>Send transaction</button>
    </div>
    </>
  )
}

export default App
