// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @notice Simple single owner authorization mixin.
/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/auth/Owned.sol)
abstract contract Owned {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event OwnershipTransferred(address indexed user, address indexed newOwner);

    /*//////////////////////////////////////////////////////////////
                            OWNERSHIP STORAGE
    //////////////////////////////////////////////////////////////*/

    address public owner;

    modifier onlyOwner() virtual {
        require(msg.sender == owner, "UNAUTHORIZED");

        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _owner) {
        owner = _owner;

        emit OwnershipTransferred(address(0), _owner);
    }

    /*//////////////////////////////////////////////////////////////
                             OWNERSHIP LOGIC
    //////////////////////////////////////////////////////////////*/

    function transferOwnership(address newOwner) public virtual onlyOwner {
        owner = newOwner;

        emit OwnershipTransferred(msg.sender, newOwner);
    }
}

// An interface that provides the result of a match between two competitors.
interface ResultProvider {
    ////////// PUBLIC APIS //////////

    // Returns the result of a match between two competitors.
    // It is the job of the caller to ensure that the two competitors are valid.
    function getResult(uint256 competitor1, uint256 competitor2) external returns (Tournament.Result memory);
}

/**
 * ██████╗░░█████╗░░██████╗███████╗░█████╗░░░██╗██╗
 * ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔═══╝░░██╔╝██║
 * ██████╦╝███████║╚█████╗░█████╗░░██████╗░██╔╝░██║
 * ██╔══██╗██╔══██║░╚═══██╗██╔══╝░░██╔══██╗███████║
 * ██████╦╝██║░░██║██████╔╝███████╗╚█████╔╝╚════██║
 * ╚═════╝░╚═╝░░╚═╝╚═════╝░╚══════╝░╚════╝░░░░░░╚═╝
 *
 *
 * A Smart Contract for Tournament-based prediction markets.
 */
