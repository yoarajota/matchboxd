import { Films, Film, Scope, WatchList } from "@/types";
import axios from "axios";
import { DOMWindow } from "jsdom";
import { JSDOM } from "jsdom";

type Resolve = { index: number; sectionResult: Array<string> };

async function getFromLetterboxd(
  resolve: (e: Films | WatchList) => void,
  reject: (e: string) => void,
  username: string,
  scope: Scope
) {
  const list = new Set<string>();
  let otherC = 1;
  let amountRequests = 5;
  let storeWindowFirstReq: DOMWindow;

  // console.log(
  //   "getFromLetterboxd start x-x-x-x-x-x " + new Date().toTimeString()
  // );

  // console.time(username + " ===> First Query");

  await axios
    .get(`https://letterboxd.com/${username}/${scope}/page/1`)
    .then(async (response) => {
      const { window } = new JSDOM(response.data);
      storeWindowFirstReq = window;

      const paginate = window.document.getElementsByClassName("paginate-page");

      if (paginate.length !== 0) {
        amountRequests = parseInt(
          paginate?.[paginate.length - 1]?.textContent ?? "5"
        );
      } else {
        if (
          window.document.querySelectorAll(
            ".really-lazy-load.poster.film-poster"
          )?.length !== 0
        ) {
          amountRequests = 1;
        } else {
          if (scope === "films") {
            resolve({
              [scope]: [] as Array<Film>,
              username,
            } as Films);
          } else {
            resolve({
              [scope]: [] as Array<Film>,
              username,
            } as WatchList);
          }
        }
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        reject(`${username} is not a valid letterboxd username!`);
      }
    });

  // console.timeEnd(username + " ===> First Query");

  // console.log("----------------");

  // console.time(username + " ===> Query Bomb");

  let arrPromises: Array<Promise<Resolve>> = [];
  let holdaOldOtherC = otherC;

  while (otherC !== holdaOldOtherC + amountRequests) {
    let curr = otherC;
    arrPromises.push(
      new Promise(async (res, rej) => {
        if (otherC === 1) {
          // console.time(username + " ===> Retrieve Data");
          // console.timeEnd(username + " ===> Retrieve Data");
          retrieveData(storeWindowFirstReq, res, curr);
          return;
        }

        axios
          .get(`https://letterboxd.com/${username}/${scope}/page/` + curr)
          .then(async (response) => {
            const { window } = new JSDOM(response.data);
            retrieveData(window, res, curr);
          })
          .catch((error) => {
            // console.log(error);

            if (error.response.status === 404) {
              reject(`${username} is not a valid letterboxd username!`);
            }
          });
      })
    );

    otherC++;
  }

  await Promise.all(arrPromises).then((respones) => {
    // console.timeEnd(username + " ===> Query Bomb");

    // console.log("----------------");

    // console.time(username + " ===>  Sort and Threat");
    let sortedArray = respones.slice().sort((a, b) => a.index - b.index);

    for (let response of sortedArray) {
      for (let decoded of response.sectionResult) {
        list.add(decoded);
      }
    }

    // console.timeEnd(username + " ===>  Sort and Threat");
  });

  // console.time(username + " ===>  Finaly");

  const result = {
    [scope]: Array.from(list).map((string): Film => JSON.parse(string)),
    username,
  };

  // console.timeEnd(username + " ===>  Finaly");

  if (scope === "films") {
    resolve(result as Films);
  } else {
    resolve(result as WatchList);
  }
}

function retrieveData(
  window: DOMWindow,
  res: (a: Resolve) => void,
  curr: number
) {
  const parentDivsWithImageFirstChild = window.document.querySelectorAll(
    ".really-lazy-load.poster.film-poster"
  );

  let sectionResult = [];

  if (parentDivsWithImageFirstChild.length !== 0) {
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

      sectionResult.push(JSON.stringify(obj));
    }
  }

  res({ index: curr, sectionResult });
}

export { getFromLetterboxd };