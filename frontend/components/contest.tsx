"use client";

import React, { useState } from "react";

export default function Contest() {
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

  const finalists = [roundTwoTeamOneWinner, roundTwoTeamTwoWinner];

  const finalWinner = finalists[Math.round(Math.random())];

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

  return (
    <div className=" z-10 text-white space-y-10">
      <h1 className=" text-6xl font-semibold text-center">Frames 64</h1>
      <div className="flex text-center items-center justify-between w-screen p-12 relative">
        {/* round 1 */}
        <div className=" space-y-12 ">
          {/* team 1 */}
          <div className=" space-y-4 ">
            <div className=" text-2xl text-center font-semibold">Round 1</div>
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamOneMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundOneTeamOneWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundOneTeamOneWinner(member)}
                >
                  {member}
                </div>
              ))}
            </div>
          </div>
          {/* team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-r border-white pr-4">
              {roundOneteamTwoMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundOneTeamTwoWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundOneTeamTwoWinner(member)}
                >
                  {member}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* round 2 */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Round 2</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            {roundTwoTeamOneMembers.map((member, index) => (
              <div
                key={index}
                className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                  roundTwoTeamOneWinner === member ? "opacity-50" : ""
                }`}
                onClick={() => handleRoundTwoTeamOneWinner(member)}
              >
                {member}
              </div>
            ))}
          </div>
        </div>
        {/* final winner */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Winner</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            <div className=" w-40 bg-white rounded-xl  p-3 text-black">
              {finalWinner}
            </div>
          </div>
        </div>

        {/* right round 2 */}
        <div className=" space-y-4">
          <div className=" text-2xl text-center font-semibold">Round 2</div>
          <div className=" flex flex-col items-center gap-5 border-x border-white px-4">
            {roundTwoTeamTwoMembers.map((member, index) => (
              <div
                key={index}
                className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                  roundTwoTeamTwoWinner === member ? "opacity-50" : ""
                }`}
                onClick={() => handleRoundTwoTeamTwoWinner(member)}
              >
                {member}
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
              {roundOneteamThreeMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundOneTeamThreeWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundOneTeamThreeWinner(member)}
                >
                  {member}
                </div>
              ))}
            </div>
          </div>
          {/* right round 1 team 2 */}
          <div className=" space-y-4">
            <div className=" flex flex-col items-center gap-5 border-l border-white pl-4">
              {roundOneteamFourMembers.map((member, index) => (
                <div
                  key={index}
                  className={`w-40 bg-white rounded-xl p-3 text-black cursor-pointer ${
                    roundOneTeamFourWinner === member ? "opacity-50" : ""
                  }`}
                  onClick={() => handleRoundOneTeamFourWinner(member)}
                >
                  {member}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* left */}
        <div className=" w-[104px] border-t border-white absolute left-[15.6vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[27.5vh] left-[36.1vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[30.2vh] left-[15.6vw]" />
        {/* right */}
        <div className=" w-[104px] border-t border-white absolute right-[15.6vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[27.5vh] right-[36.1vw]" />
        <div className=" w-[104px] border-t border-white absolute top-[30.2vh] right-[15.6vw]" />
      </div>
    </div>
  );
}