abstract contract Tournament is Owned {
    ////////// STRUCTS AND ENUMS //////////

    // A struct representing a single competitor in the Tournament.
    struct Competitor {
        // The ID of the competitor.
        uint256 id;
        // The URI housing the metadata of the competitor.
        string uri;
    }

    // A struct representing a single match result in the Tournament.
    struct Result {
        // The ID of the winner of the match.
        uint256 winnerId;
        // The ID of the loser of the match.
        uint256 loserId;
        // A string representing any metadata about the match.
        string metadata;
    }

    // A struct representing a participant in the Tournament prediction market.
    struct Participant {
        // The address of the participant.
        address addr;
        // The points the participant has earned.
        uint256 points;
    }

    // An enum representing the state of the Tournament prediction market.
    enum State
    // The Tournament prediction market is accepting entries.
    {
        AcceptingEntries,
        // The Tournament prediction market is no longer accepting entries.
        NotAcceptingEntries,
        // The Tournament is in progress.
        InProgress,
        // The Tournament has concluded.
        Finished
    }

    ////////// MEMBER VARIABLES //////////

    // The State of Base64.
    State public state = State.AcceptingEntries;

    // The Competitor provider.
    CompetitorProvider _competitorProvider;

    // The match result provider.
    ResultProvider public resultProvider;

    // The current bracket.
    uint256[][] _bracket;

    // The mapping from participant address to entry.
    mapping(address => uint256[][]) _entries;

    // The mapping from participant address to participant.
    mapping(address => Participant) _participantMap;

    // The list of participant addresses.
    address[] _participants;

    // The number of rounds in the bracket.
    uint256 public numRounds;

    // The current round of the bracket, 0 indexed.
    uint256 public curRound = 0;

    // The number of points awarded for each match in the current round.
    uint256 _pointsPerMatch = 1;

    event entrySubmitted(uint256[][] entry, address participant);
    event entryClosed(uint256 timestamp);
    event roundStarted(uint256 timestamp);
    event roundResult(uint256 winnerId, uint256 loserId, string metadata, uint256 round);
    event tournamentFinished(uint256 timestamp);

    ////////// CONSTRUCTOR //////////

    // Initializes the Base64 bracket with the given competitors.
    // The number of competitors must be a power of two between 4 and 256 inclusive.
    constructor(CompetitorProvider cp, ResultProvider rp) Owned(msg.sender) {
        _competitorProvider = cp;
        resultProvider = rp;
    }

    function initialise() public onlyOwner {
        // Initialize the bracket.
        uint256[] memory competitorIDs = _competitorProvider.listCompetitorIDs();
        uint256 competitorsLeft = competitorIDs.length;

        while (competitorsLeft >= 1) {
            _bracket.push();
            if (competitorsLeft > 1) {
                numRounds++;
            }

            competitorsLeft /= 2;
        }

        // Initialize the first round of the bracket.
        for (uint256 i = 0; i < competitorIDs.length; i++) {
            _bracket[0].push(competitorIDs[i]);
        }
    }

    ////////// PUBLIC APIS //////////

    // Returns the current state of the Tournament bracket. The first array index corresponds to
    // the round number of the tournament. The second array index corresponds to the competitor number,
    // from top to bottom on the left, and then top to bottom on the right. The array contains the
    // competitor ID.
    function getBracket() external view virtual returns (uint256[][] memory) {
        return _bracket;
    }

    // Returns the competitor for the given competitor ID.
    function getCompetitor(uint256 competitorId) external view virtual returns (Competitor memory) {
        return _competitorProvider.getCompetitor(competitorId);
    }

    // Submits an entry to the Tournament prediction market. The entry must consist of N-1 rounds, where N
    // is the number of rounds in the Tournament. An address may submit at most one entry.
    function submitEntry(uint256[][] memory entry) public virtual {
        require(_entries[msg.sender].length == 0, "ALREADY_SUBMITTED");
        require(state == State.AcceptingEntries, "TOURNAMENT_NOT_ACCEPTING_ENTRIES");

        _validateEntry(entry);

        _entries[msg.sender] = entry;

        Participant memory p = Participant(msg.sender, 0);

        _participantMap[msg.sender] = p;
        _participants.push(msg.sender);
        emit entrySubmitted(entry, msg.sender);
    }

    // Returns an entry for a given address.
    function getEntry(address addr) external view returns (uint256[][] memory) {
        require(_entries[addr].length > 0, "ENTRY_NOT_FOUND");

        return _entries[addr];
    }

    // Returns the state of the Tournament prediction market.
    function getState() external view returns (State) {
        return state;
    }

    // Returns the addresses of the participants in the tournament prediction market.
    function listParticipants() external view returns (address[] memory) {
        return _participants;
    }

    // Returns the participant for the given address.
    function getParticipant(address addr) external view returns (Participant memory) {
        require(_participantMap[addr].addr != address(0), "PARTICIPANT_NOT_FOUND");

        return _participantMap[addr];
    }

    ////////// ADMIN APIS //////////

    // Advances the state of Base64.
    function advance() external onlyOwner {
        require(state != State.Finished, "TOURNAMENT_FINISHED");

        if (state == State.AcceptingEntries) {
            state = State.NotAcceptingEntries;
            emit entryClosed(block.timestamp);
            // Entry closed event
        } else if (state == State.NotAcceptingEntries) {
            state = State.InProgress;
            emit roundStarted(block.timestamp);
            // Round result starting event one
            _advanceRound();
        } else if (state == State.InProgress) {
            _advanceRound();
            // Next round results
        }
    }

    ////////// PRIVATE HELPERS //////////

    // Validates an entry. To save on gas, we just ensure the entry has the proper number
    // of rounds and picks, without checking the competitor IDs.
    function _validateEntry(uint256[][] memory entry) private view {
        require(entry.length == numRounds, "INVALID_NUM_ROUNDS");

        uint256 numCompetitors = _bracket[0].length;

        for (uint32 i = 0; i < entry.length; i++) {
            numCompetitors /= 2;

            require(entry[i].length == numCompetitors, "INVALID_NUM_TEAMS");
        }
    }

    // Advances the bracket to the next round.
    function _advanceRound() private {
        require(state == State.InProgress, "TOURNAMENT_NOT_IN_PROGRESS");
        require(curRound < numRounds, "TOURNAMENT_FINISHED");

        uint256 numWinners = _bracket[curRound].length / 2;

        for (uint256 i = 0; i < numWinners; i++) {
            Tournament.Result memory result =
                resultProvider.getResult(_bracket[curRound][i * 2], _bracket[curRound][(i * 2) + 1]);
            _bracket[curRound + 1].push(result.winnerId);
            emit roundResult(result.winnerId, result.loserId, result.metadata, curRound + 1);
        }

        _updatePoints();

        _pointsPerMatch *= 2;
        curRound++;

        if (curRound >= numRounds) {
            state = State.Finished;
            emit tournamentFinished(block.timestamp);
        }
    }

    // Updates the participants' points according to the current bracket and the participants'
    // entries.
    function _updatePoints() private {
        for (uint256 i = 0; i < _participants.length; i++) {
            uint256[][] memory entry = _entries[_participants[i]];

            // Score the entry for the current round.
            for (uint256 j = 0; j < _bracket[curRound + 1].length; j++) {
                if (_bracket[curRound + 1][j] == entry[curRound][j]) {
                    _participantMap[_participants[i]].points += _pointsPerMatch;
                }
            }
        }
    }
}

