// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {TournamentCreator} from "../src/TournamentCreator.sol";
import {Script} from "../lib/forge-std/src/Script.sol";
import {console2} from "../lib/forge-std/src/console2.sol";

// A script to deploy the results oracle of a Base64 Tournament.
// Usage: forge script ./script/06_DeployCreator.s.sol:DeployCreator \
// --broadcast --verify --rpc-url "https://sepolia.base.org" \
// --private-key <private-key> \
// --verifier etherscan \
// --verifier-url "https://api-goerli.basescan.org/api" \
// --etherscan-api-key <etherscan-api-key> \
// --sig "run(address)" \
// <owner>
contract DeployCreator is Script {
    function run() public {
        vm.startBroadcast();

        TournamentCreator tCreator = new TournamentCreator();

        console2.log("Tournament Creator", address(tCreator));

        vm.stopBroadcast();
    }
}
