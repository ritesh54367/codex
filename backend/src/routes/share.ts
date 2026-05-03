import { Router } from "express";
import { decryptAtRest, encryptAtRest } from "../services/crypto.js";
import { getShare, saveShare } from "../services/store.js";
import { canWalletAccess, getOnchainShare } from "../services/chain.js";
import { config } from "../config.js";

const router = Router();

router.post("/shares/register", async (req, res) => {
  const { shareId, owner, cid, filename, encryptedKey } = req.body;
  if (!shareId || !owner || !cid || !encryptedKey || !filename) {
    return res.status(400).json({ error: "missing required fields" });
  }

  const payload = encryptAtRest(encryptedKey, config.serverKey);
  saveShare({
    shareId,
    owner,
    cid,
    filename,
    keyCipher: payload.ciphertext,
    keyIv: payload.iv,
    keyTag: payload.tag,
    createdAt: new Date().toISOString(),
  });

  return res.json({ ok: true });
});

router.get("/shares/:shareId", async (req, res) => {
  const { shareId } = req.params;
  const { wallet } = req.query as { wallet?: string };

  if (!wallet) return res.status(400).json({ error: "wallet required" });
  const record = getShare(shareId);
  if (!record) return res.status(404).json({ error: "share not found" });

  const isAllowed = await canWalletAccess(shareId, wallet);
  if (!isAllowed) return res.status(403).json({ error: "access denied" });

  const [owner, expiry, exists] = await getOnchainShare(shareId);
  if (!exists) return res.status(404).json({ error: "onchain share missing" });

  const encryptedKey = decryptAtRest(
    { iv: record.keyIv, ciphertext: record.keyCipher, tag: record.keyTag },
    config.serverKey,
  );

  return res.json({
    verifiedOnBase: true,
    owner,
    expiry: Number(expiry),
    cid: record.cid,
    filename: record.filename,
    encryptedKey,
  });
});

export default router;
