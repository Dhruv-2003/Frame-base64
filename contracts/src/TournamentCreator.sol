// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {StaticOracleTournament} from "./tournaments/OracleTournament.sol";
import {OracleCompetitorProvider} from "./competitors/OracleCompetitorProvider.sol";
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

    event tournamentInitialised(uint256 tournamentId, uint256[] compIDs, string[] compURIs);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "ONLY_ADMIN");
        _;
    }

    // Add all the competitor Info , along with their inputs , also any tournament Info
    function createTournament(string memory tournamentURI) public onlyAdmin {
        OracleCompetitorProvider newCompProvider = new OracleCompetitorProvider();
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

    function initialiseTournament(uint256 tournamentId, uint256[] memory compIDs, string[] memory compURIs)
        public
        onlyAdmin
    {
        OracleCompetitorProvider compProvider = OracleCompetitorProvider(tournaments[tournamentId].compProvider);
        compProvider.initalize(compIDs, compURIs);
        emit tournamentInitialised(tournamentId, compIDs, compURIs);
    }
}
