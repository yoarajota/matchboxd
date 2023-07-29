import { NextResponse, type NextRequest } from "next/server";
import { Films, WatchList } from "../../../types";
import { getFromLetterboxd } from "../../../helpers/backend/letterboxd";
import { getListIntersection, mountResult } from "@/helpers/backend";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { users, type } = await request.json();

  try {
    // console.time("Getting Films");

    const result: WatchList[] | Films[] = await Promise.all(
      users.map(
        (username: string) =>
          new Promise((resolve, reject) =>
            getFromLetterboxd(resolve, reject, username, type)
          )
      )
    ).catch((error) => {
      throw error;
    });

    // console.timeEnd("Getting Films");
    // console.log("x-x-x-x-x-x-x");
    // console.time("Mount Return");

    let a = getListIntersection(result, type);
    let b = mountResult(result, type);

    // console.timeEnd("Mount Return");

    // console.log("Ended, tho", new Date().toTimeString());

    return NextResponse.json({
      match: a,
      result: b,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error ??
          "Something went wrong! Check the usernames that you requested to match!",
      },
      {
        status: 400,
      }
    );
  }
}
