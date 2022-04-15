import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ethers } from "ethers";

const App = () => {
  const [address, setAddress] = useState(
    "0x825206207a91480716a2dBE07aA0105bA9f0c975"
  );
  const [transactions, setTransactions] = useState({
    profit:0,
    loss:0,
  });

  const [data, setdata] = useState({
    address1: "",
    Balance: null,
  });

  const btnhandler = () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };
  const getbalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        setdata({
          Balance: ethers.utils.formatEther(balance),
        });
      });
  };
  const accountChangeHandler = (account) => {
    // Setting an address data
    setdata({
      address1: account,
    });
    // Setting a balance
    getbalance(account);
    console.log(account);
  };

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const getTransactions = async () => {
    let tempUrl = `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=0xD92E713d051C37EbB2561803a3b5FBAbc4962431&address=${address}&page=1&offset=100&sort=desc&apikey=S6NDTUZUY36D92HS821DVEH7IHX3F8MMTD`;

    const x = await fetch(tempUrl);
    const resp = await x.json();

    setTransactions(resp.result);
  };

  const getDate = (unix) => {
    let t = new Date(unix * 1000);

    return t.toLocaleString();
  };

  return (
    <div className="App">
      <h1>Anytime Accounting</h1>

      <hr />
      <Button onClick={btnhandler} variant="primary">
        Connect to wallet
      </Button>

      <input onChange={handleInputChange} value={address} />
      <button onClick={getTransactions}>Submit </button>

      <div>
        <h2> Debits </h2>
        {transactions
          .filter((txn) => txn.from.toUpperCase() === address.toUpperCase())
          .map((txn) => {
            return (
              <div key={txn.hash}>
                <h4> {txn.blockNumber} </h4>
                <p> from : {txn.from} </p>
                <p> to : {txn.to} </p>
                <p>
                  value : {txn.value / 1000000} {txn.tokenSymbol}
                </p>

                <p>time :{getDate(txn.timeStamp)}</p>
              </div>
            );
          })}

        <h2> Credits </h2>
        {transactions
          .filter((txn) => txn.from.toUpperCase() !== address.toUpperCase())
          .map((txn) => {
            return (
              <div key={txn.hash}>
                <h4> {txn.blockNumber} </h4>
                <p> from : {txn.from} </p>
                <p> to : {txn.to} </p>
                <p>
                  value : {txn.value / 1000000} {txn.tokenSymbol}
                </p>
                <p>time :{getDate(txn.timeStamp)}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default App;
