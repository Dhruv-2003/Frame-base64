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

// admin functions
// find entries and add in the tournament
// advance the round
// get results
export default function Home() {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

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

      participants.forEach((participant) => {
        promises.push(getParticipantsEntry(participant));
      });

      const participantsVotes = await Promise.all(promises);
      console.log("Participants Votes", participantsVotes);
      // Array of participant's vote , which is in short an array of array's of the winners chosen for a round
      return participantsVotes;
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
                Participants
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
