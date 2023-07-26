import axios from 'axios'
import { JSDOM } from 'jsdom';
import { Film, WatchList } from '../types';

async function getWatchlist(resolve: ((e: WatchList) => void), user: string) {
    let has = true;
    let c = 0;

    const watchlist: Array<Film> = []

    while (has) {
        const { window } = new JSDOM(await axios.get(`https://letterboxd.com/${user}/watchlist/page/` + c++).then((res) => { return res.data }));
        const parentDivsWithImageFirstChild = window.document.querySelectorAll('.really-lazy-load.poster.film-poster');

        for (let div of parentDivsWithImageFirstChild) {
            let obj: Film = { slug: "", alt: "" };

            for (let { localName, textContent } of div.attributes) {
                if (localName === "data-film-slug" && textContent) {
                    obj.slug = textContent
                    break;
                }
            }

            for (let { localName, textContent } of div.children[0].attributes) {
                if (localName === "alt" && textContent) {
                    obj.alt = textContent
                    break;
                }
            }

            watchlist.push(obj)
        }

        has = parentDivsWithImageFirstChild.length !== 0
    }

    resolve({ watchlist, user })
}

export { getWatchlist }