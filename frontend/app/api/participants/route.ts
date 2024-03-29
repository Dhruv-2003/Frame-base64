import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

// Participants Frame
// This frame is used to display the participants of the contest

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log(body);

    // Parse and validate the frame message
    // const { isValid, message } = await validateFrameMessage(body);
    // console.log(message);
    // if (!isValid || !message) {
    //   return new Response("Invalid message", { status: 400 });
    // }

    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
    // const frameMessage = await getFrameMessage(body);
    // console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    const frame: Frame = {
      version: "vNext",
      image: `${imageUrlBase}/api/images/contest/participants`,
      buttons: [
        {
          label: `🔙 Back`,
          action: "post",
        },
      ],
      ogImage: `${imageUrlBase}/api/images/contest/participants`,
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/results/default`,
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
