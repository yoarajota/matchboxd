import { NextResponse, type NextRequest } from 'next/server'
import { getWatchlist } from '../../../lib/watchlist';
import { WatchList } from '../../../types';
import { getWatchListIntersection } from '../../../lib/helpers';

export async function POST(request: NextRequest, res: any) {
    const { users } = await request.json()
    const result: WatchList[] = await Promise.all(users.map((user: string) => new Promise((resolve) => getWatchlist(resolve, user))));

    return NextResponse.json({ match: getWatchListIntersection(result), result })
}