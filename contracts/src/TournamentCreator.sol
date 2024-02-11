// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {StaticOracleTournament} from "./tournaments/StaticOracleTournament.sol";
import {StaticCompetitorProvider} from "./competitors/StaticCompetitorProvider.sol";
import {OracleResultProvider} from "./results/OracleResultProvider.sol";

contract TournamentCreator {
    struct Tournament {
        address tournament;
        address compProvider;
        address resultOracle;
        string uri;
    }

    uint256 public totalTournaments = 1;
    mapping(uint256 => Tournament) public tournaments;

    address public admin;

    event tournamentCreated(
        address tournament, address compProvider, address resultOracle, string uri, uint256 tournamentId
    );

    constructor() {
        admin = msg.sender;
    }

    // Add all the competitor Info , along with their inputs , also any tournament Info
    function createTournament(string memory tournamentURI, uint256[] memory compIDs, string[] memory compURIs) public {
        StaticCompetitorProvider newCompProvider = new StaticCompetitorProvider(compIDs, compURIs);
        OracleResultProvider newResultOracle = new OracleResultProvider(admin);

        StaticOracleTournament newTournament = new StaticOracleTournament(newCompProvider, newResultOracle);

        totalTournaments++;

        tournaments[totalTournaments] = Tournament({
            tournament: address(newTournament),
            compProvider: address(newCompProvider),
            resultOracle: address(newResultOracle),
            uri: tournamentURI
        });

        emit tournamentCreated(
            address(newTournament), address(newCompProvider), address(newResultOracle), tournamentURI, totalTournaments
            );
    }
}
