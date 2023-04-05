require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: `hardhat`,
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/57JP4p7fKIyCYCrONB75iVoPEFNaJKLG`,
      accounts:[`0x0bce08e8b34edbc3936b2f525186d991b5805a4c537cd8c630926cdb03f145e9`],
    },
    local: {
      url: 'http://localhost:8545'
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../src/artifacts"
  },
};
