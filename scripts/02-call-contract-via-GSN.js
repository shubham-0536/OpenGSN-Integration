const { RelayProvider } = require("@opengsn/provider");
const { networkConfig } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
const path = require("path");
const fs = require("fs-extra");

async function main() {
  const chainId = network.config.chainId;
  let forwarderAddress, paymasterAddress, simpleStorage;

  let signer = (await ethers.getSigners())[0]

  if (network.name == "arbitrum" && chainId == 42161) {
    forwarderAddress = networkConfig[chainId]["Forwarder"];
    paymasterAddress = JSON.parse(
      fs.readFileSync("./constants/Paymaster.json", "utf8")
    ).address;
  } else if (chainId == 31337) {
    forwarderAddress = require("../build/gsn/Forwarder").address;
    paymasterAddress = require("../build/gsn/Paymaster").address;
  }
  console.log(`forwarder address is ${forwarderAddress}`);

  console.log(`paymaster address is ${paymasterAddress}`);

  const defaultProvider = new ethers.providers.Web3Provider(
    hre.network.provider
  );
  //const defaultProvider = new ethers.providers.JsonRpcProvider();

  simpleStorageAddress = JSON.parse(
    fs.readFileSync("./constants/MyContract.json", "utf8")
  ).address;

  simpleStorage = await ethers.getContractAt(
    "simpleStorage",
    simpleStorageAddress
  );

  const number = await simpleStorage.retrieve();
  console.log(`old Number is ${number}`);


/**
After setting up the OpenGSN contracts, we need to use the RelayProvider to access your contracts. 
It is a wrapper around a regular web3 provider. All "view" operations are sent directly, but all transactions are sent through the GSN relayers.
*/
// Declare the config object for creating the GSN provider and populate it with key-value pairs.

  const config = {
    paymasterAddress: paymasterAddress,
    loggerConfiguration: {
      logLevel: "debug",
      loggerUrl: "logger.opengsn.org",
    },
    auditorsCount: 0,
    performDryRunViewRelayCall: false
  };

  let gsnProvider = await RelayProvider.newProvider({
    provider: defaultProvider,
    config,
  });

  // let gsnProvider = await RelayProvider.newProvider({
  //   provider: ethers.provider,
  //   config,
  // });

  await gsnProvider.init();

  console.log("#---------------------------------------#");
  console.log("#---------------------------------------#");
  console.log("#---------------------------------------#");
  console.log("#---------------------------------------#");

  const paymaster = await ethers.getContractAt(
    "simplePaymaster",
    paymasterAddress
  );

  const relayHubAddress = await paymaster.getRelayHub();
  const relayHubAbiFile = path.resolve(__dirname, "../relayHubABI.abi");
  const relayHubABI = fs.readFileSync(relayHubAbiFile, "utf8");

  const relayHub = new ethers.Contract(
    relayHubAddress,
    relayHubABI,
    defaultProvider
  );

  const paymasterBalance = await relayHub.balanceOf(paymasterAddress);
  console.log(
    `Paymaster's Balacne is ${ethers.utils.formatEther(paymasterBalance)} `
  );

  //in case we need to withdraw funds
  // const withdrawTx = await paymaster.withdrawRelayHubDepositTo(paymasterBalance2, "0xc3691b6e7839fff664e2124d2401bd0dab35a2a7");
  // await withdrawTx.wait(1);

  //every time, we run this script, new address is used for signing
  newAccountAddress = gsnProvider.newAccount().address;
  console.log(`newAccount address is ${newAccountAddress}`);

  const newProviderWithGsn = new ethers.providers.Web3Provider(gsnProvider);

  // When using the new provider to connect to a contract, you can pass two types of parameters:
  // If you pass a Provider, it will return a downgraded contract with read-only access (i.e., constant calls only).
  // If you pass a Signer, it will return a contract representing the actions performed by that Signer.
  
  // The following code snippet demonstrates passing the newly created 'newAccountAddress' to represent a new account with no tokens.
  // 'newProviderWithGsn.getSigner' is used to fetch the signer for 'newAccountAddress',
  // which is then connected to the 'simpleStorage' contract.
  // This means that the signatures of this new account will be sent through GSN's relay
  simpleStorage = simpleStorage.connect(
    newProviderWithGsn.getSigner(newAccountAddress)
  );

// You can use the provider's function within the connected contract to retrieve the balance.
// const balance = await simpleStorage.provider.getBalance(newAccountAddress);
  const balance = await newProviderWithGsn.getBalance(newAccountAddress);
  console.log(`newAccountAddress's balance is ${balance}`);
  console.log("this newAccount doen't have any token");
  console.log("sign message to send transaction via GSN...");
  console.log("#---------------------------------------#");

  const tx = await simpleStorage.store(5423);
  await tx.wait();

  const newNumber = await simpleStorage.retrieve();
  console.log(`newNumber is ${newNumber.toString()}`);

  const balance2 = await newProviderWithGsn.getBalance(newAccountAddress);
  console.log(`newAccountAddress's balance is ${balance2}`);

  const paymasterBalance2 = await relayHub.balanceOf(paymasterAddress);
  console.log(
    `Paymaster's Balacne is ${ethers.utils.formatEther(paymasterBalance2)} `
  );
  const totalGasSpent =
    ethers.utils.formatEther(paymasterBalance) -
    ethers.utils.formatEther(paymasterBalance2);
  console.log(`The total gas paymaster spent was ${totalGasSpent}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
