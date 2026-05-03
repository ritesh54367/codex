export const shareAbi = [
  "function createShare(bytes32 shareId, uint64 expiry)",
  "function grantAccess(bytes32 shareId, address wallet)",
  "function revokeAccess(bytes32 shareId, address wallet)",
  "function canAccess(bytes32 shareId, address wallet) view returns (bool)",
];
