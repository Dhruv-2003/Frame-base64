"use client";

import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { TOURANMENT_ABI, TOURNAMENT_ADDRESS } from "../constants/tournament";
import { getTournamentInfo } from "../utils/graph";
import { getUserDataForFid } from "frames.js";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getCompetitorEntries } from "../utils/kv";
import { Button } from "@/components/ui/button";
import Loader from "./loader";
import { cn } from "@/lib/utils";

export default function Contest() {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [tournamentInfo, setTournamentInfo] = useState<any>();
  const roundOneteamOneMembers = ["John", "Alice"];
  const roundOneteamTwoMembers = ["Charlie", "Diana"];
  const roundOneteamThreeMembers = ["Ram", "Lakshman"];
  const roundOneteamFourMembers = ["Kushagra", "Dhruv"];

  const [roundOneTeamOneWinner, setRoundOneTeamOneWinner] = useState("");
  const [roundOneTeamTwoWinner, setRoundOneTeamTwoWinner] = useState("");
  const [roundOneTeamThreeWinner, setRoundOneTeamThreeWinner] = useState("");
  const [roundOneTeamFourWinner, setRoundOneTeamFourWinner] = useState("");

  const roundTwoTeamOneMembers = [roundOneTeamOneWinner, roundOneTeamTwoWinner];
  const roundTwoTeamTwoMembers = [
    roundOneTeamThreeWinner,
    roundOneTeamFourWinner,
  ];

  const [roundTwoTeamOneWinner, setRoundTwoTeamOneWinner] = useState("");
  const [roundTwoTeamTwoWinner, setRoundTwoTeamTwoWinner] = useState("");

  const [finalWinner, setFinalWinner] = useState("");

  const finalists = [roundTwoTeamOneWinner, roundTwoTeamTwoWinner];

  //   round one handle functions
  const handleRoundOneTeamOneWinner = (winner: string) => {
    setRoundOneTeamOneWinner(winner);
  };

  const handleRoundOneTeamTwoWinner = (winner: string) => {
    setRoundOneTeamTwoWinner(winner);
  };

  const handleRoundOneTeamThreeWinner = (winner: string) => {
    setRoundOneTeamThreeWinner(winner);
  };

  const handleRoundOneTeamFourWinner = (winner: string) => {
    setRoundOneTeamFourWinner(winner);
  };

  //   round two handle functions
  const handleRoundTwoTeamOneWinner = (winner: string) => {
    setRoundTwoTeamOneWinner(winner);
  };

  const handleRoundTwoTeamTwoWinner = (winner: string) => {
    setRoundTwoTeamTwoWinner(winner);
  };

  const handleFinalWinner = (winner: string) => {
    setFinalWinner(winner);
  };

  const submitEntry = async () => {
    try {
      let entry: bigint[][] = [];
      const mockEntry = [
        [
          roundOneTeamOneWinner,
          roundOneTeamTwoWinner,
          roundOneTeamThreeWinner,
          roundOneTeamFourWinner,
        ],
        [roundTwoTeamOneWinner, roundTwoTeamTwoWinner],
        [finalWinner],
      ];
      // prepare the data
      if (!publicClient) {
        return;
      }
      const data = await publicClient.simulateContract({
        account,
        address: TOURNAMENT_ADDRESS,
        abi: TOURANMENT_ABI,
        functionName: "submitEntry",
        args: [entry],
      });

      if (!walletClient) {
        return;
      }

      const tx = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      toast("Event initiated succesfully.");

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
      console.log(error);
      toast("");
    }
  };

  const getUsersInfo = async () => {};

  const getTournamentsInfo = async () => {
    try {
      const data = await getTournamentInfo("2");
      console.log(data);
      setTournamentInfo(data.tournamet);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserFarcasterInfo = async (fid: number) => {
    try {
      // Optional to use Airstack , or Neynar API if needed
      const userData = await getUserDataForFid({ fid });

      console.log(userData);
      return userData;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!tournamentInfo) {
      getTournamentsInfo();
    }
  }, []);

  return (
    <div className=" z-10 text-white space-y-10">
      {/* <Loader /> */}
      <div className=" flex items-center justify-between w-full md:max-w-7xl mx-auto">
        <h1 className=" text-6xl font-semibold text-center">Frames 64 </h1>
        <ConnectButton />
      </div>
      <div className="flex text-center items-center justify-between w-screen p-12 relative">
        {/* round 1 */}
        <div className=" space-y-12 ">
          {/* team 1 */}
          <div className=" space-y-4 ">
            <div className=" text-2xl text-center font-semibold">Round 1</div>
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamOneMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundOneTeamOneWinner === member
                        ? " bg-[#a889fe] text-white"
                        : " bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer`
                    )}
                    onClick={() => handleRoundOneTeamOneWinner(member)}
                  >
                    {member}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    Hover content here
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
          {/* team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamTwoMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundOneTeamTwoWinner === member
                        ? "bg-[#a889fe] text-white"
                        : " bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer`
                    )}
                    onClick={() => handleRoundOneTeamTwoWinner(member)}
                  >
                    {member}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    Hover content here
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
        {/* round 2 */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Round 2</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            {roundTwoTeamOneMembers.map((member, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger
                  className={cn(
                    roundTwoTeamOneWinner === member
                      ? "bg-[#a889fe] text-white"
                      : "bg-white text-black",
                    `w-40 h-12 rounded-xl p-3 cursor-pointer
                  `
                  )}
                  onClick={() => handleRoundTwoTeamOneWinner(member)}
                >
                  {member}
                </HoverCardTrigger>
                <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                  Hover content here
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
        {/* final winner */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Final Round</div>

          <div
            className={` ${
              !finalWinner && "border-x"
            } flex flex-col items-center gap-5  border-white px-4`}
          >
            {finalists.map((member, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger
                  className={cn(
                    finalWinner === member
                      ? "bg-[#a889fe] text-white"
                      : "bg-white text-black",
                    `w-40 h-12 rounded-xl p-3 cursor-pointer 
                    `
                  )}
                  onClick={() => handleFinalWinner(member)}
                >
                  {member}
                </HoverCardTrigger>
                <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                  Hover content here
                </HoverCardContent>
              </HoverCard>
            ))}

            {finalWinner && (
              <div className=" space-y-4">
                <div className=" text-2xl text-center font-semibold mb-4">
                  Winner
                </div>
                <HoverCard>
                  <HoverCardTrigger>
                    <div className=" w-40 h-12 bg-[#a889fe] text-white rounded-xl p-3">
                      {finalWinner}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    Hover content here
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>
          <br />
        </div>

        {/* <div className=" w-40 bg-white rounded-xl  p-3 text-black"></div> */}
        {/* right round 2 */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Round 2</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            {roundTwoTeamTwoMembers.map((member, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger
                  className={cn(
                    roundTwoTeamTwoWinner === member
                      ? "bg-[#a889fe] text-white"
                      : "bg-white text-black",
                    `w-40 h-12 rounded-xl p-3 cursor-pointer
                    `
                  )}
                  onClick={() => handleRoundTwoTeamTwoWinner(member)}
                >
                  {member}
                </HoverCardTrigger>
                <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                  Hover content here
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* right round 1 */}
        <div className=" space-y-12 ">
          {/* right round 1 team 1 */}
          <div className=" space-y-4">
            <div className=" text-2xl text-center font-semibold">Round 1</div>
            <div className=" flex flex-col items-center gap-5 border-l border-white pl-4">
              {roundOneteamThreeMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundOneTeamThreeWinner === member
                        ? "bg-[#a889fe] text-white"
                        : "bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer
                      `
                    )}
                    onClick={() => handleRoundOneTeamThreeWinner(member)}
                  >
                    {member}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    Hover content here
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
          {/* right round 1 team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-l border-white pl-4">
              {roundOneteamFourMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundOneTeamFourWinner === member
                        ? "bg-[#a889fe] text-white"
                        : "bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer 
                      `
                    )}
                    onClick={() => handleRoundOneTeamFourWinner(member)}
                  >
                    {member}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    Hover content here
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>

        {/* left */}
        {/* <div className=" w-[104px] border-t border-white absolute left-[15.6vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[27.5vh] left-[36.1vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[30.2vh] left-[15.6vw]" /> */}
        {/* right */}
        {/* <div className=" w-[104px] border-t border-white absolute right-[15.6vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[27.5vh] right-[36.1vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[30.2vh] right-[15.6vw]" /> */}
      </div>
      <div className=" w-full flex flex-col gap-4 items-center justify-center">
        <p className=" max-w-lg text-xl font-semibold text-center ">
          Hover on participants name to view their entry, click on the name to
          predict round winners and submit below to save your response.
        </p>
        <Button variant={"default"} onClick={submitEntry}>
          Submit Your Prediction
        </Button>
      </div>
    </div>
  );
}
