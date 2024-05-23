import { ethers } from "ethers";
import SupplyGuard from "./SupplyGuard.json";

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      "0xFe3AE74fB3C2273F2f0060b0E3e0A7531c3c427A",
      SupplyGuard.abi,
      signer
    );

    return contractReader;
  }
};