// An abstract contract that provides the list of competitors, their IDs, and their URIs.
abstract contract CompetitorProvider {
    ////////// MEMBER VARIABLES //////////

    // The IDs of the competitors.
    uint256[] _ids;

    ////////// PUBLIC APIS //////////

    // Lists the IDs of the competitors. This must return an array that is of a power of 2,
    // between 4 and 256 inclusive. Team IDs should be returned in match order of the
    // first round - from top to bottom on the left, then top to bottom on the right.
    function listCompetitorIDs() external view virtual returns (uint256[] memory);

    // Returns the competitor for the given competitor ID.
    function getCompetitor(uint256) external view virtual returns (Tournament.Competitor memory);

    ////////// INTERNAL APIS //////////

    // Returns the power of 2 that is greater than or equal to the given number.
    function _getPowerOfTwo(uint256 n) internal pure returns (uint256) {
        require(n >= 4 && n <= 256, "INVALID_NUM_IDS");

        if (n < 8) {
            return 4;
        } else if (n < 16) {
            return 8;
        } else if (n < 32) {
            return 16;
        } else if (n < 64) {
            return 32;
        } else if (n < 128) {
            return 64;
        } else if (n < 256) {
            return 128;
        } else {
            return 256;
        }
    }
}

// A competitor provider for static competitors.
contract OracleCompetitorProvider is CompetitorProvider, Owned {
    ////////// MEMBER VARIABLES //////////

    // The mapping from competitor ID to metadata URI.
    mapping(uint256 => string) _metadataURIs;

    ////////// CONSTRUCTOR //////////

    constructor() Owned(msg.sender) {}

    function initalize(uint256[] memory ids, string[] memory uris) public {
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

// A result provider that acts as an oracle to determine the result of a match.
contract OracleResultProvider is ResultProvider, Owned {
    ////////// MEMBER VARIABLES //////////

    // The mapping of competitor ID to competitor ID to the winning ID.
    // The first competitor ID is aways less than the second competitor ID.
    mapping(uint256 => mapping(uint256 => uint256)) _results;

    // The mapping of competitor ID to competitor ID to the metadata of the match.
    // The first competitor ID is aways less than the second competitor ID.
    mapping(uint256 => mapping(uint256 => string)) _metadata;

    event resultAdded(uint256[] winners, uint256[] losers, string[] metadata);

    ////////// CONSTRUCTOR //////////
    constructor(address owner) Owned(owner) {}

    ////////// PUBLIC APIS //////////
    function getResult(uint256 competitor1, uint256 competitor2)
        public
        view
        override
        returns (Tournament.Result memory)
    {
        uint256 smallerId = competitor1 < competitor2 ? competitor1 : competitor2;
        uint256 biggerId = competitor1 < competitor2 ? competitor2 : competitor1;

        // Competitor IDs are non-zero.
        require(_results[smallerId][biggerId] != 0, "NO_SUCH_MATCH");

        return Tournament.Result({
            winnerId: _results[smallerId][biggerId],
            loserId: _results[smallerId][biggerId] == smallerId ? biggerId : smallerId,
            metadata: _metadata[smallerId][biggerId]
        });
    }

    ////////// ADMIN APIS //////////

    // Writes a batch of match results.
    function writeResults(uint256[] memory winners, uint256[] memory losers, string[] memory metadata)
        public
        onlyOwner
    {
        require(winners.length == losers.length, "COMPETITOR_MISMATCH");
        require(winners.length == metadata.length, "METADATA_MISMATCH");

        for (uint256 i = 0; i < winners.length; i++) {
            uint256 smallerId = winners[i] < losers[i] ? winners[i] : losers[i];
            uint256 biggerId = winners[i] < losers[i] ? losers[i] : winners[i];

            _results[smallerId][biggerId] = winners[i];
            _metadata[smallerId][biggerId] = metadata[i];
        }

        emit resultAdded(winners, losers, metadata);
    }
}

// A Tournament in which the competitors are statically defined, and the results
// are defined by an oracle.
contract StaticOracleTournament is Tournament {
    ////////// CONSTRUCTOR //////////
    constructor(OracleCompetitorProvider provider, OracleResultProvider oracle) Tournament(provider, oracle) {}
}
