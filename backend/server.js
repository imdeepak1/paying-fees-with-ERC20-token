import express from "express";
import cors from 'cors';
import SignContract from "../src/abis/SignContract.json" assert { type: "json" };
import Web3 from "web3";

const app = express();
app.use(express.json())
app.use(cors());
const web3 = new Web3('https://sepolia.infura.io/v3/process.env.INFURA_KEY');
const contractAddress = "0x293eC2FBAF729ea3F03E33Fe3c00c095E6136Ee9";
const privateKey = process.env.PRIVATE_KEY
const ERC20ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const erc20ContractAddress = "0x55244D7e9608ED2F3DBe14594Af125b01888375d";

const tokenStoreAdd = "0xC2C17EFbCE35a2a879498B2D13e09EE88492A5E6";
const contract = new web3.eth.Contract(SignContract.abi, contractAddress);
const erc20Contract = new web3.eth.Contract(ERC20ABI, erc20ContractAddress);



app.post('/api/createContract', async (req, res) => {

  const { from,contractId,name } = req.body;
  const pathIs = "984f3g384f";
  const functionABI = await contract.methods
  .storeContract(contractId, pathIs, name)
  .encodeABI();
  var rawTxObject = {
    nonce: await web3.eth.getTransactionCount(from),
    gasPrice: "20000000",
    gasLimit: 270000,
    value: 0,
    from: from,
    to: contractAddress,
    data: functionABI,
  };
  const signedTx = await web3.eth.accounts.signTransaction(rawTxObject, privateKey);
  const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("This is gas used ", txHash.gasUsed);
  console.log("This is TxHash of Actual Tx:", txHash);
  const gasToken = txHash.gasUsed / 12000;
  const gasTokenAmount = BigInt(gasToken*10**18);
  console.log("Transfer Token Value is",gasTokenAmount);
  const beforeBalanceOf = await erc20Contract.methods.balanceOf(tokenStoreAdd).call();
  console.log("This is before token transafer balance",beforeBalanceOf)
  const transferFuncABI = await erc20Contract.methods.transfer( tokenStoreAdd, gasTokenAmount).encodeABI();

  var rawTxObjectForToken = {
    nonce: await web3.eth.getTransactionCount(from),
    gasPrice: "20000000",
    gasLimit: 270000,
    value: 0,
    from: from,
    to: erc20ContractAddress,
    data: transferFuncABI,
  };

  const signedTxForToken = await web3.eth.accounts.signTransaction(rawTxObjectForToken, privateKey);
  const txReceiptForToken = await web3.eth.sendSignedTransaction(
    signedTxForToken.rawTransaction
  );
  console.log("This is token transafer tx ", txReceiptForToken)
  const afterBalanceOf = await erc20Contract.methods.balanceOf(tokenStoreAdd).call();
  console.log("This is token transafer balance", afterBalanceOf)


  res.json({ txHash:txHash, txReceiptForToken:txReceiptForToken, contractAddress:contractAddress});
});



app.post('/api/signContract', async (req, res) => {

  const { from,contractId,signerName } = req.body;
  const pathIs = "984f3g384f";
  const functionABI = contract.methods
  .storeSignedContract(contractId,signerName, pathIs)
  .encodeABI();
  var rawTxObject = {
    nonce: await web3.eth.getTransactionCount(from),
    gasPrice: "20000000",
    gasLimit: 270000,
    value: 0,
    from: from,
    to: contractAddress,
    data: functionABI,
  };
  const signedTx = await web3.eth.accounts.signTransaction(rawTxObject, privateKey);
  const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("This is gas used ", txHash.gasUsed);
  const valueIs = txHash.gasUsed / 12000;
  const gasTokenAmount = Math.ceil(valueIs);
  console.log("Transfer Token Value is",gasTokenAmount);
  const beforeBalanceOf = await erc20Contract.methods.balanceOf(tokenStoreAdd).call();
  console.log("This is before token transafer balance",beforeBalanceOf)

  const transferTokenFuncABI = await erc20Contract.methods.transfer( tokenStoreAdd, tranferToken).encodeABI();

  var rawTxObjectForToken = {
    nonce: await web3.eth.getTransactionCount(from),
    gasPrice: "20000000",
    gasLimit: 270000,
    value: 0,
    from: from,
    to: erc20ContractAddress,
    data: transferTokenFuncABI,
  };

  const signedTxForToken = await web3.eth.accounts.signTransaction(rawTxObjectForToken, privateKey);
  const txReceiptForToken = await web3.eth.sendSignedTransaction(
    signedTxForToken.rawTransaction
  );
  console.log("This is token transafer tx ", txReceiptForToken)
  const afterBalanceOf = await erc20Contract.methods.balanceOf(tokenStoreAdd).call();
  console.log("This is token transafer balance", afterBalanceOf)

  res.json({ txHash:txHash, txReceiptForToken:txReceiptForToken, contractAddress:contractAddress});
});

app.listen(3002, () => console.log('Server running on port 3002'));
