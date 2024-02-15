import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
    const targetUrlBase = `${process.env.NEXT_PUBLIC_HOST}/api/rounds/round1/match`;
    const frameMessage = await getFrameMessage(body);
    console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    const frame: Frame = {
      version: "vNext",
      image: `${imageUrlBase}/api/images/rounds?round=1`,
      buttons: [
        {
          label: `Match 1`,
          action: "post",
          target: `${targetUrlBase}/1`,
        },
        {
          label: `Match 2`,
          action: "post",
          target: `${targetUrlBase}/2`,
        },
        {
          label: `Match 3`,
          action: "post",
          target: `${targetUrlBase}/3`,
        },
        {
          label: `Match 4`,
          action: "post",
          target: `${targetUrlBase}/4`,
        },
      ],
      ogImage: `${imageUrlBase}/api/images/rounds?round=1`,
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/results`,
    };

    // Return the frame as HTML
    const html = getFrameHtml(frame);

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
      postUrl: `${process.env.NEXT_PUBLIC_HOST}`,
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
