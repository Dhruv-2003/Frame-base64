export const TOURNAMENT_CREATOR_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tournament",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "compProvider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "resultOracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "uri",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
    ],
    name: "tournamentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "compIDs",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "compURIs",
        type: "string[]",
      },
    ],
    name: "tournamentInitialised",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tournamentURI",
        type: "string",
      },
    ],
    name: "createTournament",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tournamentId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "compIDs",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "compURIs",
        type: "string[]",
      },
    ],
    name: "initialiseTournament",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTournaments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tournaments",
    outputs: [
      {
        internalType: "address",
        name: "tournament",
        type: "address",
      },
      {
        internalType: "address",
        name: "compProvider",
        type: "address",
      },
      {
        internalType: "address",
        name: "resultOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const TOURNAMENT_CREATOR_ADDRESS =
  "0x95b7dD6016aa284720DE1a2ef6acaae6afab8F90";
