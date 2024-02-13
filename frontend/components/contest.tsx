"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { TOURANMENT_ABI, TOURNAMENT_ADDRESS } from "../constants/tournament";
import { getTournamentInfo } from "../utils/graph";
import { getUserDataForFid } from "frames.js";
import { getCompetitorEntries } from "../utils/kv";

interface userDataType {
  displayName: string;
  entry: string;
  fid: number;
  profileImage: string;
  username: string;
  bio: string;
}

export default function Contest() {
  const { address: account } = useAccount();
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
      let entry: bigint[][] = [];
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
            roundOneTeamOneWinner?.fid,
            roundOneTeamTwoWinner?.fid,
            roundOneTeamThreeWinner?.fid,
            roundOneTeamFourWinner?.fid,
          ],
          [roundTwoTeamOneWinner?.fid, roundTwoTeamTwoWinner?.fid],
          [BigInt(finalWinner?.fid)],
        ];
        console.log(mockEntry);
        // // prepare the data
        // if (!publicClient) {
        //   return;
        // }
        // const data = await publicClient.simulateContract({
        //   account,
        //   address: TOURNAMENT_ADDRESS,
        //   abi: TOURANMENT_ABI,
        //   functionName: "submitEntry",
        //   args: [entry],
        // });

        // if (!walletClient) {
        //   return;
        // }

        // const tx = await walletClient.writeContract(data.request);
        // console.log("Transaction Sent");
        // const transaction = await publicClient.waitForTransactionReceipt({
        //   hash: tx,
        // });
        // console.log(transaction);
        // console.log(data.result);
        // return {
        //   transaction,
        //   data,
        // };
      } else {
        console.log("Not enough Data. Make Proper selection");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersInfo = async (compIds: bigint[], compURIs: string[]) => {
    try {
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

      setRoundOneteamOneMembers([
        userData[0].displayName,
        userData[1].displayName,
      ]);
      setRoundOneteamTwoMembers([
        userData[2].displayName,
        userData[3].displayName,
      ]);
      setRoundOneteamThreeMembers([
        userData[4].displayName,
        userData[5].displayName,
      ]);
      setRoundOneteamFourMembers([
        userData[6].displayName,
        userData[7].displayName,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getTournamentsInfo = async () => {
    try {
      const data = await getTournamentInfo("1");
      console.log(data);
      setTournamentInfo(data.tournament);
      const tournament = data.tournament;
      const compIds = tournament.compIDs;
      const compURIs = tournament.compURIs;

      getUsersInfo(compIds, compURIs);
      // await fetch("/api/entries");
    } catch (error) {
      console.log(error);
    }
  };

  const getUserFarcasterInfo = async (fid: number, compURI: string) => {
    try {
      // Optional to use Airstack , or Neynar API if needed
      const userData = await getUserDataForFid({ fid });

      console.log(userData);
      return {
        ...userData,
        entry: compURI,
        fid: fid,
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!tournamentInfo && !userData) {
      getTournamentsInfo();
    }
  }, []);

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
                  <div
                    key={index}
                    className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                      roundOneTeamOneWinner === member ? "opacity-50" : ""
                    }`}
                    onClick={() => handleRoundOneTeamOneWinner(member)}
                  >
                    {member.displayName}
                  </div>
                ))}
            </div>
          </div>
          {/* team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamTwoMembers &&
                roundOneteamTwoMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                      roundOneTeamTwoWinner === member ? "opacity-50" : ""
                    }`}
                    onClick={() => handleRoundOneTeamTwoWinner(member)}
                  >
                    {member.displayName}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* round 2 */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Round 2</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            {roundTwoTeamOneMembers[0] &&
              roundTwoTeamOneMembers[1] &&
              roundTwoTeamOneMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundTwoTeamOneWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundTwoTeamOneWinner(member)}
                >
                  {member?.displayName}
                </div>
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
            {/* {!finalWinner &&
              finalists.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    finalWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleFinalWinner(member)}
                >
                  {member}
                </div>
              ))} */}

            {finalists[0] &&
              finalists[1] &&
              finalists.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    finalWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleFinalWinner(member)}
                >
                  {member?.displayName}
                </div>
              ))}

            {finalWinner && (
              <div className=" space-y-4">
                <div className=" text-2xl text-center font-semibold">
                  Winner
                </div>
                <div className=" w-40 bg-white rounded-xl  p-3 text-black">
                  {finalWinner.displayName}
                </div>
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
            {roundTwoTeamTwoMembers[0] &&
              roundTwoTeamTwoMembers[1] &&
              roundTwoTeamTwoMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundTwoTeamTwoWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundTwoTeamTwoWinner(member)}
                >
                  {member?.displayName}
                </div>
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
                  <div
                    key={index}
                    className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                      roundOneTeamThreeWinner === member ? "opacity-50" : ""
                    }`}
                    onClick={() => handleRoundOneTeamThreeWinner(member)}
                  >
                    {member.displayName}
                  </div>
                ))}
            </div>
          </div>
          {/* right round 1 team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-l border-white pl-4">
              {roundOneteamFourMembers &&
                roundOneteamFourMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                      roundOneTeamFourWinner === member ? "opacity-50" : ""
                    }`}
                    onClick={() => handleRoundOneTeamFourWinner(member)}
                  >
                    {member.displayName}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <button onClick={() => submitEntry()}>Submit</button>
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
    </div>
  );
}
