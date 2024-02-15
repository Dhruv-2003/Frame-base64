import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  getUserDataForFid,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const round = searchParams.get("round");
    const match = searchParams.get("match");
    console.log(round, match);

    const roundData = await kv.hgetall(`r-${round}:m-${match}`);
    console.log(roundData);
    if (roundData) {
      return new Response(JSON.stringify({ roundData }), {
        status: 200,
      });
    } else {
      return new Response("No Round Data Found Yet", {
        status: 404,
      });
    }
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    // extract the round and match id and fetch the user's data from frame'js and then store it
    const { roundId, matchId, fid1, fid2 } = body;
    const userData1 = await getUserDataForFid({ fid: fid1 });
    const userData2 = await getUserDataForFid({ fid: fid2 });

    const data = {
      user1: userData1,
      user2: userData2,
    };

    await kv.hset(`r-${roundId}:m-${matchId}`, data);

    return new Response("Round Winner Stored Successfully", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
}
