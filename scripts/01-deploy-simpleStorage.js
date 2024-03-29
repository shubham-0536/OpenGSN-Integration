const hre = require("hardhat");
const { network } = hre;
const { networkConfig } = require("../helper-hardhat-config");
const { saveInfo } = require("../utils/saveInfo");

async function main() {
  const chainId = network.config.chainId;
  let forwarder;

  if (network.name == "arbitrum" && chainId == 42161) {
    forwarder = networkConfig[chainId]["Forwarder"];
  } else if (chainId == 31337) {
    forwarder = require("../build/gsn/Forwarder").address;
  }

  console.log(`forwarder address is ${forwarder}`);
  console.log("Deploying simpleStorage contract...");
  const simpleStorageFactory = await hre.ethers.getContractFactory(
    "simpleStorage"
  );
  const simpleStorage = await simpleStorageFactory.deploy(forwarder);
  await simpleStorage.deployed();

  console.log(`simpleStorage Contract address is ${simpleStorage.address}`);
  saveInfo("MyContract", simpleStorage.address);

  const trustedForwarder = await simpleStorage.getTrustedForwarder();
  console.log(`trustedForwarder address is ${trustedForwarder}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
