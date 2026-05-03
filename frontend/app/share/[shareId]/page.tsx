"use client";

import { ethers } from "ethers";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL!;

function b64ToU8(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export default function SharePage({ params }: { params: { shareId: string } }) {
  const [status, setStatus] = useState("Connect wallet to verify access");

  async function handleAccess() {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const wallet = await signer.getAddress();

    setStatus("Verifying on Base...");
    const data = await fetch(`${API}/api/shares/${params.shareId}?wallet=${wallet}`).then((r) => r.json());
    if (!data.verifiedOnBase) {
      setStatus("Access denied");
      return;
    }

    const encFile = await fetch(`https://ipfs.io/ipfs/${data.cid}`).then((r) => r.arrayBuffer());
    const [keyB64, ivB64] = data.encryptedKey.split(".");
    const key = await crypto.subtle.importKey("raw", b64ToU8(keyB64), { name: "AES-GCM" }, false, ["decrypt"]);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToU8(ivB64) }, key, encFile);

    const url = URL.createObjectURL(new Blob([decrypted]));
    const a = document.createElement("a");
    a.href = url;
    a.download = data.filename;
    a.click();
    setStatus("Access granted — file decrypted and downloaded");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold">Shared file access</h1>
        <p className="mt-3 text-slate-300">Status: {status}</p>
        <button onClick={handleAccess} className="mt-6 rounded-xl bg-blue-500 px-6 py-3">Connect wallet & Download</button>
        <p className="mt-3 text-green-300">Verified on Base</p>
      </div>
    </main>
  );
}
