import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { getCompetitorEntries } from "../../../utils/kv";

// Get entry function to get all the entries in the contest

export async function GET(request: NextRequest) {
  try {
    const { userIds, entries } = await getCompetitorEntries();
    console.log(userIds, entries);
    return new Response(JSON.stringify({ userIds, entries }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

// set Entry function , to add a new user entry to tournament

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    // Parse and validate the frame message
    const { isValid, message } = await validateFrameMessage(body);
    console.log(message);
    if (!isValid || !message) {
      return new Response("Invalid message", { status: 400 });
    }

    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
    const frameMessage = await getFrameMessage(body);
    const entry = frameMessage.inputText;
    const fid = frameMessage.requesterFid;
    console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    const totalRecords = await kv.dbsize();
    if (totalRecords >= 8) {
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/EntryClosed.png`,
        ogImage: `${imageUrlBase}/EntryClosed.png`,
        postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/contest`,
      };

      // Return the frame as HTML
      const html = getFrameHtml(frame);
      console.log("Entry Closed , Total Completed");

      // or Wrong / Invalid Submission frame

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
      // send not accepting response frame
    }

    // check if the user has already given the entry
    const record = await kv.get(`${fid}`);
    if (record !== null && record !== undefined) {
      console.log("Already Entered the contest");
      // send Already entered the contest frame
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/DuplicateEntry.png`,
        ogImage: `${imageUrlBase}/DuplicateEntry.png`,
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

    // submit the entry along with this fid to the backend database
    await kv.set(`${fid}`, entry);

    // Use the frame message to build the frame
    // Success Frame
    const frame: Frame = {
      version: "vNext",
      image: `${imageUrlBase}/Success.png`,
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
