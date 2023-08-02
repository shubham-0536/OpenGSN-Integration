const hre = require("hardhat");
const { network } = hre;
const { networkConfig } = require("../helper-hardhat-config");
const { saveInfo } = require("../utils/saveInfo");
const fs = require("fs-extra");
const ethers = hre.ethers;
const path = require("path");

async function main() {
  const chainId = network.config.chainId;

  if (network.name == "arbitrum" && chainId == 42161) {

    const deployer = (await ethers.getSigners())[0];
    console.log("Deploying contracts with the account:", deployer.address);
    console.log(`this is ${network.name} network`);

    const forwarderAddress = networkConfig[chainId]["Forwarder"];
    console.log(`forwarder address is ${forwarderAddress}`);
    saveInfo("Forwarder", forwarderAddress);

    const relayHubAddress = networkConfig[chainId]["RelayHub"];
    console.log(`relayHub address is ${relayHubAddress}`);
    saveInfo("RelayHub", relayHubAddress);

    console.log("Deploying Paymaster Contract...");
    const simplePaymasterFactory = await hre.ethers.getContractFactory(
      "simplePaymaster"
    );
    const simplePaymaster = await simplePaymasterFactory.deploy();
    await simplePaymaster.deployed();
    console.log(`Paymaster contract address is ${simplePaymaster.address}`);
    saveInfo("Paymaster", simplePaymaster.address);

    const setRelayHubTx = await simplePaymaster.setRelayHub(relayHubAddress);
    await setRelayHubTx.wait(1);

    const setForwarderTx = await simplePaymaster.setTrustedForwarder(
      forwarderAddress
    );
    await setForwarderTx.wait(1);

    const RelayHubAddressFromContract = await simplePaymaster.getRelayHub();
    console.log(
      `RelayHub address from paymaster is ${RelayHubAddressFromContract}`
    );

    const trustedForwarderFromContract =
      await simplePaymaster.getTrustedForwarder();
    console.log(
      `trustedForwarder address from paymaster is ${trustedForwarderFromContract}`
    );


    const walletBalance = await ethers.provider.getBalance(deployer.address);
    console.log(
      `deployer's native blockchain token balance is ${ethers.utils.formatEther(
        walletBalance
      )}`
    );

    console.log("transfer some native blockchain token to paymaster...");

    /**Next, since the Paymaster contract will need to pay for the user's gas fees, it requires depositing funds into the Paymaster (actually the RelayHub).
The deposited tokens are the native tokens of the blockchain, for example, in the case of arbitrum goerli, it is eth.
You can deposit funds either by calling the receive function of the Paymaster, which will automatically transfer the funds to the RelayHub,
or directly calling the depositFor function of the RelayHub to transfer native tokens.
Reference: https://docs.opengsn.org/networks/polygon/mumbai.html
*/
    const tx = await deployer.sendTransaction({
      to: simplePaymaster.address,
      value: ethers.utils.parseEther("0.001"),
    });

    await tx.wait();

    const walletBalance2 = await ethers.provider.getBalance(deployer.address);
    console.log(
      `deployer's native blockchain token balance is ${ethers.utils.formatEther(
        walletBalance2
      )}`
    );
    const relayHubAbiFile = path.resolve(__dirname, "../relayHubABI.abi");
    const relayHubABI = fs.readFileSync(relayHubAbiFile, "utf8");

    const relayHub = new ethers.Contract(
      relayHubAddress,
      relayHubABI,
      deployer
    );

    const paymasterBalance = await relayHub.balanceOf(simplePaymaster.address);
    console.log(
      `Paymaster's Balacne is ${ethers.utils.formatEther(paymasterBalance)} `
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
