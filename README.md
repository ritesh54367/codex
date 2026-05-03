# ShareGate

Public files. Private access. On-chain.

ShareGate is a Web3-native encrypted file sharing app on Base. Files are encrypted client-side, stored publicly on IPFS, and decryption keys are gated by on-chain access checks.

## Monorepo structure

- `contracts/` — Foundry smart contracts for access control
- `backend/` — Express API for IPFS pinning and encrypted key retrieval
- `frontend/` — Next.js App Router frontend

## Quick start

1. Deploy contract from `contracts/` and copy deployed address.
2. Configure `.env` for `backend/` and `frontend/`.
3. Run backend: `npm install && npm run dev` in `backend/`.
4. Run frontend: `npm install && npm run dev` in `frontend/`.

