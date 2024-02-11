// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {OracleCompetitorProvider} from "../competitors/OracleCompetitorProvider.sol";
import {OracleResultProvider} from "../results/OracleResultProvider.sol";
import {Tournament} from "../Tournament.sol";

// A Tournament in which the competitors are statically defined, and the results
// are defined by an oracle.
contract StaticOracleTournament is Tournament {
    ////////// CONSTRUCTOR //////////
    constructor(OracleCompetitorProvider provider, OracleResultProvider oracle) Tournament(provider, oracle) {}
}
