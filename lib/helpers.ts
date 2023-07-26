import { Film, WatchList } from "../types";

export function getWatchListIntersection(arrays: WatchList[]): Array<Film> {
    const filmMap: Map<string, Film> = new Map();

    for (const film of arrays[0].watchlist) {
        filmMap.set(film.slug, film);
    }

    for (let i = 1; i < arrays.length; i++) {
        const watchList = arrays[i];

        if (watchList.watchlist.length === 0) {
            filmMap.clear()
            break;
        }

        filmMap.forEach((outsideFilm) => {
            let finded = false;

            for (const film of watchList.watchlist) {
                const key = film.slug;

                if (!finded && key === outsideFilm.slug) {
                    finded = true;
                }

                const existingFilm = filmMap.get(key);

                if (!existingFilm || !isFilmEqual(existingFilm, film)) {
                    filmMap.delete(key);
                }
            }

            if (!finded) {
                filmMap.delete(outsideFilm.slug)
            }
        })

    }

    return Array.from(filmMap.values());
}

function isFilmEqual(film1: Film, film2: Film): boolean {
    return film1.alt === film2.alt && film1.slug === film2.slug;
}