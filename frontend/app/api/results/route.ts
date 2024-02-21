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

    const targetURLBase = `${process.env.NEXT_PUBLIC_HOST}/api`;
    let finalURL = "";
    const frameMessage = await getFrameMessage(body);
    // console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    if (buttonIndex === 1) {
      // participants call
      const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
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
        postUrl: `${process.env.NEXT_PUBLIC_HOST}/results`,
      };

      // Return the frame as HTML
      const html = getFrameHtml(frame);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
    } else if (buttonIndex === 2) {
      // round 1 call
      const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
      const targetUrlBase = `${process.env.NEXT_PUBLIC_HOST}/api/rounds/1/match`;
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
        postUrl: targetUrlBase,
      };
      // Return the frame as HTML
      const html = getFrameHtml(frame);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
    } else if (buttonIndex === 3) {
      // round 2 call
      const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
      const targetUrlBase = `${process.env.NEXT_PUBLIC_HOST}/api/rounds/2/match`;
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/api/images/rounds?round=2`,
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
        ],
        ogImage: `${imageUrlBase}/api/images/rounds?round=2`,
        postUrl: targetUrlBase,
      };

      // Return the frame as HTML
      const html = getFrameHtml(frame);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
    } else if (buttonIndex === 4) {
      // round 3 call
      const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
      const targetUrlBase = `${process.env.NEXT_PUBLIC_HOST}/api/rounds/3/match`;
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/api/images/rounds?round=3`,
        buttons: [
          {
            label: `Finale`,
            action: "post",
            target: `${targetUrlBase}/1`,
          },
        ],
        ogImage: `${imageUrlBase}/api/images/rounds?round=3`,
        postUrl: targetUrlBase,
      };

      // Return the frame as HTML
      const html = getFrameHtml(frame);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
    } else {
      return new Response("Incorrect Button index", {
        status: 500,
      });
    }
    // or Wrong / Invalid Submission frame
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
