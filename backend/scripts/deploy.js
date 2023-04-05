const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
  // const forwarder = await deploy('NaivePaymaster');
  const signContract = await deploy("SignContract", "0xB2b5841DBeF766d4b521221732F9B618fCf34A87");

  writeFileSync('tmp/deploy.json', JSON.stringify({
    SignContract: signContract.address,
  }, null, 2));

  console.log(`\nSignContract: ${signContract.address}`);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}