
import {useState} from 'react';

const App = () => {

  const [address, setAddress] = useState('0x825206207a91480716a2dBE07aA0105bA9f0c975');
  const [transactions, setTransactions] = useState([]);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  }

  const getTransactions = async () => {
    let tempUrl = `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=0xD92E713d051C37EbB2561803a3b5FBAbc4962431&address=${address}&page=1&offset=100&sort=desc&apikey=S6NDTUZUY36D92HS821DVEH7IHX3F8MMTD`

    const x = await fetch (tempUrl);
    const resp = await x.json();

    setTransactions (resp.result);


    console.log (transactions);
  } 

  return (
    <div className="App">
      <h1>Anytime Accounting</h1>

      <hr />

      <input onChange = {handleInputChange} value = {address}/>
      <button onClick = {getTransactions}>Submit </button>

      <div> 

      <h2> Debits </h2>
      {
        transactions.map ((txn) => {
         return  <div key = {txn.hash}> 
              <h4> {txn.blockNumber} </h4>
              <p> from : { txn.from } </p>
              <p> to  : { txn.to } </p> 
              <p> value : { (txn.value)} {txn.tokenSymbol}</p>


              {let hours = Math.floor(txn.timeStamp / 60 / 60)
            let minutes = Math.floor((txn.timeStamp - hours * 60 * 60) / 60)
            let seconds = Math.floor(txn.timeStamp - hours * 60 * 60 - minutes * 60 )
            let duration = hours + ':' + minutes + ':' + seconds}

<p> time : { duration } </p>
            </div>
        
        })
      }

      {/* <h2> Credits </h2>

      {
        transactions.map ((txn) => {
          return (

            <div key = {txn.hash}> 
              <h2> {txn.blockNumber} </h2>
              <p> from : { txn.from } </p>
              <p> to  : { txn.to } </p> 
              <p> value : { (txn.value)} {(txn.value !== ' ') && txn.tokenSymbol}</p>
            </div>
          )
        })
      } */}

      </div>

    </div>
  );
}

export default App;
