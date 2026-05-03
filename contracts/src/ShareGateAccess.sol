// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ShareGateAccess {
    struct Share {
        address owner;
        uint64 expiry;
        bool exists;
    }

    mapping(bytes32 => Share) private shares;
    mapping(bytes32 => mapping(address => bool)) private access;

    event ShareCreated(bytes32 indexed shareId, address indexed owner, uint64 expiry);
    event AccessGranted(bytes32 indexed shareId, address indexed wallet);
    event AccessRevoked(bytes32 indexed shareId, address indexed wallet);

    error ShareAlreadyExists();
    error ShareNotFound();
    error NotOwner();
    error InvalidExpiry();

    modifier onlyOwner(bytes32 shareId) {
        if (!shares[shareId].exists) revert ShareNotFound();
        if (shares[shareId].owner != msg.sender) revert NotOwner();
        _;
    }

    function createShare(bytes32 shareId, uint64 expiry) external {
        if (shares[shareId].exists) revert ShareAlreadyExists();
        if (expiry <= block.timestamp) revert InvalidExpiry();

        shares[shareId] = Share({owner: msg.sender, expiry: expiry, exists: true});
        access[shareId][msg.sender] = true;

        emit ShareCreated(shareId, msg.sender, expiry);
    }

    function grantAccess(bytes32 shareId, address wallet) external onlyOwner(shareId) {
        access[shareId][wallet] = true;
        emit AccessGranted(shareId, wallet);
    }

    function revokeAccess(bytes32 shareId, address wallet) external onlyOwner(shareId) {
        access[shareId][wallet] = false;
        emit AccessRevoked(shareId, wallet);
    }

    function canAccess(bytes32 shareId, address wallet) external view returns (bool) {
        Share memory s = shares[shareId];
        if (!s.exists) return false;
        if (block.timestamp > s.expiry) return false;
        return access[shareId][wallet];
    }

    function getShare(bytes32 shareId) external view returns (address owner, uint64 expiry, bool exists) {
        Share memory s = shares[shareId];
        return (s.owner, s.expiry, s.exists);
    }
}
