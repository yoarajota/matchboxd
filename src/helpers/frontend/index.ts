import { Film } from "@/types/index";
import axios, { AxiosPromise } from "axios";
import { repeat } from "lodash";

export const WATCHLIST = 1;
export const FILMS = 2;
export function getFromLetterboxd(type: number, obj: any): AxiosPromise {
  let typeString;
  switch (type) {
    case WATCHLIST:
      typeString = "watchlist";
      break;
    case FILMS:
      typeString = "films";
      break;
    default:
      throw Error("Wrong type!");
  }

  return axios.post(process.env.API_URL + "/letterboxd", {
    ...obj,
    type: typeString,
  });
}

export function mountStringToCopy(list: Array<Film>) {
  let resultString = "";
  for (let key in list) {
    let curr = key + " " + "-".repeat(10 - key.length) + "\n";
    curr += "Name: " + list[key].alt + "\n";
    curr += "Link: " + "https://www.letterboxd.com/" + list[key].slug + "\n";
    resultString += curr
  }

  return resultString;
}