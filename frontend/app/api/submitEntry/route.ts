import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Parse and validate the frame message
  const { isValid, message } = await validateFrameMessage(body);
  if (!isValid || !message) {
    return new Response("Invalid message", { status: 400 });
  }

  const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
  const frameMessage = await getFrameMessage(body);
  const entry = frameMessage.inputText;
  const fid = frameMessage.requesterFid;

  // submit the entry along with this fid to the backend database

  // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

  // Use the frame message to build the frame
  // Success Frame
  const frame: Frame = {
    version: "vNext",
    image: `${imageUrlBase}/frame2.png`,
    buttons: [
      {
        label: `Share the link to your friends and Checkout the Frame`,
        action: "post",
      },
    ],
    ogImage: `${imageUrlBase}/frame2.png`,
    postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/contest`,
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
}
