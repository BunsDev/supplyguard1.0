import { ethers } from "ethers";
import SupplyGuard from "./SupplyGuard.json";

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      "0x500881F4c34594576A07a90007b755CEa8aE0497",
      SupplyGuard.abi,
      signer
    );

    return contractReader;
  }
};

// Failed to deploy contract
// Could not fetch bytecode for contract at 0x6B90649EdEE1A89A98571853D152D1D1e854B171 on chain 314159, double check that the address and chainId are correct.
// If you believe this is incorrect or the error persists, please visit our support site.
