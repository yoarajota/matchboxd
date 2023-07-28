import { NextResponse, type NextRequest } from "next/server";
import { Films, WatchList } from "../../../types";
import { getFromLetterboxd } from "../../../helpers/backend/letterboxd";
import { getListIntersection, mountResult } from "@/helpers/backend";

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const { users, type } = await request.json();

  try {
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

    return NextResponse.json({
      match: getListIntersection(result, type),
      result: mountResult(result, type),
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