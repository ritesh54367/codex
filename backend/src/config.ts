import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  pinataJwt: process.env.PINATA_JWT || "",
  baseRpcUrl: process.env.BASE_RPC_URL || "",
  contractAddress: process.env.SHAREGATE_CONTRACT_ADDRESS || "",
  serverKey: process.env.SERVER_KEY || "",
};
