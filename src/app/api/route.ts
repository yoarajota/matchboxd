import { NextResponse, type NextRequest } from "next/server";
import { getWatchlist } from "../../../lib/watchlist";
import { WatchList } from "../../types";
import { getWatchListIntersection, mountResult } from "../../../lib/helpers";

export async function POST(request: NextRequest, res: any) {
  const { users } = await request.json();

  try {
    const result: WatchList[] = await Promise.all(
      users.map(
        (username: string) =>
          new Promise((resolve, reject) =>
            getWatchlist(resolve, reject, username)
          )
      )
    ).catch((error) => {
      throw error;
    });

    return NextResponse.json({
      match: getWatchListIntersection(result),
      result: mountResult(result),
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
