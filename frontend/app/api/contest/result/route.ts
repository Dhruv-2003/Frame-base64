import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  getUserDataForFid,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";

// Get winner results from the KV

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const round = searchParams.get("round");
    const match = searchParams.get("match");
    console.log(round, match);

    const roundData = await kv.hgetall(`r-${round}:m-${match}`);
    console.log(roundData);
    if (roundData && roundData.winner) {
      return new Response(JSON.stringify(roundData.winner), {
        status: 200,
      });
    } else {
      return new Response("No Winner Found Yet", {
        status: 404,
      });
    }
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

// add results into the KV db

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    // extract the round and match id and fetch the user's data from frame'js and then store it
    const { roundId, matchId, winnerFid } = body;
    const winnerData = await getUserDataForFid({ fid: winnerFid });

    const roundData = await kv.hgetall(`r-${roundId}:m-${matchId}`);

    const data = {
      ...roundData,
      winner: winnerData,
    };

    await kv.hset(`r-${roundId}:m-${matchId}`, data);

    return new Response("Round Winner Stored Successfully", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
}
