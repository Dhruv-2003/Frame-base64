import Image from "next/image";
import farcaster from "../public/farcaster.png";
import waves1 from "../public/waves1.svg";
import waves2 from "../public/waves2.svg";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.NEXT_PUBLIC_HOST}/Welcome.png`,
  version: "vNext",
  buttons: [
    {
      label: "Submit Entry",
      action: "post",
    },
  ],
  inputText: "Enter your dad joke here",
  postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/entries`,
};

// Export Next.js metadata
export const metadata: Metadata = {
  title: "Frames-64 Game",
  description: "This is a Tournament & Prediction Game on Farcaster Frames.",
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST}/frame1.png`,
      },
    ],
  },
  other: getFrameFlattened(initialFrame),
};

export default function Home() {
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
        <div className=" z-10 text-white flex flex-col space-y-5 items-center justify-center max-w-3xl text-center">
          <Image src={farcaster} alt="farcaster" className=" w-20" />
          <h1 className=" text-4xl font-semibold">
            Haiyaaah, Welcome to Frames-64
          </h1>
          <p>
            Welcome to our lab of laughs, where {`we're`} mixing wit with whimsy
            and experimenting with the very fabric of humor itself! Step into
            our world of frames, where every joke is a brushstroke on the canvas
            of comedy. Warning: side effects may include uncontrollable laughter
            and a newfound appreciation for puns. Checkout our framse, we dare
            you :D
          </p>
        </div>
      </div>
    </>
  );
}
