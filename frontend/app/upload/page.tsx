"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { shareAbi } from "../../lib/abi";
import { encryptFile } from "../../lib/crypto";

const CONTRACT = process.env.NEXT_PUBLIC_SHARE_CONTRACT!;
const API = process.env.NEXT_PUBLIC_API_URL!;

export default function UploadPage() {
  const [status, setStatus] = useState("Idle");
  const [txHash, setTxHash] = useState("");

  async function onSubmit(formData: FormData) {
    const file = formData.get("file") as File;
    const expiry = Number(formData.get("expiry"));
    if (!file) return;

    setStatus("Encrypted locally");
    const { encryptedBlob, encryptedKeyB64, ivB64 } = await encryptFile(file);

    const ipfsRes = await fetch("https://ipfs.io/api/v0/add", { method: "POST", body: encryptedBlob });
    const ipfsText = await ipfsRes.text();
    const cid = ipfsText.trim().split(" ").pop() ?? "";
    setStatus("Uploaded to IPFS");

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const wallet = await signer.getAddress();
    const shareId = ethers.id(`${wallet}:${file.name}:${Date.now()}`);
    const contract = new ethers.Contract(CONTRACT, shareAbi, signer);
    const tx = await contract.createShare(shareId, expiry);
    await tx.wait();
    setTxHash(tx.hash);

    await fetch(`${API}/api/shares/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shareId,
        owner: wallet,
        cid,
        filename: file.name,
        encryptedKey: `${encryptedKeyB64}.${ivB64}`,
      }),
    });

    setStatus("Share created on Base");
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="card p-8">
        <h2 className="text-3xl font-semibold">Create encrypted share</h2>
        <form action={onSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl bg-white/10 p-3" name="file" type="file" required />
          <input className="w-full rounded-xl bg-white/10 p-3" name="expiry" type="number" placeholder="Unix expiry timestamp" required />
          <button className="rounded-xl bg-blue-500 px-5 py-3">Create Share</button>
        </form>
        <p className="mt-4 text-blue-300">{status}</p>
        {txHash && <a className="text-sm underline" target="_blank" href={`https://sepolia.basescan.org/tx/${txHash}`}>View transaction</a>}
      </div>
    </main>
  );
}
