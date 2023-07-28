import { Films, Film, Scope, WatchList } from "@/types";
import axios from "axios";
import { JSDOM } from "jsdom";

async function getFromLetterboxd(
  resolve: (e: Films | WatchList) => void,
  reject: (e: string) => void,
  username: string,
  scope: Scope
) {
  const list = new Set<string>();
  let has = true;
  let c = 0;
  while (has) {
    c++;
    const { window } = new JSDOM(
      await axios
        .get(`https://letterboxd.com/${username}/${scope}/page/` + c)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);

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

      list.add(JSON.stringify(obj));
    }

    has = parentDivsWithImageFirstChild.length !== 0;
  }

  const result = {
    [scope]: Array.from(list).map((string): Film => JSON.parse(string)),
    username,
  };

  if (scope === "films") {
    resolve(result as Films);
  } else {
    resolve(result as WatchList);
  }
}

export { getFromLetterboxd };
