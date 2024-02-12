import Image from "next/image";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";
import waves1 from "../../public/waves1.svg";
import waves2 from "../../public/waves2.svg";
import farcaster from "../../public/farcaster.png";
import Contest from "../../components/contest";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.NEXT_PUBLIC_HOST}/result.png`,
  version: "vNext",
  buttons: [
    {
      label: "View all Participants",
      action: "post",
    },
  ],
  postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/result`,
};

// Export Next.js metadata
export const metadata: Metadata = {
  title: "Frames-64 Game",
  description: "This is a Tournament & Prediction Game on Farcaster Frames.",
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST}/contest.png`,
      },
    ],
  },
  other: getFrameFlattened(initialFrame),
};

export default function Results() {
  return (
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
      <div className=" z-10 text-white flex flex-col space-y-5 items-center justify-center max-w-3xl text-center">
        <Image src={farcaster} alt="farcaster" className=" w-20" />
        <h1 className=" text-4xl font-semibold">
          Hold tight fam, we cooking up the results!
        </h1>
        <p>
          Stay tuned, comedy connoisseurs! The results are simmering like a
          punchline about to land. {`We're`} crunching the numbers, decoding the
          laughs, and preparing to unveil the champions of chuckles. Sit tight
          and keep an eye out on our frames.
        </p>
      </div>
    </div>
  );
}
