export async function encryptFile(file: File) {
  const key = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const algo = { name: "AES-GCM", iv };
  const cryptoKey = await crypto.subtle.importKey("raw", key, algo, false, ["encrypt"]);
  const data = new Uint8Array(await file.arrayBuffer());
  const encrypted = await crypto.subtle.encrypt(algo, cryptoKey, data);

  return {
    encryptedBlob: new Blob([encrypted]),
    encryptedKeyB64: btoa(String.fromCharCode(...key)),
    ivB64: btoa(String.fromCharCode(...iv)),
  };
}
