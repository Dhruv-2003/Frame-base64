import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { round: string; match: string } }
) {
  try {
    const body = await request.json();
    // console.log(body);

    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
    // const frameMessage = await getFrameMessage(body);
    // console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    const frame: Frame = {
      version: "vNext",
      image: `${imageUrlBase}/api/images/results?round=${params.round}&match=${params.match}`,
      buttons: [
        {
          label: `🔙 Back`,
          action: "post",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/results/default`,
        },
      ],
      ogImage: `${imageUrlBase}/api/images/results?round=${params.round}&match=${params.match}`,
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/results/default`,
    };

    // Return the frame as HTML
    const html = getFrameHtml(frame);
    console.log(html);

    // or Wrong / Invalid Submission frame

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;

    const frame: Frame = {
      version: "vNext",
      image: `${imageUrlBase}/InvalidEntry.png`,
      ogImage: `${imageUrlBase}/InvalidEntry.png`,
      buttons: [
        {
          label: `Back`,
          action: "post",
        },
      ],
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/results/default`,
    };

    // Return the frame as HTML
    const html = getFrameHtml(frame);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    });
  }
}
