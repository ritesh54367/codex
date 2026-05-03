type ShareRecord = {
  shareId: string;
  owner: string;
  cid: string;
  filename: string;
  keyCipher: string;
  keyIv: string;
  keyTag: string;
  createdAt: string;
};

const db = new Map<string, ShareRecord>();

export function saveShare(record: ShareRecord) {
  db.set(record.shareId, record);
}

export function getShare(shareId: string) {
  return db.get(shareId);
}
