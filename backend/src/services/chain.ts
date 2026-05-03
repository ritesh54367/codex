import { Contract, JsonRpcProvider } from "ethers";
import { config } from "../config.js";

const abi = [
  "function canAccess(bytes32 shareId, address wallet) view returns (bool)",
  "function getShare(bytes32 shareId) view returns (address owner, uint64 expiry, bool exists)",
];

const provider = new JsonRpcProvider(config.baseRpcUrl);
const contract = new Contract(config.contractAddress, abi, provider);

export async function canWalletAccess(shareId: string, wallet: string) {
  return contract.canAccess(shareId, wallet) as Promise<boolean>;
}

export async function getOnchainShare(shareId: string) {
  return contract.getShare(shareId);
}
