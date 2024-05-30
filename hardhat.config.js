require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const privateKey = fs.readFileSync("secrete.txt").toString();
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      chainId: 4202,
    },

    Filecoin: {
      url: "https://filecoin-calibration.chainup.net/rpc/v1",
      accounts: [privateKey],
    },
  },
  solidity: "0.8.24",
  allowUnlimitedContractSize: true,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
};
