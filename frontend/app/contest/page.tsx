import Image from "next/image";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.NEXT_PUBLIC_HOST}/contest.png`,
  version: "vNext",
  buttons: [
    {
      label: "Vote / Participate in the Contest",
      action: "link",
      target: `${process.env.NEXT_PUBLIC_HOST}/contest`,
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
    <main className="py-32">
      <a>Just an Experimentation</a>
    </main>
  );
}
