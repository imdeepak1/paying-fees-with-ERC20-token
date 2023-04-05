import "./App.css";
import Web3 from "web3";
import React, { useState } from "react";
import { Table } from "react-bootstrap";

function App() {
  let accounts;
  const [ethAddress, setEthAddress] = useState("");
  const [storeHashTransaction, setStoreHashTransaction] = useState("");
  const [blockNumber, setBlockNumber] = useState("");

  async function loadweb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    const web3 = window.web3;
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  }

  const [formData, setFormData] = useState({
    name: "",
    contractId: "",
    projectName: "",
    projectedAmount: "",
    officeAddress: "",
    formSubmitDate: "",
    zip: "",
    signerName: "",
  });

  const onChangeHandle = (event) => {
    setFormData(() => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
  };

  const submitTransaction = async (event) => {
    event.preventDefault();
    const web3 = await loadweb3();
    const signature = await web3.eth.personal.sign(formData.name, accounts[0]);
    const recoveredSigner = await web3.eth.accounts.recover(
      formData.name,
      signature
    );
    const transactionIs = {
      from: recoveredSigner,
      contractId: formData.contractId,
      name: formData.name,
    };

    const responseIs = await fetch("http://localhost:3002/api/createContract", {
      method: "POST",
      body: JSON.stringify(transactionIs),
      headers: { "Content-Type": "application/json" },
    })
    const apiReponse = await responseIs.json();
    console.log("this is response txhash", await apiReponse);
    // setStoreHashTransaction(apiReponse.txHash.transactionHash);
    // setBlockNumber(apiReponse.txHash.blockNumber);
    // setEthAddress(apiReponse.contractAddress);
  };

  const signedContractToIPFS = async (event) => {
    event.preventDefault();
    const web3 = await loadweb3();

    const signature = await web3.eth.personal.sign(formData.name, accounts[0]);
    const recoveredSigner = await web3.eth.accounts.recover(
      formData.name,
      signature
    );

    const transactionIs = {
      from: recoveredSigner,
      contractId: formData.contractId,
      signerName: formData.signerName,
    };
    const reposnse = await fetch("http://localhost:3002/api/signContract", {
      method: "POST",
      body: JSON.stringify(transactionIs),
      headers: { "Content-Type": "application/json" },
    });
    const apiReponse = await reposnse.json();

    setStoreHashTransaction(apiReponse.txHash.transactionHash);
    setBlockNumber(apiReponse.txHash.blockNumber);
    setEthAddress(apiReponse.contractAddress);
    console.log("Receipt as returned by smart contract:", reposnse);
  };

  return (
    <div className="contianer">
      {" "}
      <div className="App">
        <div>
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <a className="navbar-brand" href="/">
                  Sign Contract DApp
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        aria-current="page"
                        href="/"
                      >
                        Home
                      </a>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="/"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Dropdown
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <form className="d-flex">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="badge bg-secondary" type="submit">
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </nav>
          </div>
          <div className="centered">
            {" "}
            <p>&nbsp;</p>
            <h2>Fill Contract Form</h2>
          </div>
          <p>&nbsp;</p>
          <span className="badge bg-secondary">
            <p>&nbsp;</p>
            <div className="contianer my-3">
              <form className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Contractor Name
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    name="name"
                    onChange={onChangeHandle}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="contractId" className="form-label">
                    Contract Id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="contractId"
                    onChange={onChangeHandle}
                  />
                </div>
                <p>&nbsp;</p>
                <div className="col-12">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={submitTransaction}
                  >
                    Create Contract
                  </button>
                </div>
                <p>&nbsp;</p>
                <div className="col-md-4">
                  <label htmlFor="signerName" className="form-label">
                    Signer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="signerName"
                    onChange={onChangeHandle}
                  />
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="print"
                    onClick={signedContractToIPFS}
                  >
                    Sign Contract
                  </button>
                </div>
                <p>&nbsp;</p>
              </form>
            </div>
          </span>
        </div>
      </div>
      <p>&nbsp;</p>
      <div id="divToprint" className="contianer">
        <h2> Created Contract Details </h2>
        <hr />
        <h4> Information Store in Contract</h4>
        <Table size="sm" bordered responsive>
          <thead>
            <tr>
              <th>Items</th>
              <th> </th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Contractor Name</td>
              <td> : </td>
              <td>{formData.name}</td>
            </tr>
            <tr>
              <td>Contract Id</td>
              <td> : </td>
              <td>{formData.contractId}</td>
            </tr>
            <tr>
              <td>Signer Name</td>
              <td> : </td>
              <td>{formData.signerName}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <a
        href="https://goerli.arbiscan.io/address/process.env.CONTRACT_ADDRESS#readContract"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>Check Stored Details On Arbiscan</button>
      </a>
      <p>&nbsp;</p>
      <h3> Get Transaction Details </h3>
      <hr />
      <h4> Values read from blockchain </h4>
      <Table size="sm" bordered responsive>
        <thead>
          <tr>
            <th>Items</th>
            <th> </th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Smart Contract address</td>
            <td> : </td>
            <td>{ethAddress}</td>
          </tr>
          <tr>
            <td>transaction's BlockNumber on Arbitrum</td>
            <td> : </td>
            <td>{blockNumber}</td>
          </tr>
          <tr>
            <td>transaction's Hash on Arbitrum</td>
            <td> : </td>
            <td>{storeHashTransaction}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default App;
