// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {CompetitorProvider} from "../CompetitorProvider.sol";
import {Tournament} from "../Tournament.sol";
import {Owned} from "../../lib/solmate/src/auth/Owned.sol";

// A competitor provider for static competitors.
contract OracleCompetitorProvider is CompetitorProvider, Owned {
    ////////// MEMBER VARIABLES //////////

    // The mapping from competitor ID to metadata URI.
    mapping(uint256 => string) _metadataURIs;

    ////////// CONSTRUCTOR //////////

    constructor() Owned(msg.sender) {}

    function initalize(uint256[] memory ids, string[] memory uris) public onlyOwner {
        require(uris.length == ids.length, "INVALID_NUM_URIS");

        uint256 powerOfTwo = _getPowerOfTwo(ids.length);

        for (uint16 i = 0; i < powerOfTwo; i++) {
            require(ids[i] != 0, "ZERO_ID");
            _ids.push(ids[i]);

            // Fail if there was a duplicate ID.
            require(bytes(_metadataURIs[ids[i]]).length == 0, "DUPLICATE_IDS");
            _metadataURIs[ids[i]] = uris[i];
        }
    }

    ////////// PUBLIC APIS //////////

    function listCompetitorIDs() external view override returns (uint256[] memory) {
        return _ids;
    }

    function getCompetitor(uint256 competitorId) external view override returns (Tournament.Competitor memory) {
        require(bytes(_metadataURIs[competitorId]).length != 0, "INVALID_ID");
        return Tournament.Competitor(competitorId, _metadataURIs[competitorId]);
    }
}
