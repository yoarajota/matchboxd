import axios from "axios";
import { JSDOM } from "jsdom";
import { Film, WatchList } from "../src/types";

async function getWatchlist(
  resolve: (e: WatchList) => void,
  reject: (e: string) => void,
  username: string
) {
  let has = true;
  let c = 0;

  const watchlist = new Set<string>();

  while (has) {
    const { window } = new JSDOM(
      await axios
        .get(`https://letterboxd.com/${username}/watchlist/page/` + c++)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            reject(`${username} is not a valid letterboxd username!`);
          }
        })
    );
    const parentDivsWithImageFirstChild = window.document.querySelectorAll(
      ".really-lazy-load.poster.film-poster"
    );

    for (let div of parentDivsWithImageFirstChild) {
      let obj: Film = { slug: "", alt: "" };

      for (let { localName, textContent } of div.attributes) {
        if (localName === "data-film-slug" && textContent) {
          obj.slug = textContent;
          break;
        }
      }

      for (let { localName, textContent } of div.children[0].attributes) {
        if (localName === "alt" && textContent) {
          obj.alt = textContent;
          break;
        }
      }

      watchlist.add(JSON.stringify(obj));
    }

    has = parentDivsWithImageFirstChild.length !== 0;
  }

  resolve({
    watchlist: Array.from(watchlist).map((string): Film => JSON.parse(string)),
    username,
  });
}

export { getWatchlist };
