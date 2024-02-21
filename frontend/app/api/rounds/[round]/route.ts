import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { round: string } }
) {
  try {
    const body = await request.json();
    console.log(body);
    console.log(params.round);

    const imageUrlBase = `${process.env.NEXT_PUBLIC_HOST}`;
    const targetUrlBase = `${process.env.NEXT_PUBLIC_HOST}/api/rounds/${params.round}/match`;
    const frameMessage = await getFrameMessage(body);
    // console.log(frameMessage);
    // TODO :  Need to check if the total entry is already 8 , if yes return an unsuccessful frame

    if (Number(params.round) == 1) {
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
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
        ogImage: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
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
    } else if (Number(params.round) == 2) {
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
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
        ogImage: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
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
    } else if (Number(params.round) == 3) {
      const frame: Frame = {
        version: "vNext",
        image: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
        buttons: [
          {
            label: `Finale`,
            action: "post",
            target: `${targetUrlBase}/1`,
          },
        ],
        ogImage: `${imageUrlBase}/api/images/rounds?round=${params.round}`,
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
