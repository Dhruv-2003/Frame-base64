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

    const buttonIndex = body.untrustedData.buttonIndex;
    console.log(buttonIndex);

    const frameMessage = await getFrameMessage(body);
    // console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame
    const frame: Frame = {
      image: `${process.env.NEXT_PUBLIC_HOST}/api/images/results/winner`,
      version: "vNext",
      buttons: [
        {
          label: "View all Participants",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/participants`,
        },
        {
          label: "Round 1",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/rounds/1`,
        },
        {
          label: "Round 2",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/rounds/2`,
        },
        {
          label: "Round 3",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/rounds/3`,
        },
      ],
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/results`,
      ogImage: `${process.env.NEXT_PUBLIC_HOST}/api/images/results/winner`,
    };

    // Return the frame as HTML
    const html = getFrameHtml(frame);

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
