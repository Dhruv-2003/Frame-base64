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
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

interface userDataType {
  displayName: string;
  entry: string;
  fid: number;
  profileImage: string;
  username: string;
  bio: string;
}

const tournamentId = "1";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
import Loader, { SmallLoader } from "./loader";
import { cn } from "@/lib/utils";

export default function Contest() {
  const { address: account, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [userData, setUserData] = useState<any>();

  const [tournamentInfo, setTournamentInfo] = useState<any>();
  // let roundOneteamOneMembers = ["John", "Alice"];
  // let roundOneteamTwoMembers = ["Charlie", "Diana"];
  // let roundOneteamThreeMembers = ["Ram", "Lakshman"];
  // let roundOneteamFourMembers = ["Kushagra", "Dhruv"];
  const [roundOneteamOneMembers, setRoundOneteamOneMembers] =
    useState<userDataType[]>();
  const [roundOneteamTwoMembers, setRoundOneteamTwoMembers] =
    useState<userDataType[]>();
  const [roundOneteamThreeMembers, setRoundOneteamThreeMembers] =
    useState<userDataType[]>();
  const [roundOneteamFourMembers, setRoundOneteamFourMembers] =
    useState<userDataType[]>();

  const [roundOneTeamOneWinner, setRoundOneTeamOneWinner] =
    useState<userDataType>();
  const [roundOneTeamTwoWinner, setRoundOneTeamTwoWinner] =
    useState<userDataType>();
  const [roundOneTeamThreeWinner, setRoundOneTeamThreeWinner] =
    useState<userDataType>();
  const [roundOneTeamFourWinner, setRoundOneTeamFourWinner] =
    useState<userDataType>();

  const roundTwoTeamOneMembers = [roundOneTeamOneWinner, roundOneTeamTwoWinner];
  const roundTwoTeamTwoMembers = [
    roundOneTeamThreeWinner,
    roundOneTeamFourWinner,
  ];

  const [roundTwoTeamOneWinner, setRoundTwoTeamOneWinner] =
    useState<userDataType>();
  const [roundTwoTeamTwoWinner, setRoundTwoTeamTwoWinner] =
    useState<userDataType>();

  const [finalWinner, setFinalWinner] = useState<userDataType>();

  const finalists = [roundTwoTeamOneWinner, roundTwoTeamTwoWinner];

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   round one handle functions
  const handleRoundOneTeamOneWinner = (winner: userDataType) => {
    setRoundOneTeamOneWinner(winner);
  };

  const handleRoundOneTeamTwoWinner = (winner: userDataType) => {
    setRoundOneTeamTwoWinner(winner);
  };

  const handleRoundOneTeamThreeWinner = (winner: userDataType) => {
    setRoundOneTeamThreeWinner(winner);
  };

  const handleRoundOneTeamFourWinner = (winner: userDataType) => {
    setRoundOneTeamFourWinner(winner);
  };

  //   round two handle functions
  const handleRoundTwoTeamOneWinner = (winner: userDataType) => {
    setRoundTwoTeamOneWinner(winner);
  };

  const handleRoundTwoTeamTwoWinner = (winner: userDataType) => {
    setRoundTwoTeamTwoWinner(winner);
  };

  const handleFinalWinner = (winner: userDataType) => {
    setFinalWinner(winner);
  };

  const submitEntry = async () => {
    try {
      setIsLoading(true);
      let entry: bigint[][] = [];
      if (!isConnected) {
        setIsLoading(false);
        console.log("No Wallet Detected");
        toast.error("No Wallet Detected");
        return;
      }
      if (
        roundOneTeamOneWinner?.fid &&
        roundOneTeamTwoWinner?.fid &&
        roundOneTeamThreeWinner?.fid &&
        roundOneTeamFourWinner?.fid &&
        roundTwoTeamOneWinner?.fid &&
        roundTwoTeamTwoWinner?.fid &&
        finalWinner?.fid
      ) {
        const mockEntry = [
          [
            BigInt(roundOneTeamOneWinner?.fid),
            BigInt(roundOneTeamTwoWinner?.fid),
            BigInt(roundOneTeamThreeWinner?.fid),
            BigInt(roundOneTeamFourWinner?.fid),
          ],
          [
            BigInt(roundTwoTeamOneWinner?.fid),
            BigInt(roundTwoTeamTwoWinner?.fid),
          ],
          [BigInt(finalWinner?.fid)],
        ];
        console.log(mockEntry);
        // prepare the data
        if (!publicClient) {
          setIsLoading(false);
          console.log("No Wallet Detected");
          toast.error("No Wallet Detected");
          return;
        }
        const data = await publicClient.simulateContract({
          account,
          address: TOURNAMENT_ADDRESS,
          abi: TOURANMENT_ABI,
          functionName: "submitEntry",
          args: [mockEntry],
        });

        if (!walletClient) {
          setIsLoading(false);
          console.log("No Wallet Detected");
          toast.error("Please Connect your Wallet");
          return;
        }

        const tx = await walletClient.writeContract(data.request);
        console.log("Transaction Sent");
        toast.success("Transaction intiated successfully");
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: tx,
        });
        console.log(transaction);
        console.log(data.result);
        setIsLoading(false);
        return {
          transaction,
          data,
        };
      } else {
        setIsLoading(false);
        console.log("Not enough Data. Make Proper selection");
        toast.error("Please select entries for all rounds");
      }
    } catch (error) {
      setIsLoading(false);
      // const errorMessage = error.message.slice(0, 25) as string;
      // toast.error(`${errorMessage}`);
      // @ts-ignore
      toast.error(`${error.message}`);
      console.log("user rejected =====>>>>", error);
    }
  };

  const getUsersInfo = async (compIds: bigint[], compURIs: string[]) => {
    try {
      setIsLoading(true);
      // fetch the user's other data

      let promises: any[] = [];

      compIds.forEach((fid, i) => {
        promises.push(getUserFarcasterInfo(Number(fid), compURIs[i]));
      });

      let userData = await Promise.all(promises);
      console.log(userData);
      setUserData(userData);
      if (userData.length !== 8) return console.log("Not enough users");
      if (!userData) return console.log("No user data");

      setRoundOneteamOneMembers([userData[0], userData[1]]);
      setRoundOneteamTwoMembers([userData[2], userData[3]]);
      setRoundOneteamThreeMembers([userData[4], userData[5]]);
      setRoundOneteamFourMembers([userData[6], userData[7]]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error fetching user data");
      console.log(error);
    }
  };

  const getTournamentsInfo = async () => {
    try {
      setIsLoading(true);
      const data = await getTournamentInfo(tournamentId);
      console.log(data);
      setTournamentInfo(data.tournament);
      const tournament = data.tournament;
      const compIds = tournament.compIDs;
      const compURIs = tournament.compURIs;

      getUsersInfo(compIds, compURIs);
      // await fetch("/api/entries");
    } catch (error) {
      setIsLoading(false);
      toast.error("Error fetching user Tournaments data");
      console.log(error);
    }
  };

  const getUserFarcasterInfo = async (fid: number, compURI: string) => {
    try {
      setIsLoading(true);
      // Optional to use Airstack , or Neynar API if needed
      const userData = await getUserDataForFid({ fid });

      console.log(userData);
      return {
        ...userData,
        entry: compURI,
        fid: fid,
      };
    } catch (error) {
      setIsLoading(false);
      toast.error("Error fetching user  Farcaster data");
      console.log(error);
    }
  };

  const fundGasNeededfortransacton = async () => {
    try {
      setIsLoading(true);
      if (!isConnected) {
        setIsLoading(false);
        console.log("No Wallet Detected");
        toast.error("No Wallet Detected");
        return;
      }
      if (
        roundOneTeamOneWinner?.fid &&
        roundOneTeamTwoWinner?.fid &&
        roundOneTeamThreeWinner?.fid &&
        roundOneTeamFourWinner?.fid &&
        roundTwoTeamOneWinner?.fid &&
        roundTwoTeamTwoWinner?.fid &&
        finalWinner?.fid
      ) {
        const mockEntry = [
          [
            BigInt(roundOneTeamOneWinner?.fid),
            BigInt(roundOneTeamTwoWinner?.fid),
            BigInt(roundOneTeamThreeWinner?.fid),
            BigInt(roundOneTeamFourWinner?.fid),
          ],
          [
            BigInt(roundTwoTeamOneWinner?.fid),
            BigInt(roundTwoTeamTwoWinner?.fid),
          ],
          [BigInt(finalWinner?.fid)],
        ];
        console.log(mockEntry);
        if (!publicClient) {
          setIsLoading(false);
          console.log("No Wallet Detected");
          toast.error("No Wallet Detected");
          return;
        }
        const data = await publicClient.simulateContract({
          account,
          address: TOURNAMENT_ADDRESS,
          abi: TOURANMENT_ABI,
          functionName: "submitEntry",
          args: [mockEntry],
        });
        console.log("Call Valid for User");

        if (!PRIVATE_KEY) {
          console.log("No Private Key Found");
          return;
        }
        // console.log(PRIVATE_KEY);
        const accountLocal = privateKeyToAccount(`0x${PRIVATE_KEY}`);
        // prepare the data
        const publicClientLocal = createPublicClient({
          chain: baseSepolia,
          transport: http("https://sepolia.base.org"),
        });

        const gasEstimate = await publicClientLocal.estimateContractGas({
          account: accountLocal,
          address: TOURNAMENT_ADDRESS,
          abi: TOURANMENT_ABI,
          functionName: "submitEntry",
          args: [mockEntry],
        });
        console.log("Gas Estimate", gasEstimate);
        // const { maxFeePerGas, maxPriorityFeePerGas } =
        //   await publicClientLocal.estimateFeesPerGas();
        // // const { gasPrice } = await publicClientLocal.estimateFeesPerGas({
        // //   type: "legacy",
        // // });
        // const gasPrice = await publicClientLocal.getGasPrice();
        // console.log(gasPrice);
        setIsLoading(false);

        if (!walletClient) {
          setIsLoading(false);
          console.log("No Wallet Detected");
          toast.error("Please Connect your Wallet");
          return;
        }

        const walletClientLocal = await createWalletClient({
          chain: baseSepolia,
          account: accountLocal,
          transport: http("https://sepolia.base.org"),
        });
        // if (!maxFeePerGas || !maxPriorityFeePerGas)
        //   return console.log("No Gas Fee Found");
        // console.log(maxFeePerGas, maxPriorityFeePerGas);

        // const totalGasValueMax =
        //   maxFeePerGas * gasEstimate + maxPriorityFeePerGas * gasEstimate;
        // console.log("Total Gas max", totalGasValueMax);
        // const totalGas = gasPrice * gasEstimate;
        // console.log("Total gas", totalGas);

        const gasValue = parseEther("0.001");

        const tx = await walletClientLocal.sendTransaction({
          to: account,
          value: gasValue,
        });

        console.log("Transaction Sent");
        toast.success("Transaction initated successfully");

        const transaction = await publicClient.waitForTransactionReceipt({
          hash: tx,
        });
        console.log(transaction);
        console.log(data.result);
        setIsLoading(false);

        return {
          transaction,
          data,
        };
      } else {
        setIsLoading(false);
        console.log("Not enough Data. Make Proper selection");
        toast.error("Please select entries for all rounds");
      }
    } catch (error) {
      setIsLoading(false);
      // @ts-ignore
      // const errorMessage = error.message.slice(0, 25) as string;
      toast.error(`${error.message}`);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!tournamentInfo && !userData && !isLoading) {
      getTournamentsInfo();
    }
  }, [tournamentId]);

  if (isLoading && !userData && !tournamentInfo) {
    return (
      <div className="z-10 text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" z-10 text-white space-y-10">
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
              {roundOneteamOneMembers &&
                roundOneteamOneMembers.map((member, index) => (
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
                      {member.displayName}
                    </HoverCardTrigger>
                    <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                      {member.entry}
                    </HoverCardContent>
                  </HoverCard>
                ))}
            </div>
          </div>
          {/* team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamTwoMembers &&
                roundOneteamTwoMembers.map((member, index) => (
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
                      {member.displayName}
                    </HoverCardTrigger>
                    <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                      {member.entry}
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
            {roundTwoTeamOneMembers &&
              roundTwoTeamOneMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundTwoTeamOneWinner === member
                        ? "bg-[#a889fe] text-white"
                        : "bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer
                  `
                    )}
                    // @ts-ignore
                    onClick={() => handleRoundTwoTeamOneWinner(member)}
                  >
                    {member?.displayName}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    {member?.entry}
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
            {finalists &&
              finalists.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      finalWinner === member
                        ? "bg-[#a889fe] text-white"
                        : "bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer 
                    `
                    )}
                    // @ts-ignore
                    onClick={() => handleFinalWinner(member)}
                  >
                    {member?.displayName}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    {member?.entry}
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
                      {finalWinner.displayName}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    {finalWinner?.entry}
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
            {roundTwoTeamTwoMembers &&
              roundTwoTeamTwoMembers.map((member, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger
                    className={cn(
                      roundTwoTeamTwoWinner === member
                        ? "bg-[#a889fe] text-white"
                        : "bg-white text-black",
                      `w-40 h-12 rounded-xl p-3 cursor-pointer
                    `
                    )}
                    // @ts-ignore
                    onClick={() => handleRoundTwoTeamTwoWinner(member)}
                  >
                    {member?.displayName}
                  </HoverCardTrigger>
                  <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                    {member?.entry}
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
              {roundOneteamThreeMembers &&
                roundOneteamThreeMembers.map((member, index) => (
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
                      {member.displayName}
                    </HoverCardTrigger>
                    <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                      {member.entry}
                    </HoverCardContent>
                  </HoverCard>
                ))}
            </div>
          </div>
          {/* right round 1 team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-l border-white pl-4">
              {roundOneteamFourMembers &&
                roundOneteamFourMembers.map((member, index) => (
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
                      {member.displayName}
                    </HoverCardTrigger>
                    <HoverCardContent className=" dark:text-black dark:bg-white py-4">
                      {member.entry}
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
        <div className=" flex items-center gap-4">
          <Button
            variant={"default"}
            onClick={() => fundGasNeededfortransacton()}
          >
            {isLoading ? <SmallLoader /> : "Get Gas Needed for Tx ⛽️"}
          </Button>
          <Button variant={"default"} onClick={submitEntry}>
            {isLoading ? <SmallLoader /> : "Submit Your Prediction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
