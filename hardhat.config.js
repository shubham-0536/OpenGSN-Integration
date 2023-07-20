require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL;
const ARBITRUM_GOERLI_RPC_URL = process.env.ARBITRUM_GOERLI_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      //account: no need
      chainId: 31337,
    },
    mumbai: {
      chainId: 80001,
      blockConfirmations: 6,
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    arbitrum: {
      accounts: [PRIVATE_KEY],
      url: ARBITRUM_RPC_URL,
      chainId: 42161,
    },
    goerli: {
      accounts: [PRIVATE_KEY],
      url: ARBITRUM_GOERLI_RPC_URL,
      chainId: 421613,
    },
  },
  etherscan: {
    apiKey: {
      mumbai: POLYGONSCAN_API_KEY,
    },
  },
  solidity: "0.8.7",
};
