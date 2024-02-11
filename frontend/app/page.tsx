import Image from "next/image";
import frame1 from "../public/frame1.png";
import frame2 from "../public/frame2.png";
import farcaster from "../public/farcaster.png";
import waves1 from "../public/waves1.svg";
import waves2 from "../public/waves2.svg";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.NEXT_PUBLIC_HOST}/frame1.png`,
  version: "vNext",
  buttons: [
    {
      label: "Submit Entry",
      action: "post",
    },
  ],
  inputText: "Enter your dad joke here",
  postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/submitEntry`,
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
    <main className="py-32">
      <div className=" flex min-h-screen flex-col items-center justify-center gap-12">
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
          <div className=" text-white z-10 text-center space-y-4 x">
            <h1 className="text-5xl font-bold ">Frames-64</h1>
            <div className="pt-4 text-black grid grid-cols-12 gap-4 mx-auto">
              <div className=" bg-white rounded-xl p-3 col-span-4">Bob</div>
              <div className=" bg-white rounded-xl p-3 col-span-4">Alice</div>
              <div className=" bg-white rounded-xl p-3 col-span-4">Bob</div>
              <div className=" bg-white rounded-xl p-3 col-span-4">Alice</div>
              <div className=" bg-white rounded-xl p-3 col-span-4">Bob</div>
              <div className=" bg-white rounded-xl p-3 col-span-4">Alice</div>
              <div className=" bg-white rounded-xl p-3 col-span-6">Bob</div>
              <div className=" bg-white rounded-xl p-3 col-span-6">Bob</div>
            </div>
          </div>
        </div>

        <div className=" max-w-5xl">
          <Image src={frame1} alt="frame1" />
        </div>
        <div className=" max-w-5xl">
          <Image src={frame2} alt="frame2" />
        </div>
      </div>
    </main>
  );
}

//  <Image
//           src={waves1}
//           alt="farcaster"
//           className="-z-9 absolute bottom-0 right-0 w-[640px]"
//         />
//         <Image
//           src={waves2}
//           alt="farcaster"
//           className="absolute left-0 top-0 -z-10 w-[800px]"
//         />

// {/* <p className=" max-w-md">
//               Participate, compete or predict game results directly on Farcaster
//               frames :D
//             </p>

//             <div className="text-2xl pt-10 max-w-xl">
//               Drop your dad joke bomb here
//             </div> */}
