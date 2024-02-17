"use client";
import Image from "next/image";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";
import farcaster from "../../public/farcaster.png";
import waves1 from "../../public/waves1.svg";
import waves2 from "../../public/waves2.svg";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  TOURNAMENT_CREATOR_ABI,
  TOURNAMENT_CREATOR_ADDRESS,
} from "../../constants/creator";
import { TOURNAMENT_ADDRESS, TOURANMENT_ABI } from "../../constants/tournament";
import {
  COMPPROVIDER_ABI,
  COMPPROVIDER_ADDRESS,
} from "../../constants/compProvider";
import { RESULTS_ABI, RESULTS_ADDRESS } from "../../constants/resultProvider";

// admin functions
// find entries and add in the tournament
// advance the round
// get results
export default function Home() {
  const currRound = 0;
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [participantsVotes, setParticipantsVotes] = useState<bigint[][][]>();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!isAdmin) {
      if (
        account?.toLowerCase() ==
        "0x62C43323447899acb61C18181e34168903E033Bf".toLowerCase()
      ) {
        console.log("Admin detected");
        setIsAdmin(true);
      }
    }
  }, [account]);

  const initialiseTournament = async () => {
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      console.log(data);

      const compIds = data.userIds;
      const compURIs = data.entries;
      console.log("Data and Entries fetched");

      if (compIds.length < 8 || compURIs.length < 8) {
        console.log(
          "Not enough entries to start the tournament. Need atleast 8 entries to start the tournament."
        );
        return;
      }

      if (!publicClient) {
        return;
      }
      const txdata = await publicClient.simulateContract({
        account,
        address: TOURNAMENT_CREATOR_ADDRESS,
        abi: TOURNAMENT_CREATOR_ABI,
        functionName: "initialiseTournament",
        args: [BigInt(1), compIds, compURIs],
      });

      if (!walletClient) {
        return;
      }

      const tx = await walletClient.writeContract(txdata.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      console.log(transaction);
      console.log(data.result);
      return {
        transaction,
        data,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const checkContract = async () => {
    try {
      if (!publicClient) {
        return;
      }
      const txdata = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "getBracket",
      });

      console.log(txdata);
      const noRounds = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "numRounds",
      });
      console.log(noRounds);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompetitors = async () => {
    try {
      if (!publicClient) {
        return;
      }
      const competitors = await publicClient.readContract({
        account,
        address: COMPPROVIDER_ADDRESS,
        abi: COMPPROVIDER_ABI,
        functionName: "listCompetitorIDs",
      });

      console.log(competitors);
      return competitors;
    } catch (error) {
      console.log(error);
    }
  };

  const getParticipantsEntry = async (participantAddress: `0x${string}`) => {
    try {
      if (!publicClient) {
        return;
      }
      const entry = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "getEntry",
        args: [participantAddress],
      });

      console.log(entry);
      return entry;
    } catch (error) {
      console.log(error);
    }
  };

  const getParticipantsVotes = async () => {
    try {
      if (!publicClient) {
        return;
      }
      const participants = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "listParticipants",
      });

      console.log("Participants", participants);

      let promises: any[] = [];

      participants.forEach(async (participant) => {
        promises.push(getParticipantsEntry(participant));
      });

      const participantsVotes: bigint[][][] = await Promise.all(promises);
      console.log("Participants Votes", participantsVotes);
      setParticipantsVotes(participantsVotes);
      // Array of participant's vote , which is in short an array of array's of the winners chosen for a round
      return participantsVotes;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateVotesRound1 = async () => {
    try {
      let round1PVotes: bigint[][] = [];
      if (!participantsVotes) {
        return;
      }

      participantsVotes.forEach((participantVote) => {
        round1PVotes.push(participantVote[currRound]);
      });

      console.log(round1PVotes);
      let votes: { [key: number]: number } = {};
      if (!publicClient) {
        return;
      }
      const bracket = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "getBracket",
      });
      const competitors = bracket[currRound];
      console.log(competitors);
      competitors.forEach((competitor) => {
        votes[Number(competitor)] = 0;
      });
      console.log(votes);

      round1PVotes.forEach((pvote) => {
        pvote.forEach((vote) => {
          votes[Number(vote)] += 1;
        });
      });

      console.log(votes);

      let round1Winners: bigint[] = [];
      let round1Losers: bigint[] = [];
      let round1Metadata: string[] = [];

      for (let i = 0; i < competitors.length; i += 2) {
        if (votes[Number(competitors[i])] > votes[Number(competitors[i + 1])]) {
          round1Winners.push(competitors[i]);
          round1Losers.push(competitors[i + 1]);
        } else {
          round1Losers.push(competitors[i]);
          round1Winners.push(competitors[i + 1]);
        }

        round1Metadata.push(
          `match ${i / 2} , votes-${competitors[i]} : ${
            votes[Number(competitors[i])]
          } , votes-${competitors[i + 1]} : ${
            votes[Number(competitors[i + 1])]
          }`
        );
      }

      console.log(round1Winners, round1Losers, round1Metadata);
      return {
        round1Winners,
        round1Losers,
        round1Metadata,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const writeResultsRound1 = async () => {
    try {
      const data = await calculateVotesRound1();
      if (!data) {
        return;
      }
      if (!publicClient) {
        return;
      }
      const txdata = await publicClient.simulateContract({
        account,
        address: RESULTS_ADDRESS,
        abi: RESULTS_ABI,
        functionName: "writeResults",
        args: [data.round1Winners, data.round1Losers, data.round1Metadata],
      });

      if (!walletClient) {
        return;
      }

      const tx = await walletClient.writeContract(txdata.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      console.log(transaction);
      console.log(txdata.result);

      // write the results to the KV db too
      data.round1Winners.forEach(async (winner, i) => {
        const writeData = {
          roundId: currRound + 1,
          matchId: i + 1,
          winnerFid: Number(winner),
        };

        const res = await fetch("/api/contest/results", {
          method: "POST",
          body: JSON.stringify(writeData),
        });
        console.log(res);
      });

      return {
        transaction,
        txdata,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const advanceRound = async () => {
    try {
      if (!publicClient) {
        console.log("No Wallet Detected");

        return;
      }
      const data = await publicClient.simulateContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "advance",
      });

      if (!walletClient) {
        console.log("No Wallet Detected");

        return;
      }

      const tx = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");

      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log(transaction);
      console.log(data.result);

      return {
        transaction,
        data,
      };

      // TODO : We have to store the rounds result in the KV db too ,so that while fetching for the image it just works
    } catch (error) {
      console.log(error);
    }
  };

  const storeRoundData = async () => {
    try {
      if (!publicClient) {
        return;
      }
      const txdata = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "getBracket",
      });

      console.log(txdata);

      const roundParticipants = txdata[currRound];
      for (let i = 0; i < roundParticipants.length; i += 2) {
        // store this roundData
        const roundData = {
          roundId: currRound + 1,
          matchId: i / 2 + 1,
          fid1: Number(roundParticipants[i]),
          fid2: Number(roundParticipants[i + 1]),
        };
        const res = await fetch("/api/contest/rounds", {
          method: "POST",
          body: JSON.stringify(roundData),
        });
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateVotes = async () => {
    // We have to define votes for each competitorId , so Create a competitorId as Key to Votes as Value mapping , for 8 of the competitors
    let votes: { [key: number]: number } = {};

    const competitors = await getCompetitors();
    if (!competitors) {
      return;
    }
    competitors.forEach((competitor) => {
      votes[Number(competitor)] = 0;
    });

    const participantsVotes = await getParticipantsVotes();
    // participantsVotes.forEach((participantVote) => {
    //   participantVote.forEach()
    // })
  };

  const getParitipantPoints = async (participantAddress: `0x${string}`) => {
    try {
      if (!publicClient) {
        return;
      }
      const points = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "getParticipant",
        args: [participantAddress],
      });

      console.log(points);
      return points;
    } catch (error) {
      console.log(error);
    }
  };
  const getParticipantsPoints = async () => {
    try {
      if (!publicClient) {
        return;
      }
      const participants = await publicClient.readContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "listParticipants",
      });

      console.log("Participants", participants);

      let promises: any[] = [];

      participants.forEach(async (participant) => {
        promises.push(getParitipantPoints(participant));
      });

      const participantsPoints: {
        addr: `0x${string}`;
        points: bigint;
      }[] = await Promise.all(promises);

      console.log("Participants Leaderboard", participantsPoints);
      // Array of participants with their points with sorted according to the points
      participantsPoints.sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      });
      console.log("Participants Leaderboard Sorted", participantsPoints);

      return participantsPoints;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center py-20 gap-12 bg-[#121312] relative">
        <Image
          src={waves1}
          alt="farcaster"
          className="z-0 absolute bottom-0 right-0 w-[1200px] "
        />
        <Image
          src={waves2}
          alt="farcaster"
          className="absolute left-0 top-0 -z-11 w-[1000px] "
        />
        <ConnectButton />

        <div className=" z-10 text-white flex flex-col space-y-5 items-center justify-center max-w-3xl text-center">
          <Image src={farcaster} alt="farcaster" className=" w-20" />
          {isAdmin ? (
            <>
              <h1 className=" text-4xl font-semibold">Hello Admin !!</h1>
              <p></p>
              <button
                onClick={() => initialiseTournament()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Initialise Tournament
              </button>
              <button
                onClick={() => checkContract()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                get bracket
              </button>
              <button
                onClick={() => getParticipantsVotes()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Participants
              </button>

              <button
                onClick={() => calculateVotesRound1()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Calculate Round Votes
              </button>
              <button
                onClick={() => writeResultsRound1()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Write Round Votes
              </button>
              <button
                onClick={() => advanceRound()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Advance round
              </button>
              <button
                onClick={() => storeRoundData()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Store round Data
              </button>

              <button
                onClick={() => getParticipantsPoints()}
                className="bg-[#FFA500] p-3 rounded-md"
              >
                Participants points
              </button>
            </>
          ) : (
            <>
              <h1 className=" text-4xl font-semibold">
                Haiyaaah, Welcome to Frames-64
              </h1>
              <p>
                Welcome to our lab of laughs, where {`we're`} mixing wit with
                whimsy and experimenting with the very fabric of humor itself!
                Step into our world of frames, where every joke is a brushstroke
                on the canvas of comedy. Warning: side effects may include
                uncontrollable laughter and a newfound appreciation for puns.
                Checkout our framse, we dare you :D
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
