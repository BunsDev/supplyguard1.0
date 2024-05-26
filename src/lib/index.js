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
