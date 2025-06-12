import { useState } from 'react'
import './App.css'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import axios from 'axios'

function App() {
  const connection = new Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a")
  const fromPubKey = new PublicKey("2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw")
  const toPubKey = new PublicKey("3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg")


  const [count, setCount] = useState(0)
  async function sendSol(){
    const instruction = SystemProgram.transfer({
      fromPubkey:fromPubKey,
      toPubkey:new PublicKey("3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg"),
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
    await axios.post("http://localhost:3000/api/v1/txn/sign",{
      message: serializedTX,
      retry: false
    })
  }

  return (
    <>
    <div>
      <input type="text" placeholder='username'/>
      <input type="text" placeholder='password'  />
      <input type="text" placeholder='Amount' />
      <button onClick={sendSol}>Send transaction</button>
    </div>
    </>
  )
}

export default App
