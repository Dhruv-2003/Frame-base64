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

        <div className=" relative flex h-[476px] w-[910px] flex-col items-center justify-center border bg-[#121312] p-4">
          <div className="absolute top-0 left-0 w-[640px]">
            <svg
              width="640"
              height="280"
              viewBox="0 0 1920 1080"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="1920" height="1080" fill="#121312" />
              <path
                d="M809,20.999999999999815C833.043473349111,81.95237393459553,767.1027008490355,164.06087419638797,703.1590932319507,221.69236147559968C639.2154856148659,279.3238487548114,495.90441220594755,299.5683442857035,425.33835429749087,366.78892367527015C354.7722963890342,434.0095030648368,360.3851960725824,602.3762696156418,279.7627457812106,625.0158378129995C199.14029548983876,647.6554060103572,10.824071217347452,496.0424636885278,-58.396347450739995,502.62633285941604C-127.61676611882744,509.2102020303043,-53.332033172235626,675.0669658252517,-135.55976622731404,664.519052838329C-217.78749928239245,653.9711398514063,-452.4209233940371,521.6030690587146,-551.7627457812105,439.3388549378798C-651.1045681683838,357.0746408170449,-709.8027080888302,256.8683581583146,-731.6107005503542,170.9337681133198C-753.4186930118782,84.99917806832498,-709.2520263452116,9.746651066682944,-682.6107005503543,-76.26868533208905C-655.969374755497,-162.28402173086104,-624.0311958729363,-264.9436547460209,-571.7627457812107,-345.1582502793122C-519.494295689485,-425.3728458126035,-457.72773305507866,-498.43406332402117,-369.00000000000034,-557.5562585318366C-280.272266944922,-616.6784537396521,-127.29158072435274,-691.8491602703616,-39.39634745074068,-699.891421526205C48.49888582287139,-707.9336827820484,66.16401593835803,-644.0527678836073,158.37139964167204,-605.8098260668975C250.57878334498605,-567.5668842501876,447.0934791865413,-547.398427948433,513.8479547691434,-470.43377062594584C580.6024303517455,-393.4691133034587,509.70624559880855,-225.92751056963218,558.8982531372847,-144.02188213197456C608.0902606757608,-62.11625369431695,784.956526650889,-39.95237393459589,809,20.999999999999815C833.043473349111,81.95237393459553,767.1027008490355,164.06087419638797,703.1590932319507,221.69236147559968"
                fill="#8465cb"
              />
            </svg>
          </div>
          <div className="absolute right-0 bottom-0 w-[800px]">
            <svg
              width="800"
              height="280"
              viewBox="0 0 1920 1080"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="1920" height="1080" fill="#121312" />
              <path
                d="M2521.457627281888,1124.9999999999998C2474.6624772071896,1215.058338824394,2366.4618507550204,1313.3260457888425,2330.3881927837597,1407.0524823068502C2294.314534812499,1500.7789188248578,2336.302323895761,1619.9853016222933,2305.015679454323,1687.3586191080458C2273.729035012885,1754.7319365937983,2210.9598569452314,1780.2035868183384,2142.668326135131,1811.292387221365C2074.3767953250303,1842.3811876243917,1989.7112156162411,1931.7119197497223,1895.2664945937192,1873.891421526205C1800.8217735711974,1816.0709233026878,1644.3659207442286,1522.5448115980696,1576.0000000000002,1464.3693978802612C1507.634079255772,1406.1939841624528,1492.0511087968048,1563.154597692605,1485.0709701283492,1524.8389392193549C1478.0908314598937,1486.5232807461048,1535.8802693080388,1328.6042315962059,1534.1191679892665,1234.4754470407602C1532.3580666704943,1140.3466624853145,1509.4846811774623,1056.9519629300332,1474.5043622157161,960.0662318866807C1439.52404325397,863.1805008433282,1273.9796777174404,708.2300310343923,1324.2372542187893,653.1610607806452C1374.4948307201382,598.0920905268982,1684.3220881687316,661.0069892044597,1776.0498212238099,629.6524103641985C1867.7775542788881,598.2978315239374,1814.837374985702,491.3098489548354,1874.6036525492593,465.03358773907826C1934.3699301128167,438.7573265233211,2043.2734362351734,424.28184335128907,2134.647486605154,471.9948430696559C2226.0215369751345,519.7078427880227,2343.429353664677,685.5269850008077,2422.847954769143,751.3115860492792C2502.2665558736094,817.0961870977507,2594.7241478131596,804.4210470353644,2611.1590932319505,866.7024493604845C2627.5940386507414,928.9838516856046,2568.2527773565866,1034.9416611756055,2521.457627281888,1124.9999999999998C2474.6624772071896,1215.058338824394,2366.4618507550204,1313.3260457888425,2330.3881927837597,1407.0524823068502"
                fill="#8465cb"
              />
            </svg>
          </div>

          <div className="z-10 pb-8 ">
            <Image src={farcaster} alt="farcaster" className="h-20 w-20" />
          </div>
          <div className=" text-white z-10 text-center space-y-6">
            <h1 className="text-4xl font-bold ">Round Details</h1>
            <div className="space-y-6">
              {/* <div className=" bg-white rounded-xl p-3 text-black"> */}
              <p className=" max-w-lg">
                Welcome to the VIP lounge, where you hold the power to unveil
                the chosen ones! With just a tap of your finger, you can reveal
                the elite contenders of each round. Feel the rush of authority
                as you decide who gets the spotlight next
              </p>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
