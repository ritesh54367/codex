// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ShareGateAccess.sol";

contract DeployShareGate is Script {
    function run() external returns (ShareGateAccess) {
        vm.startBroadcast();
        ShareGateAccess shareGate = new ShareGateAccess();
        vm.stopBroadcast();
        return shareGate;
    }
}
