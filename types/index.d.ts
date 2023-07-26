export type Film = {
    alt: string,
    slug: string
}

export type WatchList = {
    watchlist: Array<Film>,
    user: string
}