import Link from "next/link";
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="card p-12 text-center">
        <p className="text-blue-300">ShareGate</p>
        <h1 className="mt-2 text-5xl font-bold">Public files. Private access. On-chain.</h1>
        <p className="mt-4 text-slate-300">Encrypt locally, store on IPFS, gate only the decryption key through Base smart contracts.</p>
        <Link className="mt-8 inline-block rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400" href="/upload">Create Share</Link>
      </div>
    </main>
  );
}
