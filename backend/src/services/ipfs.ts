import axios from "axios";
import { config } from "../config.js";

export async function uploadToIpfs(file: Buffer, name: string) {
  const form = new FormData();
  form.append("file", new Blob([file]), name);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
    headers: {
      Authorization: `Bearer ${config.pinataJwt}`,
      ...form.getHeaders?.(),
    },
    maxBodyLength: Infinity,
  });

  return res.data.IpfsHash as string;
}
