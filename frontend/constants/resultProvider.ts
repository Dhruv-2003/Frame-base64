export const RESULTS_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "winners",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "losers",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "metadata",
        type: "string[]",
      },
    ],
    name: "resultAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "competitor1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "competitor2",
        type: "uint256",
      },
    ],
    name: "getResult",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "winnerId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "loserId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct Tournament.Result",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "winners",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "losers",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "metadata",
        type: "string[]",
      },
    ],
    name: "writeResults",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const RESULTS_ADDRESS = "0x36d5cfF613c8D0616a2dbF3c6e4Ca46a0fb39671";
