import Image from "next/image";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";
import waves1 from "../../public/waves1.svg";
import waves2 from "../../public/waves2.svg";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.NEXT_PUBLIC_HOST}/api/images/contest/participants`,
  version: "vNext",
  buttons: [
    {
      label: `Round 1`,
      action: "post",
      target: `${process.env.NEXT_PUBLIC_HOST}/contest/rounds`,
    },
  ],
  postUrl: `${process.env.NEXT_PUBLIC_HOST}/contest`,
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

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-start py-20 gap-12 bg-[#121312] relative">
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
      </div>
    </main>
  );
}
